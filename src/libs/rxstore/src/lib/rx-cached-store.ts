import {Observable, of, ReplaySubject} from 'rxjs';
import {
	IRecordChange,
	IRxReadwriteTransaction,
	IRxStore,
	IRxStoreProvider,
	IRxTransaction, RxMutation,
	RxReadonlyTransactionWorker,
	RxReadwriteTransactionWorker, RxTransaction,
	SelectResult,
} from './interfaces';
import {first, map, shareReplay, tap} from 'rxjs/operators';
import {EntityKind, IRecord, Schema, RxRecordKey} from './schema';

interface RxCache<CustomSchema> {
	[kind: string]: {
		[id: string]: ReplaySubject<IRecord>;
	};
}

abstract class RxCachedTransaction<CustomSchema extends Schema | unknown> extends RxTransaction<CustomSchema> {

	readonly isReadonly: boolean = true;

	protected constructor(
		protected readonly tx: IRxTransaction<CustomSchema>,
	) {
		super();
		if (!tx) {
			throw new Error('tx is a required parameter');
		}
	}
}

class RxCachedReadwriteTransaction<CustomSchema extends Schema | unknown>
	extends RxCachedTransaction<CustomSchema>
	implements IRxReadwriteTransaction<CustomSchema> {

	private readonly txCache: TxCache = {}; // Transaction cache
	private readonly txDeleted: { [kind: string]: string[] } = {};

	override readonly isReadonly = false;

	public get complete(): Promise<void> {
		return this.txWrite.complete;
	}

	constructor(
		tx: IRxReadwriteTransaction<CustomSchema>,
		private readonly rxCache: RxCache<CustomSchema>, // Store cache
	) {
		super(tx);
		console.log(`RxCachedReadwriteTransaction() => tx:`, tx);
		this.txWrite.complete
			.then(() => {
				this.flushTxCache();
			})
			.catch(e => {
				console.error('Failed to flush TX cache', e);
			});
	}

	private flushTxCache(): void {
		console.log(
			'RxCachedReadwriteTransaction.flushTxCache() => flushing committed records to cache:',
			this.txCache,
			this.txDeleted,
		);
		Object.entries(this.txCache)
			.forEach(txKindEntry => {
				const [kind, txRecords] = txKindEntry;
				// if (kind === 'Commune') {
				// 	debugger;
				// }
				const kindCache = this.rxCache[kind];
				console.log('kindCache', kindCache);
				if (!kindCache) {
					return;
				}
				Object.entries(txRecords)
					.forEach(recordEntry => {
						const [id, record] = recordEntry;
						const subject = kindCache[id];
						if (!subject) {
							return;
						}
						console.log(`RxCachedReadwriteTransaction => flushing => emitting ${kind}=${id}`, record);
						subject.next(record);
					});
			});
	}

	public get txWrite(): IRxReadwriteTransaction<CustomSchema> {
		return this.tx as IRxReadwriteTransaction<CustomSchema>;
	}

	public add<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): Observable<T> {
		return this.txWrite.add(kind, record)
			.pipe(
				map(r => {
					this.updateTxCache(RxMutation.add, kind, r);
					return r;
				}),
			);
	}

	public put<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): Observable<T> {
		return this.txWrite.put(kind, record)
			.pipe(
				map(r => {
					this.updateTxCache(RxMutation.put, kind, r);
					return r;
				}),
			);
	}

	public delete(kind: EntityKind<CustomSchema>, id: string): Observable<string> {
		return this.txWrite.delete(kind, id)
			.pipe(
				map(id2 => {
					this.updateTxDeleted(kind, id2);
					return id2;
				}),
			);
	}

	private updateTxCache(operation: RxMutation.add | RxMutation.put | RxMutation.update, kind: EntityKind<CustomSchema>, r: IRecord): void {
		console.log(`updateTxCache(${operation}, ${kind as string}, ${r.id})`);
		if (r.id === undefined) {
			throw new Error('id is undefined');
		}
		const txCache = this.txCache;
		let txKind = txCache[kind as string];
		if (!txKind) {
			txCache[kind as string] = txKind = {};
		}
		txKind[r.id] = r;
	}

	private updateTxDeleted(kind: EntityKind<CustomSchema>, id: string): void {
		console.log(`updateTxDeleted(${kind as string}, ${id})`);
		const txKind = this.txCache[kind as string];
		if (txKind) {
			const txRecord = txKind[id];
			if (txRecord) {
				// tslint:disable-next-line:no-dynamic-delete
				delete txKind[id];
			}
		}
		const deletedIds = this.txDeleted[kind as string];
		if (deletedIds) {
			if (!deletedIds.indexOf(id)) {
				deletedIds.push(id);
			}
		} else {
			this.txDeleted[kind as string] = [id];
		}
	}

	public getById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T | undefined> {
		let txKind = this.txCache[kind as string];
		if (txKind) {
			const txRecord = txKind[id];
			if (txRecord) {
				return of(txRecord as T);
			}
		} else {
			this.txCache[kind as string] = txKind = {};
		}
		return this.txWrite.getById<T>(kind, id)
			.pipe(
				map(r => {
					txKind[id] = r as IRecord;
					return r;
				}),
			);
	}

	// tslint:disable-next-line:prefer-function-over-method no-any
	select<T extends IRecord>(kind: EntityKind<CustomSchema>, field: string, value: any): Observable<SelectResult<T>> {
		throw new Error('Method `RxCachedReadwriteTransaction.select()` is not supported or not implemented yet');
	}
}

