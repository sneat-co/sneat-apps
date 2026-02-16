import { describe, it, expect } from 'vitest';
import {
  equalSpaceRefs,
  emptySpaceRef,
  spaceItemBriefWithSpaceRefFromBrief,
  type ISpaceRef,
} from './interfaces';

describe('interfaces', () => {
  describe('emptySpaceRef', () => {
    it('should have empty id', () => {
      expect(emptySpaceRef.id).toBe('');
    });

    it('should not have type', () => {
      expect(emptySpaceRef.type).toBeUndefined();
    });
  });

  describe('equalSpaceRefs', () => {
    it('should return true for identical objects', () => {
      const ref: ISpaceRef = { id: 'space1', type: 'family' };
      expect(equalSpaceRefs(ref, ref)).toBe(true);
    });

    it('should return true for null compared to null', () => {
      expect(equalSpaceRefs(null, null)).toBe(true);
    });

    it('should return true for undefined compared to undefined', () => {
      expect(equalSpaceRefs(undefined, undefined)).toBe(true);
    });

    it('should return true for same id and type', () => {
      const ref1: ISpaceRef = { id: 'space1', type: 'family' };
      const ref2: ISpaceRef = { id: 'space1', type: 'family' };
      expect(equalSpaceRefs(ref1, ref2)).toBe(true);
    });

    it('should return true for same id without type', () => {
      const ref1: ISpaceRef = { id: 'space1' };
      const ref2: ISpaceRef = { id: 'space1' };
      expect(equalSpaceRefs(ref1, ref2)).toBe(true);
    });

    it('should return false for different ids', () => {
      const ref1: ISpaceRef = { id: 'space1', type: 'family' };
      const ref2: ISpaceRef = { id: 'space2', type: 'family' };
      expect(equalSpaceRefs(ref1, ref2)).toBe(false);
    });

    it('should return false for different types', () => {
      const ref1: ISpaceRef = { id: 'space1', type: 'family' };
      const ref2: ISpaceRef = { id: 'space1', type: 'team' };
      expect(equalSpaceRefs(ref1, ref2)).toBe(false);
    });

    it('should return false when comparing null to non-null', () => {
      const ref: ISpaceRef = { id: 'space1' };
      expect(equalSpaceRefs(null, ref)).toBe(false);
      expect(equalSpaceRefs(ref, null)).toBe(false);
    });

    it('should return false when comparing undefined to defined', () => {
      const ref: ISpaceRef = { id: 'space1' };
      expect(equalSpaceRefs(undefined, ref)).toBe(false);
      expect(equalSpaceRefs(ref, undefined)).toBe(false);
    });

    it('should return false for one with type and one without', () => {
      const ref1: ISpaceRef = { id: 'space1', type: 'family' };
      const ref2: ISpaceRef = { id: 'space1' };
      expect(equalSpaceRefs(ref1, ref2)).toBe(false);
    });
  });

  describe('spaceItemBriefWithSpaceRefFromBrief', () => {
    it('should create space item with brief', () => {
      const space: ISpaceRef = { id: 'space1', type: 'family' };
      const brief = { name: 'Test Item' };
      const result = spaceItemBriefWithSpaceRefFromBrief(space, 'item1', brief);

      expect(result.id).toBe('item1');
      expect(result.space).toBe(space);
      expect(result.brief).toBe(brief);
    });

    it('should preserve space reference', () => {
      const space: ISpaceRef = { id: 'space2', type: 'team' };
      const brief = { title: 'Project' };
      const result = spaceItemBriefWithSpaceRefFromBrief(space, 'proj1', brief);

      expect(result.space.id).toBe('space2');
      expect(result.space.type).toBe('team');
    });

    it('should work with any brief type', () => {
      const space: ISpaceRef = { id: 'space3' };
      const brief = { count: 42, active: true };
      const result = spaceItemBriefWithSpaceRefFromBrief(space, 'id123', brief);

      expect(result.id).toBe('id123');
      expect(result.brief.count).toBe(42);
      expect(result.brief.active).toBe(true);
    });

    it('should work with empty brief', () => {
      const space: ISpaceRef = { id: 'space4' };
      const brief = {};
      const result = spaceItemBriefWithSpaceRefFromBrief(space, 'empty', brief);

      expect(result.id).toBe('empty');
      expect(result.brief).toEqual({});
    });
  });
});
