import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { CalendarNavService } from './calendar-nav.service';

describe('CalendarNavService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CalendarNavService,
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: SpaceNavService,
					useValue: {
						navigateForwardToSpacePage: vi.fn(() => Promise.resolve(true)),
					},
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(CalendarNavService)).toBeTruthy();
	});
});