export class RxCachedStore<CustomSchema extends Schema | unknown> implements IRxStore<CustomSchema> {

	private readonly rxCache: RxCache<CustomSchema>;

	get changed(): Observable<IRecordChange> {
		return this.store.changed;
	}

	constructor(
		private readonly store: IRxStore<CustomSchema>,
	) {
		this.rxCache = {};
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	public close(): void {
	}

	public get connectionID(): number | undefined {
		return this.store.connectionID;
	}

	public readonlyTransaction<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadonlyTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		return this.store.readonlyTransaction(storeNames, worker);
	}

	public readwriteTransaction<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadwriteTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		return this.store.readwriteTransaction<T>(
			storeNames,
			tx => worker(new RxCachedReadwriteTransaction<CustomSchema>(tx, this.rxCache),
			),
		);
	}

	watchById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: RxRecordKey): Observable<T | undefined> {
		if (!kind) {
			throw new Error('parameter `kind` is required');
		}
		if (!id) {
			throw new Error('parameter `id` is required');
		}
		console.log(`RxCachedStore.watchById(${kind as string}, ${id})`);
		let cachedKind = this.rxCache[kind as string];
		if (!cachedKind) {
			this.rxCache[kind as string] = cachedKind = {};
		}
		let subject = cachedKind[id] as unknown as ReplaySubject<T>;
		if (!subject || subject.hasError) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			cachedKind[id] = subject = new ReplaySubject<T>(1);
			this.readonlyTransaction([kind], tx => tx.getById<T>(kind, id))
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				.subscribe(subject);
		}
		return subject.asObservable()
			.pipe(
				tap(v => {
					console.log(`RxCachedStore.watchById(${kind as string}, ${id})`, v);
				}),
			);
	}
}

interface TxCache {
	[kind: string]: { [id: string]: IRecord };
}


export class RxCachedStoreProvider<CustomSchema extends Schema | unknown> implements IRxStoreProvider<CustomSchema> {
	public readonly rxStore: Observable<IRxStore<CustomSchema>>;

	constructor(
		public readonly provider: IRxStoreProvider<CustomSchema>,
	) {
		// console.log(`RxCachedStoreProvider.constructor() => provider:`, provider);
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.rxStore = provider.rxStore.pipe(
			first(),
			map(rxStore2 =>
				new RxCachedStore<CustomSchema>(rxStore2)),
			shareReplay(1),
		);
	}
}

