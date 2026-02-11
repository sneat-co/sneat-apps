import { signal, Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IErrorLogger } from '@sneat/core';
import { CalendarDay, ICalendarDayInput } from './calendar-day';
import { HappeningService } from './happening.service';
import { CalendarDayService } from './calendar-day.service';
import { of } from 'rxjs';

describe('CalendarDay', () => {
  it('should create', () => {
    const date = new Date(2024, 5, 15);
    const injector = TestBed.inject(Injector);
    const $inputs = signal<readonly ICalendarDayInput[]>([]);
    const mockErrorLogger = {
      logError: vi.fn(),
      logErrorHandler: () => vi.fn(),
    } as unknown as IErrorLogger;
    const mockHappeningService = {
      watchSinglesOnSpecificDay: vi.fn(() => of([])),
    } as unknown as HappeningService;
    const mockCalendarDayService = {
      watchSpaceDay: vi.fn(() => of({ id: 'test', dbo: null })),
    } as unknown as CalendarDayService;

    const day = new CalendarDay(
      date,
      injector,
      $inputs,
      mockErrorLogger,
      mockHappeningService,
      mockCalendarDayService,
    );
    expect(day).toBeTruthy();
    expect(day.dateID).toBeTruthy();
    day.destroy();
  });
});
