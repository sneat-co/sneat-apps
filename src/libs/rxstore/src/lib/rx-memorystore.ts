import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {delay, filter} from 'rxjs/operators';
import {EntityKind, IRecord, SpecificOrUnknownSchema} from './schema';
import {
	IRecordChange,
	IRxStore,
	RxReadonlyTransactionWorker,
	RxReadwriteTransactionWorker,
} from './interfaces';

const delay1 = 300;
const delay3 = 300;
const delay6 = 600;

// noinspection JSUnusedGlobalSymbols
export class RxMemoryStore<CustomSchema extends SpecificOrUnknownSchema> implements IRxStore<CustomSchema> {

	private readonly newID: () => string;

	readonly changed: Observable<IRecordChange>;

	constructor(
		private readonly newIdAttemptsLimit: number = 10,
		newID?: () => string,
	) {
		this.newID = newID || (() => Math.random()
			.toString()
			.split('.')[1]);
	}

	private readonly recordsByKind: { [kind: string]: { [id: string]: BehaviorSubject<IRecord | undefined> } } = {};
	private readonly recordsByFilter: { [filter: string]: BehaviorSubject<IRecord[]> } = {};

	private static filterId(kind: string, field: string, value: string): string {
		return `${kind}.${field}:${value}`;
	}

	// tslint:disable-next-line:prefer-function-over-method
	public close(): void {
	}


	// tslint:disable-next-line:prefer-function-over-method
	public upgradeDb(/*version: number*/): void {
	}

	public watchById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T | undefined> {
		let records = this.recordsByKind[kind as string];
		if (!records) {
			records = {};
			this.recordsByKind[kind as string] = records;
		}
		let subj = records[id];
		if (!subj) {
			subj = new BehaviorSubject<IRecord | undefined>(undefined);
			records[id] = subj;
		}
		return subj.asObservable()
			.pipe(
				// tslint:disable-next-line:ban-ts-ignore
				// @ts-ignore
				delay(delay3),
			);
	}

	public getById<T extends IRecord>(kind: string, id: string): Observable<T> {
		const errRecordNotFoundById = `Record ${kind} not found by ID ${id}`;
		const records = this.recordsByKind[kind];
		if (!records) {
			return throwError(errRecordNotFoundById);
		}
		const subj = records[id];
		if (!subj) {
			return throwError(errRecordNotFoundById);
		}
		const record = subj.value;
		return of(record) as Observable<T>;
	}

	public delete(kind: string, id: string): Observable<string> {
		const records = this.recordsByKind[kind];
		if (records) {
			// tslint:disable-next-line:no-dynamic-delete
			delete records[id];
		}
		return of(id)
			.pipe(delay(delay3));
	}

	public update(kind: string, record: IRecord): Observable<IRecord> {
		if (!record.id) {
			throw new Error('empty ID');
		}
		return this.create(kind, record);
	}

	public create(kind: string, record: IRecord): Observable<IRecord> {
		// console.log('MemoryStore.create()', kind, record);
		let records = this.recordsByKind[kind];
		if (!records) {
			records = {};
			this.recordsByKind[kind] = records;
		}
		let subj: BehaviorSubject<IRecord | undefined> | undefined;
		if (record.id) {
			subj = new BehaviorSubject<IRecord | undefined>(record);
			records[record.id] = subj;
		} else {
			for (let i = 0; i < this.newIdAttemptsLimit; i += 1) {
				const id = this.newID();
				if (!records[id]) {
					record.id = id;
					subj = new BehaviorSubject<IRecord | undefined>(record);
					records[id] = subj;
					break;
				}
			}
			if (!subj) {
				throw Error('Not able to generate unique ID');
			}
		}
		setTimeout(
			() => {
				this.updateFilterSubjects(kind, record);
			},
			delay1,
		);
		return of(record);
	}

	private updateFilterSubjects(kind: string, record: IRecord): void {
		Object.keys(record)
			.forEach(
				field => {
					const value = record[field];
					if (value) {
						const filterId = RxMemoryStore.filterId(kind, field, value as string);
						const subj = this.recordsByFilter[filterId];
						if (subj) {
							let values = subj.getValue();
							if (values) {
								// tslint:disable-next-line:no-non-null-assertion
								values = values.find(v => v.id! === record.id!)
									// tslint:disable-next-line:no-non-null-assertion
									? values.map(v => v.id! === record.id! ? record : v)
									: [...values, record];
								subj.next(values);
							}
						}
					}
				},
			);
	}

	// tslint:disable-next-line:no-any
	public select<T extends IRecord>(kind: string, field: string, value: any): Observable<T[]> {
		const filterId = RxMemoryStore.filterId(kind, field, value as string);
		let subj = this.recordsByFilter[filterId] as unknown as BehaviorSubject<T[]>;
		if (!subj) {
			const values = this.findValues(kind, field, value);
			subj = new BehaviorSubject<T[]>([]);
			this.recordsByFilter[filterId] = subj as unknown as BehaviorSubject<IRecord[]>;
			subj.next(values as T[]);
		}
		return subj.asObservable()
			.pipe(
				filter(v => !!v),
				delay(delay6),
			);
	}

	// tslint:disable-next-line:no-any
	private findValues(kind: string, field: string, value: any): IRecord[] {
		console.log(this.recordsByKind);
		const values = Object.values(this.recordsByKind[kind] || {})
			.map(subj => subj.value);
		return values
			.filter(record => {
				if (!record) {
					return false;
				}
				const fieldVal = record[field];
				return fieldVal && (
					fieldVal === value || (fieldVal instanceof Array && fieldVal.some(v => v === value))
				);
			}) as IRecord[];
	}

	// noinspection JSMethodCanBeStatic JSUnusedGlobalSymbols
	// tslint:disable-next-line:prefer-function-over-method
	transBegin(): Observable<undefined> {
		// console.log('MemoryStore.transBegin()');
		return of(undefined);
	}

	// noinspection JSMethodCanBeStatic JSUnusedGlobalSymbols
	// tslint:disable-next-line:prefer-function-over-method
	transEnd(): Observable<undefined> {
		// console.log('MemoryStore.transEnd()');
		return of(undefined);
	}

	// tslint:disable-next-line:prefer-function-over-method
	public readonlyTransaction<T>(storeNames: readonly EntityKind<CustomSchema>[], worker: RxReadonlyTransactionWorker<T, CustomSchema>)
		: Observable<T> {
		throw new Error('not implemented');
	}

	// tslint:disable-next-line:prefer-function-over-method
	public readwriteTransaction<T>(storeNames: readonly EntityKind<CustomSchema>[], worker: RxReadwriteTransactionWorker<T, CustomSchema>)
		: Observable<T> {
		throw new Error('not implemented');
	}
}

