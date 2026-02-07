import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SpaceNavService } from './space-nav.service';
import { ErrorLogger } from '@sneat/logging';
import { AnalyticsService } from '@sneat/core';
import { NavController } from '@ionic/angular';

describe('SpaceNavService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				SpaceNavService,
				provideRouter([]),
				{ provide: ErrorLogger, useValue: { logError: vi.fn() } },
				{ provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
				{
					provide: NavController,
					useValue: {
						navigateRoot: vi.fn().mockResolvedValue(true),
						navigateForward: vi.fn().mockResolvedValue(true),
						navigateBack: vi.fn().mockResolvedValue(true),
					},
				},
			],
		}),
	);

	it('should be created', () => {
		const service: SpaceNavService = TestBed.inject(SpaceNavService);
		expect(service).toBeTruthy();
	});
});
