import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { SneatUserService } from '@sneat/auth-core';
import { of, Subject } from 'rxjs';
import { ContactusSpaceContextService } from './contactus-space-context.service';
import { ContactusSpaceService } from './contactus-space.service';
import { Firestore } from '@angular/fire/firestore';

vi.mock('@angular/fire/firestore', async (importOriginal) => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		collection: vi.fn().mockReturnValue({}),
	};
});

describe('ContactusSpaceContextService', () => {
	let destroyed$: Subject<void>;

	beforeEach(() => {
		destroyed$ = new Subject<void>();
		TestBed.configureTestingModule({
			providers: [
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: () => vi.fn(),
					},
				},
				{
					provide: SneatUserService,
					useValue: {
						userState: of({}),
						userChanged: of(undefined),
						currentUserID: undefined,
					},
				},
				{
					provide: ContactusSpaceService,
					useValue: {
						watchSpaceModuleRecord: vi.fn(() => of({})),
						watchContactBriefs: vi.fn(() => of([])),
					},
				},
				{
					provide: Firestore,
					useValue: { type: 'Firestore', toJSON: () => ({}) },
				},
			],
		});
	});

	afterEach(() => {
		destroyed$.next();
		destroyed$.complete();
	});

	it('should be created', () => {
		const service = TestBed.runInInjectionContext(
			() =>
				new ContactusSpaceContextService(
					destroyed$.asObservable(),
					of(undefined),
				),
		);
		expect(service).toBeTruthy();
	});
});
