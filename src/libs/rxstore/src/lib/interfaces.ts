import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {EntityKind, IRecord, Schema, SpecificOrUnknownSchema, RxRecordKey} from './schema';

export interface IRecordKey {
	kind: string;
	id: RxRecordKey;
}

export abstract class IRxStoreProvider<CustomSchema extends SpecificOrUnknownSchema> {
	abstract get rxStore(): Observable<IRxStore<CustomSchema>>;
}

export const enum RxMutation {
	add = 'add',
	delete = 'delete',
	put = 'put',
	update = 'update',
}

type EnumKeys<TEnum> = keyof TEnum;

export type RecordAction = EnumKeys<typeof RxMutation>; // e.g. added, updated, deleted

export interface IRecordChange extends IRecord {
	readonly n: number; // This is used to sort changes
	readonly action: RecordAction;
	readonly kind: string;
	readonly record: IRecord;
}


export type RxReadonlyTransactionWorker<T, CustomSchema extends SpecificOrUnknownSchema> =
	(tx: IRxReadonlyTransaction<CustomSchema>) => Observable<T>;
export type RxReadwriteTransactionWorker<T, CustomSchema extends SpecificOrUnknownSchema> =
	(tx: IRxReadwriteTransaction<CustomSchema>) => Observable<T>;

export type RxReadonlyTxMethod<CustomSchema extends SpecificOrUnknownSchema> =
	<T>(storeNames: readonly EntityKind<CustomSchema>[], worker: RxReadonlyTransactionWorker<T, CustomSchema>) => Observable<T>;
export type RxReadwriteTxMethod<CustomSchema extends SpecificOrUnknownSchema> =
	<T>(storeNames: readonly EntityKind<CustomSchema>[], worker: RxReadwriteTransactionWorker<T, CustomSchema>) => Observable<T>;

export interface IRxStore<CustomSchema extends SpecificOrUnknownSchema> {
	readonly changed: Observable<IRecordChange>;
	readonly connectionID?: number;
	readonly readonlyTransaction: RxReadonlyTxMethod<CustomSchema>;
	readonly readwriteTransaction: RxReadwriteTxMethod<CustomSchema>;

	close(): void;

	watchById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: RxRecordKey): Observable<T | undefined>;
}

export interface IRxTransaction<CustomSchema extends SpecificOrUnknownSchema> {
	readonly isReadonly: boolean;

	getById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: RxRecordKey): Observable<T | undefined>;

	mustGetById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: RxRecordKey): Observable<T>;
}

export abstract class RxTransaction<CustomSchema extends SpecificOrUnknownSchema> implements IRxTransaction<CustomSchema> {
	abstract readonly isReadonly: boolean;

	abstract getById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: RxRecordKey): Observable<T | undefined>;

	mustGetById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T> {
		return this.getById<T>(kind, id)
			.pipe(
				map(dto => { // TODO: find some rxjs operator
					if (!dto) {
						throw new Error(`${kind as string} not found by id=${id}`);
					}
					return dto;
				}),
			);
	}
}

export interface SelectResult<T> { // TODO: document why we need key
	key?: string;
	values: T[];
}

// export type Condition = '==' | '>' | '>=' | '<' | '<=';

export interface IRxReadonlyTransaction<CustomSchema extends SpecificOrUnknownSchema> extends IRxTransaction<CustomSchema> {
	select<T extends IRecord>(
		kind: EntityKind<CustomSchema>,
		field: string | string[],
		// tslint:disable-next-line:no-any
		value: any | any[] | IDBKeyRange,
	): Observable<SelectResult<T>>;
}

export interface IRxReadwriteTransaction<CustomSchema extends SpecificOrUnknownSchema> extends IRxReadonlyTransaction<CustomSchema> {
	readonly complete: Promise<void>;

	add<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): Observable<T>;

	put<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): Observable<T>;

	delete(kind: EntityKind<CustomSchema>, id: RxRecordKey): Observable<RxRecordKey>;
}

export interface IValidator {
	validate(record: IRecord): void;
}

export interface IRxHookGetRequest {
	onRxGetRequest(key: IRecordKey): void;
}

export interface IRxHookGetResponse {
	onRxGetRequest(key: IRecordKey, record: IRecord): void;
}

export interface IRxHookPutRequest {
	onRxPutRequest(key: IRecordKey, record: IRecord): void;
}

export interface IRxHookPutResponse {
	onRxPutRequest(key: IRecordKey, record: IRecord): void;
}

export interface IRxHookBeforeReadwriteTxComplete<CustomSchema extends Schema | unknown> {
	onRxBeforeTxComplete(tx: IRxReadwriteTransaction<CustomSchema>): void;
}

export interface IReadwriteTransactionHooker<CustomSchema extends Schema | unknown> {
	onReadwriteTransaction(tx: IRxReadwriteTransaction<CustomSchema>): IRxReadwriteTransaction<CustomSchema>;
}
