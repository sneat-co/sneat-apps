import { describe, it, expect, vi } from 'vitest';
import { createWeekday } from './weekday-functions';
import { CalendarDataProvider } from '../services/calendar-data-provider';
import { CalendarDay } from '../services/calendar-day';

describe('weekday-functions', () => {
  describe('createWeekday', () => {
    it('should create weekday with correct properties', () => {
      const date = new Date(2024, 0, 15); // Monday, January 15, 2024
      const mockDay = {} as CalendarDay;
      const mockProvider = {
        getCalendarDay: vi.fn().mockReturnValue(mockDay),
      } as unknown as CalendarDataProvider;

      const result = createWeekday(date, mockProvider);

      expect(result).toBeDefined();
      expect(result.id).toBe('mo');
      expect(result.day).toBe(mockDay);
      expect(result.longTitle).toBeTruthy();
      expect(typeof result.longTitle).toBe('string');
    });

    it('should call getCalendarDay with correct date', () => {
      const date = new Date(2024, 0, 16); // Tuesday
      const mockProvider: CalendarDataProvider = {
        getCalendarDay: vi.fn().mockReturnValue({} as CalendarDay),
      } as any;

      createWeekday(date, mockProvider);

      expect(mockProvider.getCalendarDay).toHaveBeenCalledWith(date);
    });

    it('should handle different weekdays correctly', () => {
      const testCases = [
        { date: new Date(2024, 0, 15), expectedId: 'mo' }, // Monday
        { date: new Date(2024, 0, 16), expectedId: 'tu' }, // Tuesday
        { date: new Date(2024, 0, 17), expectedId: 'we' }, // Wednesday
        { date: new Date(2024, 0, 18), expectedId: 'th' }, // Thursday
        { date: new Date(2024, 0, 19), expectedId: 'fr' }, // Friday
        { date: new Date(2024, 0, 20), expectedId: 'sa' }, // Saturday
        { date: new Date(2024, 0, 21), expectedId: 'su' }, // Sunday
      ];

      const mockProvider = {
        getCalendarDay: vi.fn().mockReturnValue({} as CalendarDay),
      } as unknown as CalendarDataProvider;

      testCases.forEach(({ date, expectedId }) => {
        const result = createWeekday(date, mockProvider);
        expect(result.id).toBe(expectedId);
      });
    });

    it('should handle undefined day from provider', () => {
      const date = new Date(2024, 0, 15);
      const mockProvider = {
        getCalendarDay: vi.fn().mockReturnValue(undefined),
      } as unknown as CalendarDataProvider;

      const result = createWeekday(date, mockProvider);

      expect(result).toBeDefined();
      expect(result.day).toBeUndefined();
      expect(result.id).toBe('mo');
    });
  });
});
