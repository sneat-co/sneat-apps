import { describe, it, expect } from 'vitest';
import { formNexInAnimation } from './form-animations';

describe('form-animations', () => {
  describe('formNexInAnimation', () => {
    it('should be defined', () => {
      expect(formNexInAnimation).toBeDefined();
    });

    it('should have trigger name "formNextIn"', () => {
      // Angular animation triggers have a name property
      // @ts-expect-error - accessing internal property for testing
      expect(formNexInAnimation.name).toBe('formNextIn');
    });

    it('should have definitions array', () => {
      // @ts-expect-error - accessing internal property for testing
      expect(Array.isArray(formNexInAnimation.definitions)).toBe(true);
    });

    it('should have at least one definition', () => {
      // @ts-expect-error - accessing internal property for testing
      expect(formNexInAnimation.definitions.length).toBeGreaterThan(0);
    });
  });
});
