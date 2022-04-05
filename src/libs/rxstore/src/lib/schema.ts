export type RxRecordKey = string; // IDBValidKey;

export declare type KnownKeys<T> = { // Copied from IDB package
	[K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends {
	[_ in keyof T]: infer U;
} ? U : never;

export declare type EntityKind<CustomSchema extends SpecificOrUnknownSchema>
	= CustomSchema extends Schema ? KnownKeys<CustomSchema> : string;

// declare type IndexNames<CustomSchema extends SpecificOrUnknownSchema, StoreName extends EntityKind<Schema>>
//   = CustomSchema extends Schema ? keyof CustomSchema[StoreName]['indexes'] : string;
// declare type IndexKey<CustomSchema extends SpecificOrUnknownSchema,
// 		StoreName extends EntityKind<Schema>,
// 		IndexName extends IndexNames<CustomSchema, StoreName>
// 		> = CustomSchema extends Schema
// 		? IndexName extends keyof CustomSchema[StoreName]['indexes']
// 		? CustomSchema[StoreName]['indexes'][IndexName]
// 		: IDBValidKey
// 		: IDBValidKey;

interface IndexKeys {
	[s: string]: IDBValidKey;
}

export interface Schema {
	[kind: string]: Entity;
}

export type SpecificOrUnknownSchema = Schema | unknown;

interface ITestStore<CustomSchema extends Schema | unknown> {
	getById<T>(id: EntityKind<CustomSchema>): T | undefined;
}

class TestStore<CustomSchema extends Schema | unknown> implements ITestStore<CustomSchema> {
	// tslint:disable-next-line:prefer-function-over-method
	getById<T>(id: EntityKind<CustomSchema>): T | undefined {
		return undefined;
	}
}

export interface Entity {
	key: RxRecordKey;
	value: IRecord;
	indexes?: IndexKeys;
}

interface IVersioned {
	v?: { // Use object as we don't get version properties to get indexed by Firebase for example
		l?: number; // Local version
		r?: number; // Remote version
	};
}

export interface IRecord extends IVersioned {
	id?: string; //RxRecordKey; // ID can be empty for new not saved yet records
	ts?: string; // Timestamp ISO format - can be empty for new not saved yet records
	// tslint:disable-next-line:no-any
	[field: string]: any;
}
