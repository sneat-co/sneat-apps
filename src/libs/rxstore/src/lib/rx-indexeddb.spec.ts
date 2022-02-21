import {IdbUpgradeCallback, IndexedDbRxStore, IndexedDbRxStoreProvider} from './rx-indexeddb';
import {deleteDB, IDBPDatabase, IDBPTransaction, openDB} from 'idb';
import {loggerFactory} from './logging';
import {IValidator} from './interfaces';
import {IRecord} from 'rxstore/schema';

describe('RxIndexedDb', () => {
	const testDbName = 'test-db';

	const createProvider = () => new IndexedDbRxStoreProvider(testDbName, 1, idbUpgradeCallback, validators, loggerFactory);

	const idbUpgradeCallback: IdbUpgradeCallback<unknown> = (
		db: IDBPDatabase, oldVersion: number, newVersion: number,
		tx: IDBPTransaction,
	) => {
		console.log('idbUpgradeCallback', 'oldVersion', oldVersion, 'newVersion', newVersion);
		db.createObjectStore('ObjStore1', {keyPath: 'id'});
		db.createObjectStore('ObjStore2', {keyPath: 'id'});
	};

	const validators: { [id: string]: IValidator } = {
		ObjStore1: {
			validate: (record: IRecord): void => {
				if (!record) {
					throw new Error('!record');
				}
			}
		},
		ObjStore2: {
			validate: (record: IRecord): void => {
				if (!record) {
					throw new Error('!record');
				}
			}
		},
	};

	describe('IndexedDbRxStoreProvider', () => {
		it('should be created', () => {
			const rxStoreProvider = createProvider();
			expect(rxStoreProvider)
				.toBeTruthy();
		});
	});

	describe('IndexedDbRxStore', () => {

		afterAll(async (done) => {
			await deleteDB(testDbName);
			done();
		});

		it('should be created', () => {
			const rxStoreProvider = createProvider();
			expect(rxStoreProvider)
				.toBeTruthy();
			rxStoreProvider.rxStore.subscribe(rxStore => {
				expect(rxStore)
					.toBeTruthy();
				rxStore.close();
			});
		});

		it('should add 1 record to ObjStore1', (done) => {
			const rxStoreProvider = new IndexedDbRxStoreProvider(testDbName, 1, idbUpgradeCallback, validators, loggerFactory);
			rxStoreProvider.rxStore.subscribe(rxStore => {
				rxStore
					.readwriteTransaction(
						['ObjStore1'],
						tx => tx.add('ObjStore1', {id: 'rec1'}),
					)
					.subscribe(record => {
						expect(record)
							.toBeTruthy();
						rxStore.close();
						openDB(testDbName, 1)
							.then(testDb => {
								testDb
									.transaction(['ObjStore1'], 'readonly')
									.objectStore('ObjStore1')
									.get('rec1')
									.then(rec => {
										expect(rec)
											.toBeTruthy();
										setTimeout(
											() => {
												testDb.close();
												done();
											},
											// tslint:disable-next-line:no-magic-numbers
											10,
										);
									})
									.catch(err => {
										done.fail(err);
									})
								;
							})
							.catch(err => {
								done.fail(err);
							});
					});
			});
		});
	});
});

