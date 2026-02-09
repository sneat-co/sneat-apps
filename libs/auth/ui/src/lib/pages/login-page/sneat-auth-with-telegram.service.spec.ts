import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { SneatAuthWithTelegramService } from './sneat-auth-with-telegram.service';

describe('SneatAuthWithTelegramService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SneatAuthWithTelegramService,
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: SneatApiService,
					useValue: { post: vi.fn(), postAsAnonymous: vi.fn() },
				},
				{
					provide: SneatAuthStateService,
					useValue: { signInWithToken: vi.fn() },
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(SneatAuthWithTelegramService)).toBeTruthy();
	});
});
