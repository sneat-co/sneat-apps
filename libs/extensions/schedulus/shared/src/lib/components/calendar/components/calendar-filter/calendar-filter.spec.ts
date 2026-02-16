import { describe, it, expect } from 'vitest';
import { isMatchingScheduleFilter } from './calendar-filter';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { ICalendarFilter } from './calendar-filter';

describe('calendar-filter utilities', () => {
  describe('isMatchingScheduleFilter', () => {
    const createMockHappening = (
      overrides?: Partial<IHappeningContext>,
    ): IHappeningContext =>
      ({
        id: 'happening1',
        space: { id: 'space1' },
        dbo: {
          title: 'Test Event',
        },
        ...overrides,
      }) as IHappeningContext;

    const createMockFilter = (
      overrides?: Partial<ICalendarFilter>,
    ): ICalendarFilter => ({
      text: '',
      contactIDs: [],
      weekdays: [],
      repeats: [],
      showRecurrings: true,
      showSingles: true,
      ...overrides,
    });

    it('should return true when filter is undefined', () => {
      const happening = createMockHappening();
      const result = isMatchingScheduleFilter(happening, undefined);
      expect(result).toBe(true);
    });

    it('should return true when no filters are set', () => {
      const happening = createMockHappening();
      const filter = createMockFilter();
      const result = isMatchingScheduleFilter(happening, filter);
      expect(result).toBe(true);
    });

    it('should filter by text case-insensitively', () => {
      const happening = createMockHappening({ dbo: { title: 'Team Meeting' } });
      const filter = createMockFilter({ text: 'team' });
      const result = isMatchingScheduleFilter(happening, filter);
      expect(result).toBe(true);
    });

    it('should return false when text does not match', () => {
      const happening = createMockHappening({ dbo: { title: 'Team Meeting' } });
      const filter = createMockFilter({ text: 'birthday' });
      const result = isMatchingScheduleFilter(happening, filter);
      expect(result).toBe(false);
    });

    it('should return false when title is undefined and text filter is set', () => {
      const happening = createMockHappening({ dbo: {} });
      const filter = createMockFilter({ text: 'test' });
      const result = isMatchingScheduleFilter(happening, filter);
      expect(result).toBe(false);
    });

    it('should handle empty text filter', () => {
      const happening = createMockHappening();
      const filter = createMockFilter({ text: '' });
      const result = isMatchingScheduleFilter(happening, filter);
      expect(result).toBe(true);
    });

    it('should return true when contactIDs filter includes empty string and no related contacts', () => {
      const happening = createMockHappening({ dbo: { title: 'Test' } });
      const filter = createMockFilter({ contactIDs: [''] });
      const result = isMatchingScheduleFilter(happening, filter);
      expect(result).toBe(true);
    });

    it('should return false when only brief is present and text filter is set', () => {
      // The function checks h.dbo?.title specifically, so brief won't work for text matching
      const happening = createMockHappening({
        dbo: undefined,
        brief: { title: 'Test Event' },
      } as Partial<IHappeningContext>);
      const filter = createMockFilter({ text: 'test' });
      const result = isMatchingScheduleFilter(happening, filter);
      expect(result).toBe(false);
    });

    it('should handle text filter with partial match', () => {
      const happening = createMockHappening({
        dbo: { title: 'Weekly Standup Meeting' },
      });
      const filter = createMockFilter({ text: 'standup' });
      expect(isMatchingScheduleFilter(happening, filter)).toBe(true);
    });

    it('should handle empty contactIDs array', () => {
      const happening = createMockHappening();
      const filter = createMockFilter({ contactIDs: [] });
      const result = isMatchingScheduleFilter(happening, filter);
      expect(result).toBe(true);
    });
  });
});
