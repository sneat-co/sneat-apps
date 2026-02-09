import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { RandomIdService } from '@sneat/random';
import { of } from 'rxjs';
import { InviteService } from './invite.service';

describe('InviteService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				InviteService,
				{
					provide: ErrorLogger,
					useValue: {
						logError: vi.fn(),
						logErrorHandler: () => vi.fn(),
					},
				},
				{
					provide: SneatAuthStateService,
					useValue: {
						authState: of({ status: 'notAuthenticated' }),
						authStatus: of('notAuthenticated'),
					},
				},
				{
					provide: SneatApiService,
					useValue: {
						post: vi.fn(),
						get: vi.fn(),
						delete: vi.fn(),
						postAsAnonymous: vi.fn(),
						setApiAuthToken: vi.fn(),
					},
				},
				{
					provide: Auth,
					useValue: {},
				},
				{
					provide: RandomIdService,
					useValue: { newRandomId: vi.fn(() => 'test-id') },
				},
			],
		}),
	);

	it('should be created', () => {
		expect(TestBed.inject(InviteService)).toBeTruthy();
	});
});
