import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Injector } from '@angular/core';
import {
	CollectionReference,
	DocumentReference,
	DocumentSnapshot,
	QuerySnapshot,
} from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import {
	SneatFirestoreService,
	docSnapshotToDto,
	IQueryArgs,
} from './sneat-firestore.service';

// Mock Firebase functions
const mockDoc = vi.fn();
const mockGetDoc = vi.fn();
const mockOnSnapshot = vi.fn();
const mockQuery = vi.fn();
const mockWhere = vi.fn();
const mockLimit = vi.fn();

vi.mock('@angular/fire/firestore', () => ({
	doc: (...args: unknown[]) => mockDoc(...args),
	getDoc: (...args: unknown[]) => mockGetDoc(...args),
	onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
	query: (...args: unknown[]) => mockQuery(...args),
	where: (...args: unknown[]) => mockWhere(...args),
	limit: (...args: unknown[]) => mockLimit(...args),
}));

interface TestBrief {
	id: string;
	name: string;
}

interface TestDbo extends TestBrief {
	email: string;
}

describe('SneatFirestoreService', () => {
	let service: SneatFirestoreService<TestBrief, TestDbo>;
	let injector: Injector;
	let dto2brief: (id: string, dto: TestDbo) => TestBrief;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [],
		});
		injector = TestBed.inject(Injector);
		dto2brief = (id: string, dto: TestDbo) => ({ id, name: dto.name });

		// Clear all mocks
		mockDoc.mockClear();
		mockGetDoc.mockClear();
		mockOnSnapshot.mockClear();
		mockQuery.mockClear();
		mockWhere.mockClear();
		mockLimit.mockClear();
	});

	it('should be created', () => {
		service = new SneatFirestoreService(injector, dto2brief);
		expect(service).toBeTruthy();
	});

	it('should use default dto2brief if not provided', () => {
		// The constructor has a default value for dto2brief, so it will never throw
		// when undefined is passed - it will just use the default
		service = new SneatFirestoreService(injector);
		expect(service).toBeTruthy();

		// Test that the default dto2brief works correctly
		const mockSnapshot = {
			id: 'doc1',
			exists: () => true,
			data: () =>
				({ id: 'doc1', name: 'Test', email: 'test@test.com' }) as TestDbo,
		} as unknown as DocumentSnapshot<TestDbo>;

		const result = service.docSnapshotToContext(mockSnapshot);
		expect(result.id).toBe('doc1');
		expect(result.dto).toBeDefined();
		expect((result.brief as TestBrief).id).toBe('doc1');
	});

	describe('watchByID', () => {
		it('should watch document by ID', fakeAsync(() => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockCollection = {
				path: 'test-collection',
			} as CollectionReference<TestDbo>;
			const mockDocRef = {
				id: 'doc1',
				path: 'test-collection/doc1',
			} as DocumentReference<TestDbo>;
			const mockSnapshot = {
				exists: () => true,
				data: () => ({ id: 'doc1', name: 'Test', email: 'test@example.com' }),
			} as unknown as DocumentSnapshot<TestDbo>;

			mockDoc.mockReturnValue(mockDocRef);
			mockOnSnapshot.mockImplementation((docRef, next) => {
				// Simulate snapshot
				setTimeout(() => next(mockSnapshot), 0);
			});

			const result$ = service.watchByID(mockCollection, 'doc1');
			let result: unknown;
			result$.subscribe((data) => {
				result = data;
			});

			tick();

			expect(mockDoc).toHaveBeenCalledWith(mockCollection, 'doc1');
			expect(result).toEqual({
				id: 'doc1',
				dbo: { id: 'doc1', name: 'Test', email: 'test@example.com' },
				brief: { id: 'doc1', name: 'Test' },
			});
		}));
	});

	describe('watchByDocRef', () => {
		it('should watch document by reference', fakeAsync(() => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockDocRef = {
				id: 'doc2',
				path: 'test-collection/doc2',
			} as DocumentReference<TestDbo>;
			const mockSnapshot = {
				exists: () => true,
				data: () => ({ id: 'doc2', name: 'Test2', email: 'test2@example.com' }),
			} as unknown as DocumentSnapshot<TestDbo>;

			mockOnSnapshot.mockImplementation((docRef, next) => {
				setTimeout(() => next(mockSnapshot), 0);
			});

			const result$ = service.watchByDocRef(mockDocRef);
			let result: unknown;
			result$.subscribe((data) => {
				result = data;
			});

			tick();

			expect(mockOnSnapshot).toHaveBeenCalled();
			expect(result).toEqual({
				id: 'doc2',
				dbo: { id: 'doc2', name: 'Test2', email: 'test2@example.com' },
				brief: { id: 'doc2', name: 'Test2' },
			});
		}));

		it('should handle errors', fakeAsync(() => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockDocRef = {
				id: 'doc3',
				path: 'test-collection/doc3',
			} as DocumentReference<TestDbo>;
			const testError = new Error('Firestore error');

			mockOnSnapshot.mockImplementation((docRef, next, error) => {
				setTimeout(() => error(testError), 0);
			});

			const result$ = service.watchByDocRef(mockDocRef);
			let caughtError: unknown;
			result$.subscribe({
				error: (err) => {
					caughtError = err;
				},
			});

			tick();

			expect(caughtError).toBe(testError);
		}));

		it('should handle complete', fakeAsync(() => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockDocRef = {
				id: 'doc5',
				path: 'test-collection/doc5',
			} as DocumentReference<TestDbo>;

			mockOnSnapshot.mockImplementation((docRef, next, error, complete) => {
				setTimeout(() => complete(), 0);
			});

			const result$ = service.watchByDocRef(mockDocRef);
			let completed = false;
			result$.subscribe({
				complete: () => {
					completed = true;
				},
			});

			tick();

			expect(completed).toBe(true);
		}));
	});

	describe('getByDocRef', () => {
		it('should get document by reference', fakeAsync(() => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockDocRef = {
				id: 'doc4',
				path: 'test-collection/doc4',
			} as DocumentReference<TestDbo>;
			const mockSnapshot = {
				exists: () => true,
				data: () => ({ id: 'doc4', name: 'Test4', email: 'test4@example.com' }),
			} as unknown as DocumentSnapshot<TestDbo>;

			mockGetDoc.mockResolvedValue(mockSnapshot);

			const result$ = service.getByDocRef(mockDocRef);
			let result: unknown;
			result$.subscribe((data) => {
				result = data;
			});

			tick();

			expect(mockGetDoc).toHaveBeenCalledWith(mockDocRef);
			expect(result).toEqual({
				id: 'doc4',
				dbo: { id: 'doc4', name: 'Test4', email: 'test4@example.com' },
				brief: { id: 'doc4', name: 'Test4' },
			});
		}));
	});

	describe('watchSnapshotsByFilter', () => {
		it('should watch documents by filter', () => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockCollection = {
				path: 'test-collection',
			} as CollectionReference<TestDbo>;
			const queryArgs: IQueryArgs = {
				filter: [{ field: 'name', operator: '==', value: 'Test' }],
			};
			const mockQueryObj = {};

			mockWhere.mockReturnValue({});
			mockQuery.mockReturnValue(mockQueryObj);
			mockOnSnapshot.mockImplementation(() => {
				// Just return to simulate subscription
			});

			const result$ = service.watchSnapshotsByFilter(mockCollection, queryArgs);

			expect(mockQuery).toHaveBeenCalled();
			expect(mockWhere).toHaveBeenCalledWith('name', '==', 'Test');
			expect(result$).toBeTruthy();
		});

		it('should use array-contains for fields ending with IDs', () => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockCollection = {
				path: 'test-collection',
			} as CollectionReference<TestDbo>;
			const queryArgs: IQueryArgs = {
				filter: [{ field: 'userIDs', operator: '==', value: 'user1' }],
			};

			mockWhere.mockReturnValue({});
			mockQuery.mockReturnValue({});
			mockOnSnapshot.mockImplementation(() => {
				// Just return
			});

			service.watchSnapshotsByFilter(mockCollection, queryArgs);

			expect(mockWhere).toHaveBeenCalledWith(
				'userIDs',
				'array-contains',
				'user1',
			);
		});

		it('should apply limit when specified', () => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockCollection = {
				path: 'test-collection',
			} as CollectionReference<TestDbo>;
			const queryArgs: IQueryArgs = {
				limit: 10,
			};

			mockLimit.mockReturnValue({});
			mockQuery.mockReturnValue({});
			mockOnSnapshot.mockImplementation(() => {
				// Just return
			});

			service.watchSnapshotsByFilter(mockCollection, queryArgs);

			expect(mockLimit).toHaveBeenCalledWith(10);
		});
	});

	describe('watchByFilter', () => {
		it('should watch and transform documents by filter', fakeAsync(() => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockCollection = {
				path: 'test-collection',
			} as CollectionReference<TestDbo>;
			const mockSnapshot1 = {
				id: 'doc1',
				exists: () => true,
				data: () => ({ id: 'doc1', name: 'Test1', email: 'test1@example.com' }),
			} as unknown as DocumentSnapshot<TestDbo>;
			const mockQuerySnapshot = {
				docs: [mockSnapshot1],
			} as QuerySnapshot<TestDbo>;

			mockQuery.mockReturnValue({});
			mockOnSnapshot.mockImplementation(
				(q, subj: Subject<QuerySnapshot<TestDbo>>) => {
					setTimeout(() => subj.next(mockQuerySnapshot), 0);
				},
			);

			const result$ = service.watchByFilter(mockCollection);
			let result: unknown;
			result$.subscribe((data) => {
				result = data;
			});

			tick();

			expect(result).toEqual([
				{
					id: 'doc1',
					dto: { id: 'doc1', name: 'Test1', email: 'test1@example.com' },
					brief: { id: 'doc1', name: 'Test1' },
				},
			]);
		}));
	});

	describe('docSnapshotsToContext', () => {
		it('should transform array of snapshots to contexts', () => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockSnapshot1 = {
				id: 'doc1',
				exists: () => true,
				data: () => ({ id: 'doc1', name: 'Test1', email: 'test1@example.com' }),
			} as unknown as DocumentSnapshot<TestDbo>;
			const mockSnapshot2 = {
				id: 'doc2',
				exists: () => true,
				data: () => ({ id: 'doc2', name: 'Test2', email: 'test2@example.com' }),
			} as unknown as DocumentSnapshot<TestDbo>;

			const result = service.docSnapshotsToContext([
				mockSnapshot1,
				mockSnapshot2,
			]);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({
				id: 'doc1',
				dto: { id: 'doc1', name: 'Test1', email: 'test1@example.com' },
				brief: { id: 'doc1', name: 'Test1' },
			});
		});
	});

	describe('docSnapshotToContext', () => {
		it('should transform snapshot to context', () => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockSnapshot = {
				id: 'doc1',
				exists: () => true,
				data: () => ({ id: 'doc1', name: 'Test1', email: 'test1@example.com' }),
			} as unknown as DocumentSnapshot<TestDbo>;

			const result = service.docSnapshotToContext(mockSnapshot);

			expect(result).toEqual({
				id: 'doc1',
				dto: { id: 'doc1', name: 'Test1', email: 'test1@example.com' },
				brief: { id: 'doc1', name: 'Test1' },
			});
		});

		it('should handle snapshot with no data', () => {
			service = new SneatFirestoreService(injector, dto2brief);
			const mockSnapshot = {
				id: 'doc1',
				exists: () => true,
				data: () => undefined,
			} as unknown as DocumentSnapshot<TestDbo>;

			const result = service.docSnapshotToContext(mockSnapshot);

			expect(result).toEqual({
				id: 'doc1',
				dto: undefined,
				brief: undefined,
			});
		});
	});

	describe('docSnapshotToDto', () => {
		it('should convert existing snapshot to dto', () => {
			const mockSnapshot = {
				exists: true,
				data: () => ({ id: 'doc1', name: 'Test1', email: 'test1@example.com' }),
			} as unknown as DocumentSnapshot<TestDbo>;

			const result = docSnapshotToDto('doc1', dto2brief, mockSnapshot);

			expect(result).toEqual({
				id: 'doc1',
				dbo: { id: 'doc1', name: 'Test1', email: 'test1@example.com' },
				brief: { id: 'doc1', name: 'Test1' },
			});
		});

		it('should handle non-existing snapshot', () => {
			const mockSnapshot = {
				exists: false,
			} as unknown as DocumentSnapshot<TestDbo>;

			const result = docSnapshotToDto('doc1', dto2brief, mockSnapshot);

			expect(result).toEqual({
				id: 'doc1',
				brief: null,
				dbo: null,
			});
		});

		it('should handle snapshot with undefined data', () => {
			const mockSnapshot = {
				exists: true,
				data: () => undefined,
			} as unknown as DocumentSnapshot<TestDbo>;

			const result = docSnapshotToDto('doc1', dto2brief, mockSnapshot);

			expect(result).toEqual({
				id: 'doc1',
				dbo: undefined,
				brief: undefined,
			});
		});
	});
});
