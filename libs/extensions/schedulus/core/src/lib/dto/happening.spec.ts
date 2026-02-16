import {
  validateHappeningDto,
  validateSingleHappeningSlot,
  validateRecurringHappeningSlot,
  IHappeningDbo,
  IHappeningSlot,
  emptyTiming,
  emptyHappeningSlot,
} from './happening';

describe('happening validation', () => {
  describe('validateHappeningDto', () => {
    it('should throw error when title is missing', () => {
      const dto: IHappeningDbo = {
        title: '',
        type: 'single',
        status: 'active',
        kind: 'activity',
        slots: { 'slot1': { repeats: 'once', start: { time: '10:00' } } },
      };

      expect(() => validateHappeningDto(dto)).toThrow('happening has no title');
    });

    it('should throw error when title has leading whitespace', () => {
      const dto: IHappeningDbo = {
        title: ' Test Event',
        type: 'single',
        status: 'active',
        kind: 'activity',
        slots: { 'slot1': { repeats: 'once', start: { time: '10:00' } } },
      };

      expect(() => validateHappeningDto(dto)).toThrow(
        'happening title has leading or closing whitespace characters'
      );
    });

    it('should throw error when title has trailing whitespace', () => {
      const dto: IHappeningDbo = {
        title: 'Test Event ',
        type: 'single',
        status: 'active',
        kind: 'activity',
        slots: { 'slot1': { repeats: 'once', start: { time: '10:00' } } },
      };

      expect(() => validateHappeningDto(dto)).toThrow(
        'happening title has leading or closing whitespace characters'
      );
    });

    it('should throw error when type is missing', () => {
      const dto = {
        title: 'Test Event',
        status: 'active',
        kind: 'activity',
        slots: { 'slot1': { repeats: 'once', start: { time: '10:00' } } },
      } as IHappeningDbo;

      expect(() => validateHappeningDto(dto)).toThrow('happening has no type');
    });

    it('should throw error when slots are empty', () => {
      const dto: IHappeningDbo = {
        title: 'Test Event',
        type: 'single',
        status: 'active',
        kind: 'activity',
        slots: {},
      };

      expect(() => validateHappeningDto(dto)).toThrow('!dto.slots?.length');
    });

    it('should throw error when slots are missing', () => {
      const dto: IHappeningDbo = {
        title: 'Test Event',
        type: 'single',
        status: 'active',
        kind: 'activity',
      };

      expect(() => validateHappeningDto(dto)).toThrow('!dto.slots?.length');
    });

    it('should accept valid single happening', () => {
      const dto: IHappeningDbo = {
        title: 'Test Event',
        type: 'single',
        status: 'active',
        kind: 'activity',
        slots: {
          'slot1': { repeats: 'once', start: { time: '10:00' } },
        },
      };

      expect(() => validateHappeningDto(dto)).not.toThrow();
    });

    it('should accept valid recurring happening', () => {
      const dto: IHappeningDbo = {
        title: 'Weekly Meeting',
        type: 'recurring',
        status: 'active',
        kind: 'activity',
        slots: {
          'slot1': { repeats: 'weekly', start: { time: '14:00' } },
        },
      };

      expect(() => validateHappeningDto(dto)).not.toThrow();
    });
  });

  describe('validateSingleHappeningSlot', () => {
    it('should throw error when repeats is not "once"', () => {
      const slot: IHappeningSlot = {
        repeats: 'weekly',
        start: { time: '10:00' },
      };

      expect(() => validateSingleHappeningSlot('slot1', slot)).toThrow(
        "slots[slot1]: slot repeats is not 'once': weekly"
      );
    });

    it('should throw error when start time is missing', () => {
      const slot: IHappeningSlot = {
        repeats: 'once',
        start: {},
      };

      expect(() => validateSingleHappeningSlot('slot1', slot)).toThrow(
        'slots[slot1]: slot has no start time'
      );
    });

    it('should accept valid single slot with time', () => {
      const slot: IHappeningSlot = {
        repeats: 'once',
        start: { time: '10:00' },
      };

      expect(() => validateSingleHappeningSlot('slot1', slot)).not.toThrow();
    });

    it('should accept valid single slot with date and time', () => {
      const slot: IHappeningSlot = {
        repeats: 'once',
        start: { date: '2024-01-15', time: '10:00' },
      };

      expect(() => validateSingleHappeningSlot('slot1', slot)).not.toThrow();
    });
  });

  describe('validateRecurringHappeningSlot', () => {
    it('should throw error when repeats is "once"', () => {
      const slot: IHappeningSlot = {
        repeats: 'once',
        start: { time: '10:00' },
      };

      expect(() => validateRecurringHappeningSlot('slot1', slot)).toThrow(
        'slots[slot1]: slot.repeats is not valid for recurring happening: once'
      );
    });

    it('should throw error when repeats is "UNKNOWN"', () => {
      const slot: IHappeningSlot = {
        repeats: 'UNKNOWN',
        start: { time: '10:00' },
      };

      expect(() => validateRecurringHappeningSlot('slot1', slot)).toThrow(
        'slots[slot1]: slot.repeats is not valid for recurring happening: UNKNOWN'
      );
    });

    it('should accept weekly recurring slot', () => {
      const slot: IHappeningSlot = {
        repeats: 'weekly',
        start: { time: '14:00' },
      };

      expect(() => validateRecurringHappeningSlot('slot1', slot)).not.toThrow();
    });

    it('should accept fortnightly recurring slot', () => {
      const slot: IHappeningSlot = {
        repeats: 'fortnightly',
        start: { time: '14:00' },
      };

      expect(() => validateRecurringHappeningSlot('slot1', slot)).not.toThrow();
    });

    it('should accept monthly recurring slot without start time', () => {
      const slot: IHappeningSlot = {
        repeats: 'monthly',
        start: {},
      };

      expect(() => validateRecurringHappeningSlot('slot1', slot)).not.toThrow();
    });

    it('should accept yearly recurring slot without start time', () => {
      const slot: IHappeningSlot = {
        repeats: 'yearly',
        start: {},
      };

      expect(() => validateRecurringHappeningSlot('slot1', slot)).not.toThrow();
    });
  });

  describe('constants', () => {
    it('emptyTiming should be defined', () => {
      expect(emptyTiming).toBeDefined();
      expect(emptyTiming).toEqual({});
    });

    it('emptyHappeningSlot should have correct structure', () => {
      expect(emptyHappeningSlot).toBeDefined();
      expect(emptyHappeningSlot.id).toBe('');
      expect(emptyHappeningSlot.repeats).toBe('UNKNOWN');
    });
  });
});
