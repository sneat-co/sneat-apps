import { describe, it, expect } from 'vitest';
import {
  isToday,
  isTomorrow,
  areSameDates,
  getWdDate,
  createWeekdays,
  animationState,
} from './calendar-core';
import { WeekdayCode2 } from '@sneat/mod-schedulus-core';
import { Parity } from './swipeable-ui';
import {
  VirtualSliderAnimationStates,
  VirtualSliderDirectPushedNext,
  VirtualSliderDirectPushedPrev,
  VirtualSliderReversePushedNext,
  VirtualSliderReversePushedPrev,
} from '@sneat/components';

describe('calendar-core utilities', () => {
  describe('areSameDates', () => {
    it('should return true for same dates', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 15);
      expect(areSameDates(date1, date2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 16);
      expect(areSameDates(date1, date2)).toBe(false);
    });

    it('should return false for different months', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 1, 15);
      expect(areSameDates(date1, date2)).toBe(false);
    });

    it('should return false for different years', () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2023, 0, 15);
      expect(areSameDates(date1, date2)).toBe(false);
    });

    it('should ignore time component', () => {
      const date1 = new Date(2024, 0, 15, 10, 30, 0);
      const date2 = new Date(2024, 0, 15, 14, 45, 0);
      expect(areSameDates(date1, date2)).toBe(true);
    });
  });

  describe('isToday', () => {
    it('should return true for current date', () => {
      const now = new Date();
      expect(isToday(now)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isTomorrow', () => {
    it('should return true for tomorrow date', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isTomorrow(tomorrow)).toBe(true);
    });

    it('should return false for today', () => {
      const today = new Date();
      expect(isTomorrow(today)).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isTomorrow(undefined)).toBe(false);
    });

    it('should return false for day after tomorrow', () => {
      const dayAfterTomorrow = new Date();
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
      expect(isTomorrow(dayAfterTomorrow)).toBe(false);
    });
  });

  describe('getWdDate', () => {
    it('should return same date when weekdays match', () => {
      const date = new Date(2024, 0, 15); // Monday
      const result = getWdDate(
        'mo' as WeekdayCode2,
        'mo' as WeekdayCode2,
        date,
      );
      expect(result).toEqual(date);
    });

    it('should calculate next day correctly', () => {
      const monday = new Date(2024, 0, 15); // Monday
      const tuesday = getWdDate(
        'tu' as WeekdayCode2,
        'mo' as WeekdayCode2,
        monday,
      );
      expect(tuesday.getDate()).toBe(16);
    });

    it('should calculate previous day correctly', () => {
      const tuesday = new Date(2024, 0, 16); // Tuesday
      const monday = getWdDate(
        'mo' as WeekdayCode2,
        'tu' as WeekdayCode2,
        tuesday,
      );
      expect(monday.getDate()).toBe(15);
    });

    it('should handle week transition correctly', () => {
      const monday = new Date(2024, 0, 15); // Monday
      const sunday = getWdDate(
        'su' as WeekdayCode2,
        'mo' as WeekdayCode2,
        monday,
      );
      expect(sunday.getDate()).toBe(21);
    });
  });

  describe('createWeekdays', () => {
    it('should create array of 7 weekdays', () => {
      const weekdays = createWeekdays();
      expect(weekdays).toHaveLength(7);
    });

    it('should have correct weekday codes', () => {
      const weekdays = createWeekdays();
      const expectedCodes: WeekdayCode2[] = [
        'mo',
        'tu',
        'we',
        'th',
        'fr',
        'sa',
        'su',
      ];
      weekdays.forEach((wd, index) => {
        expect(wd.id).toBe(expectedCodes[index]);
      });
    });

    it('should have longTitle for each weekday', () => {
      const weekdays = createWeekdays();
      weekdays.forEach((wd) => {
        expect(wd.longTitle).toBeTruthy();
        expect(typeof wd.longTitle).toBe('string');
      });
    });

    it('should have undefined day for each weekday', () => {
      const weekdays = createWeekdays();
      weekdays.forEach((wd) => {
        expect(wd.day).toBeUndefined();
      });
    });
  });

  describe('animationState', () => {
    it('should return correct state for odd parity forward', () => {
      const result = animationState('odd' as Parity, 'forward');
      expect(result).toBe(VirtualSliderReversePushedNext);
    });

    it('should return correct state for odd parity back', () => {
      const result = animationState('odd' as Parity, 'back');
      expect(result).toBe(VirtualSliderDirectPushedPrev);
    });

    it('should return correct state for even parity forward', () => {
      const result = animationState('even' as Parity, 'forward');
      expect(result).toBe(VirtualSliderDirectPushedNext);
    });

    it('should return correct state for even parity back', () => {
      const result = animationState('even' as Parity, 'back');
      expect(result).toBe(VirtualSliderReversePushedPrev);
    });

    it('should throw error for invalid direction', () => {
      expect(() => animationState('odd' as Parity, 'invalid' as any)).toThrow();
    });

    it('should throw error for invalid parity', () => {
      expect(() => animationState('invalid' as any, 'forward')).toThrow();
    });
  });
});
