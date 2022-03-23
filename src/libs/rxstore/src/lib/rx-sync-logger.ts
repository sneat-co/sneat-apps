import {
	IRecordKey,
	IRxReadwriteTransaction,
	IRxStore,
	IRxStoreProvider,
	RecordAction,
	RxMutation,
	RxReadwriteTransactionWorker,
	RxTransaction,
	SelectResult,
} from './interfaces';
import { RxProxyStore } from './rx-proxystore';
import { concat, Observable, throwError } from 'rxjs';
import { first, map, mapTo, mergeMap, shareReplay, tap } from 'rxjs/operators';
// import {beforeComplete} from './beforeComplete';
import { EntityKind, IRecord, Schema } from './schema';

export const SyncBacklogKind = '$yncBacklog';

export type SyncStatus = 'on' | 'off' | 'queued';

export interface SyncSchema extends Schema {
	[SyncBacklogKind]: {
		key: string;
		value: IRecord;
	};
}

export interface DtoRecordChange extends IRecord {
	action?: RecordAction;
	kind: string;
	recordId: string;
	tg?: number;
	tu?: number;
	tc: number;
	old?: IRecord;
	new?: IRecord;
	sync: SyncStatus;
}

export type LogPolicy<CustomSchema extends SyncSchema | unknown> = (kind: EntityKind<CustomSchema>, record?: IRecord)
	=> { loggingEnabled: boolean; record?: IRecord };

class RxSyncLoggerReadwriteTx<CustomSchema extends SyncSchema | unknown>
	extends RxTransaction<CustomSchema>
	implements IRxReadwriteTransaction<CustomSchema> {
	readonly isReadonly: boolean = false;

	public readonly complete: Promise<void>;

	private readonly recordsLog: IRecordsLog = {};

	constructor(
		private readonly tx: IRxReadwriteTransaction<CustomSchema>,
		private readonly logPolicy: LogPolicy<CustomSchema>,
	) {
		super();
		this.complete = tx.complete;
	}

	add<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): Observable<T> {
		const result = this.tx.add<T>(kind, record);
		if (!this.logPolicy(kind, record).loggingEnabled) {
			return result;
		}
		return result.pipe(tap(record2 => {
			const entry = this.getEntry<T>(kind, record2);
			entry.op = RxMutation.add;
		}));
	}

	delete(kind: EntityKind<CustomSchema>, id: string): Observable<string> {
		return this.tx.getById(kind, id)
			.pipe(
				mergeMap(record => {
					const result = this.tx.delete(kind, id);
					if (!this.logPolicy(kind, record).loggingEnabled) {
						return result;
					}
					return result.pipe(tap(id2 => {
						const key: IRecordKey = { kind: kind as string, id: id2 };
						const k = keyToString(key);
						let entry = this.recordsLog[k];
						if (!entry) {
							this.recordsLog[k] = entry = { key };
						}
						entry.new = { ts: Date.now() };
						entry.op = RxMutation.delete;
					}));
				}),
			);
	}

	getById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T | undefined> {
		const result = this.tx.getById<T>(kind, id);
		if (!this.logPolicy(kind).loggingEnabled) {
			return result;
		}
		return result.pipe(tap(record => {
			const key: IRecordKey = { kind: kind as string, id };
			const k = keyToString(key);
			if (!this.recordsLog[k]) {
				record = { ...(record as T) };
				delete record.id;
				this.recordsLog[k] = { key, old: { ts: Date.now(), record } };
			}
		}));
	}

	private getEntry<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): IEntry {
		if (!record.id) {
			throw new Error('!record.id');
		}
		const key: IRecordKey = { kind: kind as string, id: record.id };
		const k = keyToString(key);
		let entry = this.recordsLog[k];
		if (!entry) {
			this.recordsLog[k] = entry = { key };
		}
		record = { ...record };
		delete record.id;
		entry.new = { ts: Date.now(), record };
		return entry;
	}

	put<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): Observable<T> {
		const result = this.tx.put<T>(kind, record);
		if (!this.logPolicy(kind, record).loggingEnabled) {
			return result;
		}
		return result.pipe(tap(record2 => {
			const entry = this.getEntry(kind, record2);
			entry.op = entry.old ? RxMutation.update : RxMutation.put;
		}));
	}

	// tslint:disable-next-line:no-any
	select<T extends IRecord>(kind: EntityKind<CustomSchema>, field: string, value: any): Observable<SelectResult<T>> {
		return this.tx.select<T>(kind, field, value);
	}

	flushChangesLog(): void {
		const tc = Date.now();
		console.log('RecordChangeLoggerReadwriteTx.flushChangesLog():', Object.values(this.recordsLog).length);
		Object.values(this.recordsLog)
			.filter(entry => entry.op)
			.forEach(entry => {
				const id = keyToString(entry.key);
				const r: DtoRecordChange = {
					id, tc,
					kind: entry.key.kind,
					recordId: entry.key.id,
					action: entry.op,
					sync: 'queued',
				};
				if (entry.old) {
					if (entry.old.ts) {
						r.tg = entry.old.ts;
					}
					if (entry.old.record) {
						r.old = entry.old.record;
					}
				}
				if (entry.new) {
					if (entry.new.ts) {
						r.tu = entry.new.ts;
					}
					if (entry.new.record) {
						r.new = entry.new.record;
					}
				}
				// tslint:disable-next-line:ban-ts-ignore
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				this.tx.getById<DtoRecordChange>(SyncBacklogKind, id)
					.pipe(
						mergeMap((record?: DtoRecordChange) => {
							if (record) {
								r.old = record.old;
								r.tg = record.tg;
								if (record.action === RxMutation.add) {
									if (r.action === RxMutation.delete) {
										// eslint-disable-next-line @typescript-eslint/ban-ts-comment
										// @ts-ignore
										return this.tx.delete(entry.key.kind, entry.key.id)
											.pipe(mapTo(r));
									}
									r.action = RxMutation.add;
								}
							}
							// eslint-disable-next-line @typescript-eslint/ban-ts-comment
							// @ts-ignore
							return this.tx.put(SyncBacklogKind, r);
						}),
					)
					.subscribe({
						// tslint:disable-next-line:no-any
						error: (err: any) => {
							console.error('Failed to flushChangesLog():', err);
						},
					});
			});
	}
}

