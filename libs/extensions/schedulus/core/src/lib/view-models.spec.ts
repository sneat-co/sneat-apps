import {
  jsDayToWeekday,
  getWd2,
  dateToTimeOnlyStr,
  timeToStr,
  sortSlotItems,
  wd2,
  ISlotUIContext,
  WeekdayNumber,
} from './view-models';

describe('view-models', () => {
  describe('jsDayToWeekday', () => {
    it('should convert Sunday (0) to "su"', () => {
      expect(jsDayToWeekday(0)).toBe('su');
    });

    it('should convert Monday (1) to "mo"', () => {
      expect(jsDayToWeekday(1)).toBe('mo');
    });

    it('should convert Tuesday (2) to "tu"', () => {
      expect(jsDayToWeekday(2)).toBe('tu');
    });

    it('should convert Wednesday (3) to "we"', () => {
      expect(jsDayToWeekday(3)).toBe('we');
    });

    it('should convert Thursday (4) to "th"', () => {
      expect(jsDayToWeekday(4)).toBe('th');
    });

    it('should convert Friday (5) to "fr"', () => {
      expect(jsDayToWeekday(5)).toBe('fr');
    });

    it('should convert Saturday (6) to "sa"', () => {
      expect(jsDayToWeekday(6)).toBe('sa');
    });

    it('should throw error for negative day number', () => {
      expect(() => jsDayToWeekday(-1 as WeekdayNumber)).toThrow('Unknown day number: -1');
    });

    it('should throw error for day number > 6', () => {
      expect(() => jsDayToWeekday(7 as WeekdayNumber)).toThrow('Unknown day number: 7');
    });
  });

  describe('getWd2', () => {
    it('should return "su" for Sunday', () => {
      const sunday = new Date('2024-01-07'); // A Sunday
      expect(getWd2(sunday)).toBe('su');
    });

    it('should return "mo" for Monday', () => {
      const monday = new Date('2024-01-08'); // A Monday
      expect(getWd2(monday)).toBe('mo');
    });

    it('should return "fr" for Friday', () => {
      const friday = new Date('2024-01-12'); // A Friday
      expect(getWd2(friday)).toBe('fr');
    });
  });

  describe('dateToTimeOnlyStr', () => {
    it('should format time with leading zeros for single digits', () => {
      const date = new Date('2024-01-15T09:05:00');
      expect(dateToTimeOnlyStr(date)).toBe('09:05');
    });

    it('should format time without leading zeros for double digits', () => {
      const date = new Date('2024-01-15T14:30:00');
      expect(dateToTimeOnlyStr(date)).toBe('14:30');
    });

    it('should format midnight correctly', () => {
      const date = new Date('2024-01-15T00:00:00');
      expect(dateToTimeOnlyStr(date)).toBe('00:00');
    });

    it('should format noon correctly', () => {
      const date = new Date('2024-01-15T12:00:00');
      expect(dateToTimeOnlyStr(date)).toBe('12:00');
    });

    it('should handle single digit hour and minute', () => {
      const date = new Date('2024-01-15T01:02:00');
      expect(dateToTimeOnlyStr(date)).toBe('01:02');
    });

    it('should handle late evening time', () => {
      const date = new Date('2024-01-15T23:59:00');
      expect(dateToTimeOnlyStr(date)).toBe('23:59');
    });
  });

  describe('timeToStr', () => {
    it('should convert timestamp to time string', () => {
      const timestamp = new Date('2024-01-15T14:30:00').getTime();
      const result = timeToStr(timestamp);
      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should format midnight timestamp', () => {
      const timestamp = new Date('2024-01-15T00:00:00').getTime();
      const result = timeToStr(timestamp);
      expect(result).toBe('00:00');
    });
  });

  describe('sortSlotItems', () => {
    const createMockSlot = (time: string, title: string): ISlotUIContext => ({
      slot: { id: 'test', repeats: 'once' },
      happening: {} as any,
      title,
      timing: { start: { time } },
      repeats: 'once',
    });

    it('should sort by time when times are different', () => {
      const slotA = createMockSlot('10:00', 'Meeting A');
      const slotB = createMockSlot('09:00', 'Meeting B');
      
      expect(sortSlotItems(slotA, slotB)).toBeGreaterThan(0);
      expect(sortSlotItems(slotB, slotA)).toBeLessThan(0);
    });

    it('should sort by title when times are the same', () => {
      const slotA = createMockSlot('10:00', 'Beta Meeting');
      const slotB = createMockSlot('10:00', 'Alpha Meeting');
      
      expect(sortSlotItems(slotA, slotB)).toBeGreaterThan(0);
      expect(sortSlotItems(slotB, slotA)).toBeLessThan(0);
    });

    it('should return 0 for identical time and title', () => {
      const slotA = createMockSlot('10:00', 'Meeting');
      const slotB = createMockSlot('10:00', 'Meeting');
      
      expect(sortSlotItems(slotA, slotB)).toBe(0);
    });

    it('should handle slots without start time', () => {
      const slotA: ISlotUIContext = {
        slot: { id: 'test', repeats: 'once' },
        happening: {} as any,
        title: 'Meeting A',
        timing: { start: {} },
        repeats: 'once',
      };
      const slotB = createMockSlot('09:00', 'Meeting B');
      
      expect(sortSlotItems(slotA, slotB)).toBeLessThanOrEqual(0);
    });

    it('should properly sort array of slots', () => {
      const slots = [
        createMockSlot('14:00', 'Afternoon'),
        createMockSlot('09:00', 'Morning'),
        createMockSlot('14:00', 'Another Afternoon'),
      ];
      
      const sorted = slots.sort(sortSlotItems);
      
      expect(sorted[0].timing.start?.time).toBe('09:00');
      expect(sorted[1].timing.start?.time).toBe('14:00');
      expect(sorted[1].title).toBe('Afternoon');
      expect(sorted[2].timing.start?.time).toBe('14:00');
      expect(sorted[2].title).toBe('Another Afternoon');
    });
  });

  describe('wd2 constant', () => {
    it('should contain all weekday codes in correct order', () => {
      expect(wd2).toEqual(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su']);
    });

    it('should have 7 elements', () => {
      expect(wd2).toHaveLength(7);
    });
  });
});
