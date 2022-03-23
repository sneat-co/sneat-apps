/* eslint-disable */
// @ts-nocheck

import {
	IRecordChange,
	IRxReadonlyTransaction,
	IRxReadwriteTransaction,
	IRxStore,
	IRxStoreProvider,
	IValidator,
	RecordAction,
	RxMutation,
	RxReadonlyTransactionWorker,
	RxReadwriteTransactionWorker,
	RxTransaction,
	SelectResult,
} from './interfaces';
import { from, Observable, of, ReplaySubject, Subject, throwError } from 'rxjs';
import { IDBPDatabase, IDBPTransaction, openDB, OpenDBCallbacks } from 'idb';
import { catchError, map, mergeMap, share, tap } from 'rxjs/operators';
import { SyncBacklogKind } from './rx-sync-logger';
import { EntityKind, IRecord, RxRecordKey, SpecificOrUnknownSchema } from './schema';
import { ILogger, ILoggerFactory } from './logging';

let txId = 0;

abstract class IndexedDbRxTransaction<CustomSchema extends SpecificOrUnknownSchema> extends RxTransaction<CustomSchema> {
	public txId: number;
	readonly complete: Promise<void>;

	protected constructor(
		protected readonly logger: ILogger,
		protected readonly tx: IDBPTransaction<CustomSchema>,
		protected readonly kinds: readonly EntityKind<CustomSchema>[],
		readonly mode: 'readonly' | 'readwrite',
	) {
		super();
		if (!tx) {
			throw new Error('tx is a required parameter');
		}
		this.complete = tx.done;
		this.txId = (txId += 1);
		logger.info(`${this.constructor.name}.constructor(#${this.txId})`, kinds);
		// tx.done.then(() => {
		//     console.log(`IndexedDB transaction completed (${mode}#${this.txId}):`, this.kinds);
		// });
	}

	abstract override getById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T | undefined>;

	// tslint:disable-next-line:typedef
	protected objectStore<T extends IRecord>(name: EntityKind<CustomSchema>) {
		if (this.kinds.indexOf(name) < 0) {
			throw new Error(
				`Requested to open object store ${name as string} but transaction was started just for this stores: ${this.kinds.join(', ')}`,
			);
		}
		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return this.tx.objectStore(name);
		} catch (ex) {
			throw new Error(`Unknown object store "${name as string}": ${ex}`);
		}
	}
}

class IndexedDbRxReadonlyTransaction<CustomSchema extends SpecificOrUnknownSchema>
	extends IndexedDbRxTransaction<CustomSchema> implements IRxReadonlyTransaction<CustomSchema> {

	readonly isReadonly: boolean = true;

	constructor(
		override readonly logger: ILogger,
		override readonly tx: IDBPTransaction<CustomSchema>,
		override readonly kinds: readonly EntityKind<CustomSchema>[],
		override readonly mode: 'readwrite' | 'readonly',
	) {
		super(logger, tx, kinds, mode || 'readonly');
	}

	getById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: RxRecordKey): Observable<T | undefined> {
		if (!kind) {
			throw new Error('parameter `kind` is required');
		}
		if (!id) {
			throw new Error('parameter `id` is required');
		}
		this.logger.debug(`IndexedDbRxReadonlyTransaction.getById(${kind as string}, ${id})`);
		const objectStore = this.objectStore<T>(kind);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const result = from(objectStore.get(id)) as Observable<T>;
		return result.pipe(tap(v => {
			this.logger.debug(`IndexedDbRxReadonlyTransaction.getById(${kind as string}, ${id}) =>`, v);
		}));
	}

	// tslint:disable-next-line:no-any
	select<T extends IRecord>(kind: EntityKind<CustomSchema>, field: string | string[], value: any | any[] | IDBKeyRange)
		: Observable<SelectResult<T>> {
		let indexName: string;
		if (Array.isArray(field)) {
			if (!(Array.isArray(value))) {
				throw Error('If field parameter is an array the value should be array as well');
			}
			indexName = field.join('_');
		} else {
			indexName = field;
		}
		this.logger.debug(`IndexedDbRxReadonlyTransaction.select(${kind as string}, ${indexName}):`, value);
		const index = this.objectStore<T>(kind)
			.index(indexName);
		const queryBySingleKey: (v: string) => Observable<SelectResult<T>> = v => (from(index.getAll(v)) as Observable<T[]>).pipe(
			map(result => ({ key: v, values: result })),
		);
		if (Array.isArray(value) && !Array.isArray(field)) {
			return from(value)
				.pipe(
					mergeMap(queryBySingleKey),
				);
		}
		return queryBySingleKey(value as string);
	}
}

