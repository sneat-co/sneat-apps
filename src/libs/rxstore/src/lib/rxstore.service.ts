import { Observable, of, throwError } from 'rxjs';
import { filter, first, mapTo, mergeMap, share, shareReplay } from 'rxjs/operators';
import { EntityKind, IRecord, RxRecordKey, Schema } from './schema';
import {
	IRecordChange,
	IRxReadonlyTransaction,
	IRxReadwriteTransaction,
	IRxStore,
	IRxStoreProvider,
	RxReadonlyTransactionWorker,
	RxReadwriteTransactionWorker,
	SelectResult,
} from './interfaces';

export abstract class RxStoreService<CustomSchema extends Schema> {
	protected constructor(
		protected readonly rxStoreProvider: IRxStoreProvider<CustomSchema>,
	) {
	}

	public get rxStore(): Observable<IRxStore<CustomSchema>> {
		return this.rxStoreProvider.rxStore;
	}

	public readonlyTx<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadonlyTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		if (!storeNames || !storeNames.length) {
			throwError('An attempt to start readonly transaction without specifying affected storeNames');
		}
		// console.log('readonlyTx<T>', storeNames, 'rxStoreProvider: ', this.rxStoreProvider);
		return this.rxStoreProvider.rxStore.pipe(
			mergeMap(rxStore => rxStore.readonlyTransaction<T>(storeNames, worker)),
			shareReplay(1), // TODO: Comment why exactly we need it here? If not transaction can be created twice.
		);
	}

	public readwriteTx<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadwriteTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		if (!storeNames || !storeNames.length) {
			throwError('An attempt to start readwrite transaction without specifying affected storeNames');
		}
		return this.rxStoreProvider.rxStore.pipe(
			mergeMap(rxStore => rxStore.readwriteTransaction<T>(storeNames, worker)),
		);
	}

	protected select<T extends IRecord>(
		tx: IRxReadonlyTransaction<CustomSchema> | undefined,
		kind: EntityKind<CustomSchema>,
		field: string | string[], v: string | string[] | IDBKeyRange,
	): Observable<SelectResult<T>> {
		// console.log(`RxStoreService.select(${kind}, ${field}=${v})`);
		return tx
			? tx.select<T>(kind, field, v)
			: this.readonlyTx<SelectResult<T>>([kind], tx2 => tx2.select<T>(kind, field, v));
	}

	protected watchEntityById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T | undefined> {
		if (!kind) {
			throw new Error('kind parameter is required');
		}
		if (!id) {
			throw new Error('id parameter is required');
		}
		return this.rxStoreProvider.rxStore.pipe(
			mergeMap(
				rxStore => rxStore.watchById<T>(kind, id),
			),
		);
	}
}

export type RxRecordUpdater<T> = (dto: T) => { readonly dto: T; readonly changed: boolean };

export abstract class RxStoreTableService<T extends IRecord, CustomSchema extends Schema, Kind extends EntityKind<CustomSchema>>
	extends RxStoreService<CustomSchema> {

	public readonly changed: Observable<IRecordChange>;

	protected constructor(
		public readonly kind: Kind,
		rxStoreProvider: IRxStoreProvider<CustomSchema>,
	) {
		super(rxStoreProvider);
		this.changed = this.rxStoreProvider.rxStore.pipe(
			first(),
			mergeMap(rxStore => rxStore.changed.pipe(
				filter(change => change.kind === kind as string),
			)),
			share(),
		);
	}

	public getById(id: RxRecordKey, tx?: IRxReadonlyTransaction<CustomSchema>): Observable<T | undefined> {
		const worker = (roTx: IRxReadonlyTransaction<CustomSchema>) => roTx.getById<T>(this.kind, id);
		return tx ? worker(tx) : this.readonlyTx([this.kind], worker);
	}

	public mustGetById(id: RxRecordKey, tx?: IRxReadonlyTransaction<CustomSchema>): Observable<T> {
		const worker = (roTx: IRxReadonlyTransaction<CustomSchema>) => roTx.mustGetById<T>(this.kind, id);
		return tx ? worker(tx) : this.readonlyTx([this.kind], worker);
	}

	protected txAddKinds(): EntityKind<CustomSchema>[] {
		return [this.kind];
	}

	public add(record: T, tx?: IRxReadwriteTransaction<CustomSchema>): Observable<T> {
		if (tx) {
			return tx.add(this.kind, record);
		}
		return this.readwriteTx(this.txAddKinds(), tx2 => tx2.add(this.kind, record));
	}

	public put(record: T, tx?: IRxReadwriteTransaction<CustomSchema>): Observable<T> {
		if (tx) {
			return tx.put(this.kind, record);
		}
		return this.readwriteTx([this.kind], tx2 => tx2.put(this.kind, record));
	}

	public watchById(id: string): Observable<T | undefined> {
		return super.watchEntityById<T>(this.kind, id);
	}

	public updateRecord(
		tx: IRxReadwriteTransaction<CustomSchema> | undefined,
		id: RxRecordKey,
		updater: RxRecordUpdater<T>,
	): Observable<T> {
		if (!id) {
			throw new Error(`id is required parameter, got: ${id}`);
		}
		console.log(`RxStoreTableService.updateRecord(id=${id})`);
		const worker: RxReadwriteTransactionWorker<T, CustomSchema> = (tx2: IRxReadwriteTransaction<CustomSchema>): Observable<T> =>
			this.getById(id, tx2)
				.pipe(
					mergeMap(dto => {
						if (!dto) {
							return throwError(
								`RxStoreTableService.updateRecord(): record not provided by ID [${this.kind as string}:${id}]`);
						}
						const updated = updater(dto);
						if (updated.changed) {
							return tx2.put(this.kind, updated.dto);
						}
						return of(updated.dto);
					}),
				);
		if (tx) {
			return worker(tx);
		}
		return this.readwriteTx([this.kind], worker)
			.pipe(
				first(),
			);
	}

	public deleteRecord(tx: IRxReadwriteTransaction<CustomSchema>, id: RxRecordKey): Observable<T | undefined> {
		if (!tx) {
			return throwError('Missing required parameter: tx');
		}
		if (!id) {
			return throwError('Missing required parameter: id');
		}
		return this.getById(id, tx)
			.pipe(
				mergeMap(dto => tx.delete(this.kind, id)
					.pipe(
						mapTo(dto),
					),
				),
			);
	}
}
