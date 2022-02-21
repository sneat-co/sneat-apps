import {IRecordChange, IRxStore, RxReadonlyTransactionWorker, RxReadwriteTransactionWorker} from './interfaces';
import {Observable} from 'rxjs';
import {EntityKind, IRecord, Schema} from './schema';

export abstract class RxProxyStore<CustomSchema extends Schema | unknown> implements IRxStore<CustomSchema> {

	protected constructor(
		protected rxStore: IRxStore<CustomSchema>,
	) {
	}

	// tslint:disable-next-line:prefer-function-over-method
	public close(): void {
	}

	get changed(): Observable<IRecordChange> {
		return this.rxStore.changed;
	}

	get connectionID(): number | undefined {
		return this.rxStore.connectionID;
	}

	readonlyTransaction<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadonlyTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		return this.rxStore.readonlyTransaction<T>(storeNames, worker);
	}

	readwriteTransaction<T>(
		storeNames: readonly EntityKind<CustomSchema>[],
		worker: RxReadwriteTransactionWorker<T, CustomSchema>,
	): Observable<T> {
		return this.rxStore.readwriteTransaction<T>(storeNames, worker);
	}

	watchById<T extends IRecord>(kind: EntityKind<CustomSchema>, id: string): Observable<T | undefined> {
		return this.rxStore.watchById<T>(kind, id);
	}
}