class IndexedDbRxReadwriteTransaction<CustomSchema extends SpecificOrUnknownSchema>
	extends IndexedDbRxReadonlyTransaction<CustomSchema>
	implements IRxReadwriteTransaction<CustomSchema> {

	readonly isReadonly = false;

	private changeNumber = 0;

	private readonly uncommitted: {
		[kind: string]: {
			[id: string]: {
				n?: number; // Sequential number of a change used to sort changes when TX completed
				record: IRecord;
				action?: RecordAction;
			};
		};
	} = {};

	constructor(
		readonly logger: ILogger,
		readonly tx: IDBPTransaction<CustomSchema>,
		readonly kinds: readonly EntityKind<CustomSchema>[],
		private readonly validators: { [kind: string]: IValidator },
		// private changed: (change: IRecordChange) => void,
	) {
		super(logger, tx, kinds, 'readwrite');
	}

	getById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T | undefined> {
		if (!kind || !id) {
			throw new Error(`Missing required parameter in IndexedDbRxReadonlyTransaction.getById(kind=${kind as string}, id=${id})`);
		}
		this.logger.debug(`IndexedDbRxReadwriteTransaction.getById(${kind as string}, ${id})`);
		let byKind = this.uncommitted[kind as string];
		if (!byKind) {
			byKind = {};
			this.uncommitted[kind as string] = byKind;
		}
		const recordChange = byKind[id];
		if (recordChange) {
			if (recordChange.action === RxMutation.delete) {
				return of(undefined);
			}
			return of(recordChange.record as T);
		}
		return super.getById<T>(kind, id)
			.pipe(
				// tap(v => console.log(`IndexedDbRxTransaction.getById(${kind}, ${id}) =>`, v)),
				tap(v => {
					if (v) {
						byKind[id] = { record: v };
					}
				}),
			);
	}

	public changes(): IRecordChange[] {
		const changes: IRecordChange[] = [];
		Object.entries(this.uncommitted)
			.forEach(entry => {
				const [kind, items] = entry;
				Object.values(items)
					.forEach(change => {
						const { n, action, record } = change;
						if (action && n) {
							changes.push({ n, kind, action, record });
						}
					});
			});
		return changes.sort((a, b) => a.n - b.n);
	}

	private readonly newID = () => Math.random()
		.toString()
		// tslint:disable-next-line:no-magic-numbers
		.substr(2);

	private updateUncommitted<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T, action: RecordAction): T {
		let byKind = this.uncommitted[kind as string];
		if (!byKind) {
			this.uncommitted[kind as string] = byKind = {};
		}
		const n = this.changeNumber += 1;
		const entry = byKind[record.id as string];
		if (entry) {
			entry.record = record;
			if (!(entry.action === RxMutation.add && action === RxMutation.update)) {
				entry.action = action;
			}
		} else {
			byKind[record.id as string] = { n, record, action };
		}
		this.logger.debug(`IndexedDbRxReadwriteTransaction.updateUncommitted(${kind as string}, ${record.id}, ${action})`, this.uncommitted);
		return record;
	}

	private validate<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): void {
		this.validators[kind as string].validate(record);
	}

	add<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): Observable<T> {
		if (!record.id && kind as string !== SyncBacklogKind) { // TODO: Check some policy regards autoincrement
			record.id = this.newID();
		}
		this.validate(kind, record);
		if (!record.v) {
			record.v = { l: 1 };
		}
		record.ts = new Date().toISOString();
		return from(this.objectStore<T>(kind)
			.add(record))
			.pipe(
				map(() => this.updateUncommitted(kind, record, RxMutation.add)),
				catchError(err => {
					throw new Error(`Failed to add ${kind as string}(id=${record.id}): ${err}`);
				}),
			);
	}

	put<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): Observable<T> {
		this.validate(kind, record);
		if (!record.v) {
			record.v = { l: 1 };
		} else if (!record.v.l) {
			record.v.l = 1;
		} else {
			record.v.l += 1;
		}
		record.ts = new Date().toISOString();

		try {
			const promise = this.objectStore<T>(kind)
				.put(record);
			return from(promise)
				.pipe(
					map(() => this.updateUncommitted(kind, record, RxMutation.update)), // Operator `mapTo` should NOT be used here?
				);
		} catch (e) {
			throw new Error(`Failed to put ${kind as string}(${record.id}): ${e}`);
		}
	}

	delete(kind: EntityKind<CustomSchema>, id: RxRecordKey): Observable<RxRecordKey> {
		if (!id && (id as unknown as number) !== 0) {
			throw new Error('id is required parameter');
		}
		const objectStore = this.objectStore<IRecord>(kind);
		const promise = objectStore.delete(id);

		return from(promise)
			.pipe(
				map(() => { // Seems `mapTo()` can't be used here
					let byKind = this.uncommitted[kind as string];
					if (!byKind) {
						this.uncommitted[kind as string] = byKind = {};
					}
					const recordChange = byKind[id];
					if (recordChange) {
						recordChange.action = RxMutation.delete;
					} else {
						byKind[id] = { action: RxMutation.delete, record: { id } };
					}
					return id;
				}),
			);
	}
}

