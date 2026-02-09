import { signal, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { CalendariumSpaceService } from './calendarium-space.service';
import { CalendarDataProvider } from './calendar-data-provider';
import { HappeningService } from './happening.service';
import { CalendarDayService } from './calendar-day.service';

describe('CalendarDataProvider', () => {
	it('should create', () => {
		const $primarySpaceID = signal<string | undefined>(undefined);
		const mockErrorLogger = {
			logError: vi.fn(),
			logErrorHandler: () => vi.fn(),
		} as unknown as IErrorLogger;
		const mockHappeningService = {} as HappeningService;
		const mockCalendarDayService = {
			watchSpaceDay: vi.fn(() => of(undefined)),
		} as unknown as CalendarDayService;
		const mockCalendariumSpaceService = {
			watchSpaceModuleRecord: vi.fn(() => of({ id: 'test', dbo: null })),
		} as unknown as CalendariumSpaceService;

		const injector = TestBed.inject(Injector);

		const provider = new CalendarDataProvider(
			injector,
			$primarySpaceID,
			mockErrorLogger,
			mockHappeningService,
			mockCalendarDayService,
			mockCalendariumSpaceService,
		);
		expect(provider).toBeTruthy();
		provider.destroy();
	});
});
