import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SpaceNavService } from './space-nav.service';
import { ErrorLogger } from '@sneat/logging';
import { AnalyticsService } from '@sneat/core';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';

describe('SpaceNavService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [
				SpaceNavService,
				provideRouter([]),
				{ provide: ErrorLogger, useValue: { logError: jest.fn() } },
				{ provide: AnalyticsService, useValue: { logEvent: jest.fn() } },
				{
					provide: NavController,
					useValue: {
						navigateRoot: jest.fn().mockResolvedValue(true),
						navigateForward: jest.fn().mockResolvedValue(true),
						navigateBack: jest.fn().mockResolvedValue(true),
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
