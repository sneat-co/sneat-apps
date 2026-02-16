import { describe, it, expect } from 'vitest';
import {
  ISneatExtension,
  defaultFamilyExtension,
  defaultFamilyMemberExtensions,
} from './sneat-extensions';

describe('Sneat Extensions', () => {
  describe('defaultFamilyExtension', () => {
    it('should be an array', () => {
      expect(Array.isArray(defaultFamilyExtension)).toBe(true);
    });

    it('should have 4 extensions', () => {
      expect(defaultFamilyExtension).toHaveLength(4);
    });

    it('should contain assets extension', () => {
      const assets = defaultFamilyExtension.find((ext) => ext.id === 'assets');
      expect(assets).toBeDefined();
      expect(assets?.title).toBe('Assets');
      expect(assets?.emoji).toBe('🏡');
    });

    it('should contain calendarium extension', () => {
      const calendarium = defaultFamilyExtension.find(
        (ext) => ext.id === 'calendarium',
      );
      expect(calendarium).toBeDefined();
      expect(calendarium?.title).toBe('Calendar');
      expect(calendarium?.emoji).toBe('🗓️');
    });

    it('should contain documents extension', () => {
      const documents = defaultFamilyExtension.find(
        (ext) => ext.id === 'documents',
      );
      expect(documents).toBeDefined();
      expect(documents?.title).toBe('Documents');
      expect(documents?.emoji).toBe('📄');
    });

    it('should contain sizes extension', () => {
      const sizes = defaultFamilyExtension.find((ext) => ext.id === 'sizes');
      expect(sizes).toBeDefined();
      expect(sizes?.title).toBe('Sizes');
      expect(sizes?.emoji).toBe('📏');
    });

    it('should have all valid ISneatExtension objects', () => {
      defaultFamilyExtension.forEach((ext: ISneatExtension) => {
        expect(ext.id).toBeDefined();
        expect(typeof ext.id).toBe('string');
        expect(ext.title).toBeDefined();
        expect(typeof ext.title).toBe('string');
        expect(ext.emoji).toBeDefined();
        expect(typeof ext.emoji).toBe('string');
      });
    });
  });

  describe('defaultFamilyMemberExtensions', () => {
    it('should be an array', () => {
      expect(Array.isArray(defaultFamilyMemberExtensions)).toBe(true);
    });

    it('should have 4 extensions', () => {
      expect(defaultFamilyMemberExtensions).toHaveLength(4);
    });

    it('should contain assets extension', () => {
      const assets = defaultFamilyMemberExtensions.find(
        (ext) => ext.id === 'assets',
      );
      expect(assets).toBeDefined();
      expect(assets?.title).toBe('Assets');
      expect(assets?.emoji).toBe('🏡');
    });

    it('should contain calendarium extension', () => {
      const calendarium = defaultFamilyMemberExtensions.find(
        (ext) => ext.id === 'calendarium',
      );
      expect(calendarium).toBeDefined();
      expect(calendarium?.title).toBe('Calendar');
      expect(calendarium?.emoji).toBe('🗓️');
    });

    it('should contain documents extension', () => {
      const documents = defaultFamilyMemberExtensions.find(
        (ext) => ext.id === 'documents',
      );
      expect(documents).toBeDefined();
      expect(documents?.title).toBe('Documents');
      expect(documents?.emoji).toBe('📄');
    });

    it('should contain sizes extension', () => {
      const sizes = defaultFamilyMemberExtensions.find(
        (ext) => ext.id === 'sizes',
      );
      expect(sizes).toBeDefined();
      expect(sizes?.title).toBe('Sizes');
      expect(sizes?.emoji).toBe('📏');
    });

    it('should have all valid ISneatExtension objects', () => {
      defaultFamilyMemberExtensions.forEach((ext: ISneatExtension) => {
        expect(ext.id).toBeDefined();
        expect(typeof ext.id).toBe('string');
        expect(ext.title).toBeDefined();
        expect(typeof ext.title).toBe('string');
        expect(ext.emoji).toBeDefined();
        expect(typeof ext.emoji).toBe('string');
      });
    });

    it('should have same extensions as defaultFamilyExtension', () => {
      expect(defaultFamilyMemberExtensions.length).toBe(
        defaultFamilyExtension.length,
      );
      defaultFamilyExtension.forEach((ext) => {
        expect(defaultFamilyMemberExtensions).toContainEqual(ext);
      });
    });
  });
});
