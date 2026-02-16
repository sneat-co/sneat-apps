import { describe, it, expect } from 'vitest';
import {
  emptyRecurringsByWeekday,
  groupRecurringSlotsByWeekday,
} from './calendar-types';
import { ICalendariumSpaceContext } from '@sneat/mod-schedulus-core';

describe('calendar-types utilities', () => {
  describe('emptyRecurringsByWeekday', () => {
    it('should create object with all weekday codes', () => {
      const result = emptyRecurringsByWeekday();
      expect(Object.keys(result)).toHaveLength(7);
      expect(result).toHaveProperty('mo');
      expect(result).toHaveProperty('tu');
      expect(result).toHaveProperty('we');
      expect(result).toHaveProperty('th');
      expect(result).toHaveProperty('fr');
      expect(result).toHaveProperty('sa');
      expect(result).toHaveProperty('su');
    });

    it('should initialize each weekday with empty array', () => {
      const result = emptyRecurringsByWeekday();
      Object.values(result).forEach((arr) => {
        expect(Array.isArray(arr)).toBe(true);
        expect(arr).toHaveLength(0);
      });
    });

    it('should create independent arrays for each weekday', () => {
      const result = emptyRecurringsByWeekday();
      result.mo.push({} as ISlotUIContext);
      expect(result.mo).toHaveLength(1);
      expect(result.tu).toHaveLength(0);
    });
  });

  describe('groupRecurringSlotsByWeekday', () => {
    it('should return empty slots when calendariumSpace is undefined', () => {
      const result = groupRecurringSlotsByWeekday(undefined);
      expect(result).toEqual({ byWeekday: {} });
    });

    it('should return empty slots when no recurring happenings', () => {
      const space = {
        id: 'space1',
        space: { id: 'space1' },
        dbo: {},
      } as ICalendariumSpaceContext;
      const result = groupRecurringSlotsByWeekday(space);
      expect(result).toEqual({ byWeekday: {} });
    });

    it('should group slots by weekday', () => {
      const space = {
        id: 'space1',
        space: { id: 'space1' },
        dbo: {
          recurringHappenings: {
            happening1: {
              title: 'Weekly Meeting',
              slots: {
                slot1: {
                  repeats: 'weekly',
                  weekdays: ['mo', 'we'],
                  start: { time: '10:00' },
                  end: { time: '11:00' },
                },
              },
            },
          },
        },
      } as ICalendariumSpaceContext;

      const result = groupRecurringSlotsByWeekday(space);
      expect(result.byWeekday.mo).toBeDefined();
      expect(result.byWeekday.we).toBeDefined();
      expect(result.byWeekday.mo?.length).toBe(1);
      expect(result.byWeekday.we?.length).toBe(1);
    });

    it('should handle multiple happenings', () => {
      const space = {
        id: 'space1',
        space: { id: 'space1' },
        dbo: {
          recurringHappenings: {
            happening1: {
              title: 'Meeting 1',
              slots: {
                slot1: {
                  repeats: 'weekly',
                  weekdays: ['mo'],
                  start: { time: '10:00' },
                  end: { time: '11:00' },
                },
              },
            },
            happening2: {
              title: 'Meeting 2',
              slots: {
                slot1: {
                  repeats: 'weekly',
                  weekdays: ['mo'],
                  start: { time: '14:00' },
                  end: { time: '15:00' },
                },
              },
            },
          },
        },
      } as ICalendariumSpaceContext;

      const result = groupRecurringSlotsByWeekday(space);
      expect(result.byWeekday.mo?.length).toBe(2);
    });

    it('should handle slots without weekdays', () => {
      const space = {
        id: 'space1',
        space: { id: 'space1' },
        dbo: {
          recurringHappenings: {
            happening1: {
              title: 'One-time Event',
              slots: {
                slot1: {
                  repeats: 'once',
                  start: { time: '10:00' },
                  end: { time: '11:00' },
                },
              },
            },
          },
        },
      } as ICalendariumSpaceContext;

      const result = groupRecurringSlotsByWeekday(space);
      // Slots without weekdays should still be included but not assigned to any weekday
      expect(Object.keys(result.byWeekday).length).toBe(0);
    });

    it('should handle multiple slots per happening', () => {
      const space = {
        id: 'space1',
        space: { id: 'space1' },
        dbo: {
          recurringHappenings: {
            happening1: {
              title: 'Multi-slot Event',
              slots: {
                slot1: {
                  repeats: 'weekly',
                  weekdays: ['mo'],
                  start: { time: '10:00' },
                  end: { time: '11:00' },
                },
                slot2: {
                  repeats: 'weekly',
                  weekdays: ['tu'],
                  start: { time: '14:00' },
                  end: { time: '15:00' },
                },
              },
            },
          },
        },
      } as ICalendariumSpaceContext;

      const result = groupRecurringSlotsByWeekday(space);
      expect(result.byWeekday.mo?.length).toBe(1);
      expect(result.byWeekday.tu?.length).toBe(1);
    });

    it('should include slot and happening data in result', () => {
      const space = {
        id: 'space1',
        space: { id: 'space1' },
        dbo: {
          recurringHappenings: {
            happening1: {
              title: 'Test Event',
              slots: {
                slot1: {
                  repeats: 'weekly',
                  weekdays: ['mo'],
                  start: { time: '10:00' },
                  end: { time: '11:00' },
                },
              },
            },
          },
        },
      } as ICalendariumSpaceContext;

      const result = groupRecurringSlotsByWeekday(space);
      const mondaySlot = result.byWeekday.mo?.[0];

      expect(mondaySlot).toBeDefined();
      expect(mondaySlot?.title).toBe('Test Event');
      expect(mondaySlot?.slot.id).toBe('slot1');
      expect(mondaySlot?.happening.id).toBe('happening1');
      expect(mondaySlot?.wd).toBe('mo');
    });
  });
});
