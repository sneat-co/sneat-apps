// tslint:disable-next-line:no-import-side-effect
import 'firebase/firestore';
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
import { from, Observable, ReplaySubject } from 'rxjs';
import * as firebase from 'firebase/app';
import { map } from 'rxjs/operators';
import { EntityKind, IRecord, RxRecordKey, SpecificOrUnknownSchema } from './schema';

// interface IFirestorePath {
//     property: string;
//     collection: string;
// }
//
// export interface IFirestoreSchema {
//     kinds: { [kind: string]: IFirestorePath[] }
// }

export class RxFirestoreProvider<CustomSchema extends SpecificOrUnknownSchema> extends IRxStoreProvider<CustomSchema> {
	constructor() {
		super();
	}

	get rxStore(): Observable<RxFirestore<CustomSchema>> {
		throw new Error('no implemented');
	}
}

export class RxFirestore<CustomSchema extends SpecificOrUnknownSchema> implements IRxStore<CustomSchema> {
	readonly connectionID: number;

	changed: Observable<IRecordChange>;

	// Firestore does not have read-only transactions so we use a common method
	// tslint:disable-next-line:prefer-function-over-method
	private createTransaction<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadonlyTransactionWorker<T, CustomSchema> | RxReadwriteTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		const subject = new ReplaySubject<RxFirestoreTransaction<CustomSchema>>(1);
		const firestore = firebase.firestore();
		throw new Error('not implemented');
		// let fsTransaction: RxFirestoreTransaction<CustomSchema>;
		// firestore.runTransaction(transaction => {
		// 	fsTransaction = new RxFirestoreTransaction<CustomSchema>(transaction);
		// 	subject.next(fsTransaction);
		// 	return new Promise<void>((resolve, reject) => {
		// 	});
		// })
		// 	.then(() => fsTransaction.onComplete())
		// 	.catch(err => {
		// 		fsTransaction.onError(err);
		// 		subject.error(err);
		// 	}); // TODO(ask-community): There is probably a better way?
		// return worker(fsTransaction);
	}

	public readonlyTransaction<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadonlyTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		return this.createTransaction<T>(storeNames, worker);
	}

	public readwriteTransaction<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadwriteTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		return this.createTransaction<T>(storeNames, worker);
	}

	// tslint:disable-next-line:prefer-function-over-method
	public watchById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T | undefined> {
		throw new Error('not implemented');
	}
}

class RxFirestoreTransaction<CustomSchema extends SpecificOrUnknownSchema>
	implements IRxReadonlyTransaction<CustomSchema>, IRxReadwriteTransaction<CustomSchema> {

	readonly isReadonly = false;

	onComplete: () => void;
	// tslint:disable-next-line:no-any
	onError: (err: any) => void;

	constructor(
		private readonly transaction: firebase.firestore.Transaction,
	) {
		this.complete = new Promise((resolve, reject) => {
			this.onComplete = resolve;
			this.onError = reject;
		});
	}

	readonly complete: Promise<void>;

	// tslint:disable-next-line:prefer-function-over-method
	mustGetById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: RxRecordKey): Observable<T> {
		throw new Error('not implemented');
	}

	getById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T | undefined> {
		const docRef = firebase.firestore()
			.collection(kind as string)
			.doc(id);
		return from(this.transaction.get(docRef))
			.pipe(
				map(d => {
					if (!d.exists) {
						return undefined as unknown as T;
					}
					const record = d.data() as T;
					if (!record.id) {
						record.id = id;
					}
					return record;
				}),
			);
	}

	// tslint:disable-next-line:prefer-function-over-method no-any
	select<T extends IRecord>(kind: EntityKind<CustomSchema>, field: string, value: any): Observable<SelectResult<T>> {
		throw new Error('not implemented');
	}

	// tslint:disable-next-line:prefer-function-over-method
	add<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): Observable<T> {
		throw new Error('not implemented');
	}

	// tslint:disable-next-line:prefer-function-over-method
	put<T extends IRecord>(kind: EntityKind<CustomSchema>, record: T): Observable<T> {
		throw new Error('not implemented');
	}

	// tslint:disable-next-line:prefer-function-over-method
	delete(kind: EntityKind<CustomSchema>, id: string): Observable<string> {
		throw new Error('not implemented');
	}
}