export class IndexedDbRxStore<CustomSchema extends SpecificOrUnknownSchema> implements IRxStore<CustomSchema> {
	private readonly changed$ = new Subject<IRecordChange>();
	readonly changed: Observable<IRecordChange> = this.changed$
		.asObservable()
		.pipe(
			share<IRecordChange>(),
		);

	private readonly logger: ILogger;

	constructor(
		public db: IDBPDatabase<CustomSchema>,
		private readonly validators: { [kind: string]: IValidator },
		readonly loggerFactory: ILoggerFactory,
		public readonly connectionID?: number,
	) {
		this.logger = loggerFactory.getLogger('RxStore');
		this.logger.debug(`IndexedDbRxStore.constructor(connectionID=${connectionID})`);
	}

	public close(): void {
		this.db.close();
	}

	// TODO: make static
	// tslint:disable-next-line:prefer-function-over-method
	private validateTxParams<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadonlyTransactionWorker<T, CustomSchema> | RxReadwriteTransactionWorker<T, CustomSchema>,
	): void {
		if (!storeNames || !storeNames.length) {
			throw Error('storeNames is empty');
		}
		if (!worker) {
			throw new Error('worker is a required parameter');
		}
	}

	// tslint:disable-next-line:typedef
	private createIdbTx(storeNames: readonly EntityKind<CustomSchema>[], mode: IDBTransactionMode) {
		const idbStoreNames = storeNames.map(storeName => {
			// tslint:disable-next-line:ban-ts-ignore
			// @ts-ignore
			const objStoreName = this.db.objectStoreNames[storeName];
			return objStoreName || storeName;
		});
		try {
			// tslint:disable-next-line:ban-ts-ignore
			// @ts-ignore
			return this.db.transaction(idbStoreNames, mode);
		} catch (e) {
			if (
				e && (e as object).toString()
					.indexOf('One of the specified object stores was not found') >= 0) {
				this.logger.error('One of the specified object stores was not found:', idbStoreNames);
			}
			throw e;
		}
	}

	// noinspection JSUnusedGlobalSymbols
	public readonlyTransaction<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadonlyTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		this.validateTxParams(storeNames, worker);
		const idbTx = this.createIdbTx(storeNames, 'readonly');
		const roTx = new IndexedDbRxReadonlyTransaction(this.logger, idbTx, storeNames, 'readonly');
		return worker(roTx);
	}

	public readwriteTransaction<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadwriteTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		this.validateTxParams(storeNames, worker);
		storeNames.forEach(storeName => {
			if (!this.validators[storeName as string]) {
				throw new Error(`No validator for object store "${storeName as string}".`);
			}
		});
		const idbTx = this.createIdbTx(storeNames, 'readwrite');
		const rwTx = new IndexedDbRxReadwriteTransaction<CustomSchema>(this.logger, idbTx, storeNames, this.validators);
		idbTx.done
			.then(() => {
				const changes = rwTx.changes();
				this.logger.debug('idbTx changes:', changes);
				changes.forEach((change: IRecordChange | undefined) => {
					this.changed$.next(change);
				});
			})
			// tslint:disable-next-line:no-any
			.catch((e: any) => {
				this.logger.error('idbTx.done failed', e);
			});
		return worker(rwTx);
	}

	// tslint:disable-next-line:prefer-function-over-method
	public watchById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T | undefined> {
		return throwError('Not supported');
	}
}

