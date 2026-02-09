import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { SneatAuthStateService } from './sneat-auth-state-service';
import { TelegramAuthService } from './telegram-auth.service';

describe('TelegramAuthService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				TelegramAuthService,
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: SneatAuthStateService,
					useValue: { signInWithToken: vi.fn() },
				},
				{
					provide: SneatApiService,
					useValue: { postAsAnonymous: vi.fn() },
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(TelegramAuthService)).toBeTruthy();
	});
});
