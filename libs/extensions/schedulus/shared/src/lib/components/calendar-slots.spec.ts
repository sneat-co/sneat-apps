import { describe, it, expect } from 'vitest';
import { hasContact, isSlotVisible } from './calendar-slots';
import { IRelatedModules } from '@sneat/dto';
import {
  ISlotUIContext,
  IHappeningContext,
} from '@sneat/mod-schedulus-core';
import { ICalendarFilter } from './calendar/components/calendar-filter/calendar-filter';

describe('calendar-slots utilities', () => {
  describe('hasContact', () => {
    it('should return true when contactIDs is empty', () => {
      const result = hasContact('space1', [], undefined);
      expect(result).toBe(true);
    });

    it('should return true when related has matching contact', () => {
      const related: IRelatedModules = {
        contactus: {
          contacts: {
            contact1: {},
            contact2: {},
          },
        },
      };
      const result = hasContact('space1', ['contact1'], related);
      expect(result).toBe(true);
    });

    it('should return false when no matching contacts', () => {
      const related: IRelatedModules = {
        contactus: {
          contacts: {
            contact1: {},
            contact2: {},
          },
        },
      };
      const result = hasContact('space1', ['contact3'], related);
      expect(result).toBe(false);
    });

    it('should return true when contactIDs includes empty string and no related contacts', () => {
      const result = hasContact('space1', [''], undefined);
      expect(result).toBe(true);
    });

    it('should handle missing related parameter', () => {
      const result = hasContact('space1', ['contact1'], undefined);
      expect(result).toBe(false);
    });

    it('should handle multiple contact IDs', () => {
      const related: IRelatedModules = {
        contactus: {
          contacts: {
            contact1: {},
            contact2: {},
          },
        },
      };
      const result = hasContact('space1', ['contact2', 'contact3'], related);
      expect(result).toBe(true);
    });

    it('should return false when related contacts exist but no match', () => {
      const related: IRelatedModules = {
        contactus: {
          contacts: {
            contact1: {},
          },
        },
      };
      const result = hasContact('space1', ['contact2'], related);
      expect(result).toBe(false);
    });

    it('should handle space-qualified contact keys', () => {
      const related: IRelatedModules = {
        contactus: {
          contacts: {
            'contact1@space1': {},
            'contact2@space2': {},
          },
        },
      };
      // The keys themselves must match, so we need to check with the full key or just the ID part
      // In this case, relatedItemIDs will return ['contact1@space1'] for space1
      // So we need to check if 'contact1@space1' is in our contactIDs list
      expect(hasContact('space1', ['contact1@space1'], related)).toBe(true);
      // contact2@space2 should be filtered out for space1
      expect(hasContact('space1', ['contact2@space2'], related)).toBe(false);
    });
  });

  describe('isSlotVisible', () => {
    const createMockSlot = (
      overrides?: Partial<ISlotUIContext>,
    ): ISlotUIContext =>
      ({
        slot: { id: 'slot1' },
        title: 'Test Event',
        timing: { start: { time: '10:00' }, end: { time: '11:00' } },
        repeats: 'weekly',
        happening: {
          id: 'happening1',
          space: { id: 'space1' },
          brief: {
            title: 'Test Event',
            slots: {
              slot1: { repeats: 'weekly' },
            },
          },
        },
        ...overrides,
      }) as ISlotUIContext;

    const createMockFilter = (
      overrides?: Partial<ICalendarFilter>,
    ): ICalendarFilter =>
      ({
        text: '',
        contactIDs: [],
        showRecurrings: true,
        showSingles: true,
        repeats: [],
        ...overrides,
      }) as ICalendarFilter;

    it('should return false when contact filter does not match', () => {
      const slot = createMockSlot();
      const filter = createMockFilter({ contactIDs: ['nonexistent'] });
      const result = isSlotVisible(slot, filter);
      expect(result).toBe(false);
    });

    it('should return false when repeats filter does not match', () => {
      const slot = createMockSlot();
      const filter = createMockFilter({ repeats: ['daily', 'monthly'] });
      const result = isSlotVisible(slot, filter);
      expect(result).toBe(false);
    });

    it('should return true when repeats filter matches', () => {
      const slot = createMockSlot();
      const filter = createMockFilter({ repeats: ['weekly'] });
      const result = isSlotVisible(slot, filter);
      expect(result).toBe(true);
    });

    it('should return true when no filters applied', () => {
      const slot = createMockSlot();
      const filter = createMockFilter();
      const result = isSlotVisible(slot, filter);
      expect(result).toBe(true);
    });

    it('should filter by text case-insensitively', () => {
      const slot = createMockSlot({ title: 'Team Meeting' });
      const filter = createMockFilter({ text: 'team' });
      const result = isSlotVisible(slot, filter);
      expect(result).toBe(true);
    });

    it('should return false when text does not match', () => {
      const slot = createMockSlot({ title: 'Team Meeting' });
      const filter = createMockFilter({ text: 'birthday' });
      const result = isSlotVisible(slot, filter);
      expect(result).toBe(false);
    });

    it('should handle showRecurrings and showSingles flags', () => {
      const slot = createMockSlot();
      // The logic is: ((!!slot.happening && filter.showRecurrings) || (!!slot.happening && filter.showSingles))
      // This means if slot.happening exists, at least one of showRecurrings or showSingles must be true
      const filter1 = createMockFilter({
        showRecurrings: false,
        showSingles: true,
      });
      expect(isSlotVisible(slot, filter1)).toBe(true);

      const filter2 = createMockFilter({
        showRecurrings: true,
        showSingles: false,
      });
      expect(isSlotVisible(slot, filter2)).toBe(true);

      const filter3 = createMockFilter({
        showRecurrings: false,
        showSingles: false,
      });
      expect(isSlotVisible(slot, filter3)).toBe(false);
    });

    it('should handle empty repeats filter array', () => {
      const slot = createMockSlot();
      const filter = createMockFilter({ repeats: [] });
      const result = isSlotVisible(slot, filter);
      expect(result).toBe(true);
    });

    it('should handle slot with dbo instead of brief', () => {
      const slot = createMockSlot({
        happening: {
          id: 'happening1',
          space: { id: 'space1' },
          dbo: {
            title: 'Test Event',
            slots: {
              slot1: { repeats: 'weekly' },
            },
          },
        } as IHappeningContext,
      });
      const filter = createMockFilter({ repeats: ['weekly'] });
      const result = isSlotVisible(slot, filter);
      expect(result).toBe(true);
    });
  });
});
