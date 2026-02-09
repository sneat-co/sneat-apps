import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';
import { ContactService } from './contact-service';
import { ContactusSpaceService } from './contactus-space.service';

vi.mock('@angular/fire/firestore', async (importOriginal) => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		collection: vi.fn().mockReturnValue({}),
	};
});

describe('ContactService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				ContactService,
				{
					provide: Firestore,
					useValue: { type: 'Firestore', toJSON: () => ({}) },
				},
				{
					provide: SneatApiService,
					useValue: {
						post: vi.fn(),
						get: vi.fn(),
						delete: vi.fn(),
					},
				},
				{
					provide: ContactusSpaceService,
					useValue: {
						watchContactBriefs: vi.fn(() => of([])),
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
			],
		}),
	);

	it('should be created', () => {
		expect(TestBed.inject(ContactService)).toBeTruthy();
	});
});