interface IEntry {
	key: IRecordKey;
	old?: {
		record: IRecord;
		ts: number;
	};
	op?: RecordAction;
	new?: {
		record?: IRecord;
		ts: number;
	};
}

interface IRecordsLog {
	[key: string]: IEntry;
}

function keyToString(key: IRecordKey): string {
	return `${key.kind}:${key.id}`;
}

export class RxSyncLoggerStore<CustomSchema extends SyncSchema | unknown> extends RxProxyStore<CustomSchema> {
	constructor(
		rxStore: IRxStore<CustomSchema>,
		private readonly logPolicy: LogPolicy<CustomSchema>,
	) {
		super(rxStore);
	}

	override readwriteTransaction<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadwriteTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		if (!storeNames || !storeNames.length) {
			return throwError(new Error('storeNames is empty'));
		}
		if (!worker) {
			return throwError(new Error('worker is a required parameter'));
		}
		if ((storeNames as unknown as string[]).indexOf(SyncBacklogKind) < 0) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			storeNames = [...storeNames, SyncBacklogKind];
		}
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return this.rxStore.readwriteTransaction(storeNames, tx => {
			const logTx = new RxSyncLoggerReadwriteTx(tx, this.logPolicy);
			return concat(
				// TODO: I guess it's can be done better. Especially `of(1)`
				worker(logTx)
					.pipe(
						tap(something => {
							console.log('RxSyncLoggerStore: worker =>', something);
						}),
						// beforeComplete(() => {
						// 	logTx.flushChangesLog();
						// }),
					),
				// of(1).pipe(
				//     tap(() => console.log('RxSyncLoggerStore => tx stream completed')),
				//     mergeMap(() => logTx.flushChangesLog()),
				//     ignoreElements(),
				// ),
			);
		});
	}
}


export class RxSyncLoggerStoreProvider<CustomSchema extends SyncSchema | unknown> implements IRxStoreProvider<CustomSchema> {
	public readonly rxStore: Observable<IRxStore<CustomSchema>>;

	constructor(
		public readonly provider: IRxStoreProvider<CustomSchema>,
		private readonly logPolicy: LogPolicy<CustomSchema>,
	) {
		// console.log(`RxRecordChangeLoggerStore.constructor() => provider:`, provider);
		this.logPolicy = (kind: EntityKind<CustomSchema>, record?: IRecord) => {
			if (kind as unknown as string === SyncBacklogKind) {
				return { record, loggingEnabled: false };
			}
			return logPolicy(kind, record);
		};
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		this.rxStore = provider.rxStore
			.pipe(
				first(),
				map(rxStore => new RxSyncLoggerStore(rxStore, this.logPolicy)),
				shareReplay(1),
			);
	}
}