export type IdbUpgradeCallback<CustomSchema extends SpecificOrUnknownSchema> = (
	db: IDBPDatabase<CustomSchema>, oldVersion: number, newVersion: number,
	tx: IDBPTransaction<CustomSchema>,
) => void;

export class IndexedDbRxStoreProvider<CustomSchema extends SpecificOrUnknownSchema> extends IRxStoreProvider<CustomSchema> {
	private store: IndexedDbRxStore<CustomSchema>;
	private readonly store$ = new ReplaySubject<IndexedDbRxStore<CustomSchema>>(1);
	private readonly logger: ILogger;

	constructor(
		private readonly name: string,
		private readonly version: number,
		private readonly upgradeCallback: IdbUpgradeCallback<CustomSchema>,
		private readonly validators: { [kind: string]: IValidator },
		private readonly loggerFactory: ILoggerFactory,
	) {
		super();
		if (!upgradeCallback) {
			throw new Error('upgradeCallback is a required parameter');
		}
		this.logger = loggerFactory.getLogger('RxStoreProvider');
		this.logger.debug(`IndexedDbRxStoreProvider.constructor(name=${name}, version=${version})`);
	}


	private connectionID = 0;
	private isOpen: boolean;

	public get rxStore(): Observable<IndexedDbRxStore<CustomSchema>> {
		if (!this.isOpen) {
			this.openIdb()
				.catch(err => {
					this.logger.error('Failed to open IDB', err);
				});
		}
		return this.store$.asObservable();
	}

	private async openIdb(): Promise<IDBPDatabase<CustomSchema>> {
		this.isOpen = true;
		// this.logger.debug(`IndexedDbRxStoreProvider.openIdb(name=${this.name}, version=${this.version})`);
		return new Promise<IDBPDatabase<CustomSchema>>((resolve, reject) => {
			// noinspection JSUnusedGlobalSymbols
			const openDbCallbacks: OpenDBCallbacks<CustomSchema> = {
				upgrade: (db: IDBPDatabase<CustomSchema>, oldVersion: number, newVersion: number, tx: IDBPTransaction<CustomSchema>) => {
					this.logger.info('IndexedDB upgradeCallback called');
					this.upgradeCallback(db, oldVersion, newVersion, tx);
				},
			};
			openDB<CustomSchema>(this.name, this.version, openDbCallbacks)
				.then((db: IDBPDatabase<CustomSchema>) => {
					this.connectionID += 1;
					// this.logger.debug(`IndexedDB opened (${this.connectionID}):`, db);
					this.store = new IndexedDbRxStore<CustomSchema>(db, this.validators, this.loggerFactory, this.connectionID);
					this.store$.next(this.store);
					resolve(db);
				})
				.catch(err => {
					this.logger.error('Failed to open IndexedDB', err);
					this.store$.error(err);
					reject(err);
				});
		});
	}


// public get rxStore(): Observable<IndexedDbRxStore> {
//     return this.store$.asObservable();
// }

// public recreateDb(): Promise<void> {
//     console.log('recreateDb()');
//     return new Promise<void>((resolve, reject) => {
//         console.log(`Getting IndexedDB to close (${this.name})...`);
//         this.rxStore.pipe(first()).subscribe(store => {
//             console.log(`Closing IndexedDB(${this.name})...`);
//             store.db.close();
//             setTimeout(() => {
//                 console.log(`Deleting IndexedDB(${this.name})...`);
//                 deleteDb(this.name).then(() => {
//                     console.log('IndexedDB deleted');
//                     setTimeout(() => {
//                         this.openIdb().then(() => {
//                             console.log('IndexedDB recreated:', this.name);
//                             resolve();
//                         }).catch(err => {
//                             console.error(`Failed to open indexed DB after deletion (${this.name})`, err);
//                             reject(err);
//                         });
//                     }, 100);
//                 }).catch(err => {
//                     console.error(`Failed to delete IndexedDB(${this.name}):`, err);
//                     reject(err);
//                 });
//             }, 100);
//         }, reject);
//     });
// }
}

