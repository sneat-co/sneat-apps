import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { AnalyticsService, ErrorLogger } from '@sneat/core';
import { SneatAuthStateService } from './sneat-auth-state-service';

describe('SneatAuthStateService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SneatAuthStateService,
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: AnalyticsService,
					useValue: {
						identify: vi.fn(),
						logEvent: vi.fn(),
					},
				},
				{
					provide: Auth,
					useValue: {
						onIdTokenChanged: vi.fn(),
						onAuthStateChanged: vi.fn(),
					},
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(SneatAuthStateService)).toBeTruthy();
	});
});
