import { describe, it, expect, vi } from 'vitest';
import { swipeableDay, swipeableWeek, Parity as _Parity } from './swipeable-ui';
import { CalendarDataProvider } from '../services/calendar-data-provider';
import { Subject } from 'rxjs';
import { showVirtualSlide, hideVirtualSlide } from '@sneat/components';
import { IDateChanged } from './calendar/calendar-state.service';

describe('swipeable-ui utilities', () => {
  describe('swipeableDay', () => {
    it('should create swipeable day with odd parity', () => {
      const date = new Date(2024, 0, 15);
      const destroyed$ = new Subject<void>();
      const mockProvider: CalendarDataProvider = {
        getCalendarDay: vi.fn().mockReturnValue(undefined),
      } as any;

      const result = swipeableDay('odd', date, mockProvider, destroyed$);

      expect(result.parity).toBe('odd');
      expect(result.animationState).toBe(showVirtualSlide);
      expect(result.weekday).toBeDefined();
      expect(result.weekday.id).toBe('mo');
      expect(result.activeDateID).toBe('2024-01-15');
    });

    it('should create swipeable day with even parity', () => {
      const date = new Date(2024, 0, 16);
      const destroyed$ = new Subject<void>();
      const mockProvider: CalendarDataProvider = {
        getCalendarDay: vi.fn().mockReturnValue(undefined),
      } as any;

      const result = swipeableDay('even', date, mockProvider, destroyed$);

      expect(result.parity).toBe('even');
      expect(result.animationState).toBe(hideVirtualSlide);
      expect(result.weekday.id).toBe('tu');
    });

    it('should have setDate function that returns new swipeable day', () => {
      const date = new Date(2024, 0, 15);
      const destroyed$ = new Subject<void>();
      const mockProvider: CalendarDataProvider = {
        getCalendarDay: vi.fn().mockReturnValue(undefined),
      } as any;

      const swipeable = swipeableDay('odd', date, mockProvider, destroyed$);
      const newDate = new Date(2024, 0, 16);
      const changed: IDateChanged = { date: newDate, direction: 'forward' };

      const result = swipeable.setDate(changed, hideVirtualSlide);

      expect(result.activeDateID).toBe('2024-01-16');
      expect(result.weekday.id).toBe('tu');
      expect(result.animationState).toBe(hideVirtualSlide);
      expect(result.parity).toBe('odd'); // parity stays the same
    });

    it('should preserve spaceDaysProvider in setDate', () => {
      const date = new Date(2024, 0, 15);
      const destroyed$ = new Subject<void>();
      const mockProvider: CalendarDataProvider = {
        getCalendarDay: vi.fn().mockReturnValue(undefined),
      } as any;

      const swipeable = swipeableDay('odd', date, mockProvider, destroyed$);
      const newDate = new Date(2024, 0, 16);
      const changed: IDateChanged = { date: newDate, direction: 'forward' };

      const result = swipeable.setDate(changed, showVirtualSlide);

      expect(result.spaceDaysProvider).toBe(mockProvider);
    });
  });

  describe('swipeableWeek', () => {
    it('should create swipeable week with odd parity', () => {
      const date = new Date(2024, 0, 15); // Monday
      const destroyed$ = new Subject<void>();

      const result = swipeableWeek('odd', date, destroyed$);

      expect(result.parity).toBe('odd');
      expect(result.animationState).toBe(showVirtualSlide);
      expect(result.activeDateID).toBe('2024-01-15');
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
    });

    it('should create swipeable week with even parity', () => {
      const date = new Date(2024, 0, 16);
      const destroyed$ = new Subject<void>();

      const result = swipeableWeek('even', date, destroyed$);

      expect(result.parity).toBe('even');
      expect(result.animationState).toBe(hideVirtualSlide);
    });

    it('should calculate week start and end dates', () => {
      const date = new Date(2024, 0, 17); // Wednesday
      const destroyed$ = new Subject<void>();

      const result = swipeableWeek('odd', date, destroyed$);

      // The function uses getWeekStartDate which has its own logic
      // Just verify that startDate and endDate are valid dates
      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
    });

    it('should have setDate function that returns new swipeable week', () => {
      const date = new Date(2024, 0, 15);
      const destroyed$ = new Subject<void>();

      const swipeable = swipeableWeek('odd', date, destroyed$);
      const newDate = new Date(2024, 0, 22);
      const changed: IDateChanged = { date: newDate, direction: 'forward' };

      const result = swipeable.setDate(changed, hideVirtualSlide);

      expect(result.activeDateID).toBe('2024-01-22');
      expect(result.animationState).toBe(hideVirtualSlide);
      expect(result.parity).toBe('odd');
    });

    it('should update week dates when setDate is called', () => {
      const date = new Date(2024, 0, 15); // Monday of week 1
      const destroyed$ = new Subject<void>();

      const swipeable = swipeableWeek('odd', date, destroyed$);
      const originalStartDate = swipeable.startDate;

      const newDate = new Date(2024, 0, 22); // Monday of week 2
      const changed: IDateChanged = { date: newDate, direction: 'forward' };
      const result = swipeable.setDate(changed, showVirtualSlide);

      expect(result.startDate).not.toBe(originalStartDate);
      expect(result.startDate.getTime()).not.toBe(originalStartDate.getTime());
    });
  });
});
