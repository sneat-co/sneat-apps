import { describe, it, expect } from 'vitest';
import { listItemAnimations, listAddRemoveAnimation } from './list-animations';

describe('list-animations', () => {
  describe('listItemAnimations', () => {
    it('should be defined', () => {
      expect(listItemAnimations).toBeDefined();
    });

    it('should have trigger name "listItem"', () => {
      // Angular animation triggers have a name property
      // @ts-expect-error - accessing internal property for testing
      expect(listItemAnimations.name).toBe('listItem');
    });

    it('should have definitions array', () => {
      // @ts-expect-error - accessing internal property for testing
      expect(Array.isArray(listItemAnimations.definitions)).toBe(true);
    });

    it('should have multiple definitions for add and remove', () => {
      // @ts-expect-error - accessing internal property for testing
      expect(listItemAnimations.definitions.length).toBeGreaterThan(0);
    });
  });

  describe('listAddRemoveAnimation', () => {
    it('should be defined', () => {
      expect(listAddRemoveAnimation).toBeDefined();
    });

    it('should be an array', () => {
      expect(Array.isArray(listAddRemoveAnimation)).toBe(true);
    });

    it('should have at least one animation trigger', () => {
      expect(listAddRemoveAnimation.length).toBeGreaterThan(0);
    });

    it('should have trigger name "addRemove"', () => {
      // @ts-expect-error - accessing internal property for testing
      expect(listAddRemoveAnimation[0].name).toBe('addRemove');
    });

    it('should have definitions array in the first trigger', () => {
      // @ts-expect-error - accessing internal property for testing
      expect(Array.isArray(listAddRemoveAnimation[0].definitions)).toBe(true);
    });
  });
});
