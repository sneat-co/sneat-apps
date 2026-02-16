import { describe, it, expect } from 'vitest';
import {
  STORE_ID_FIRESTORE,
  STORE_TYPE_FIRESTORE,
  STORE_TYPE_GITHUB,
  STORE_ID_GITHUB_COM,
  GITLAB_REPO_PREFIX,
  storeCanProvideListOfProjects,
  storeRefToId,
  parseStoreRef,
  IStoreRef,
} from './store';

describe('store', () => {
  describe('constants', () => {
    it('should have correct value for STORE_ID_FIRESTORE', () => {
      expect(STORE_ID_FIRESTORE).toBe('firestore');
    });

    it('should have correct value for STORE_TYPE_FIRESTORE', () => {
      expect(STORE_TYPE_FIRESTORE).toBe('firestore');
    });

    it('should have correct value for STORE_TYPE_GITHUB', () => {
      expect(STORE_TYPE_GITHUB).toBe('github');
    });

    it('should have correct value for STORE_ID_GITHUB_COM', () => {
      expect(STORE_ID_GITHUB_COM).toBe('github.com');
    });

    it('should have correct value for GITLAB_REPO_PREFIX', () => {
      expect(GITLAB_REPO_PREFIX).toBe('gitlab.');
    });
  });

  describe('storeCanProvideListOfProjects', () => {
    it('should return false for firestore store', () => {
      expect(storeCanProvideListOfProjects(STORE_ID_FIRESTORE)).toBe(false);
    });

    it('should return false for github.com store', () => {
      expect(storeCanProvideListOfProjects(STORE_ID_GITHUB_COM)).toBe(false);
    });

    it('should return true for custom store', () => {
      expect(storeCanProvideListOfProjects('custom-store')).toBe(true);
    });

    it('should return true for gitlab store', () => {
      expect(storeCanProvideListOfProjects('gitlab.example.com')).toBe(true);
    });
  });

  describe('storeRefToId', () => {
    it('should return type for firestore without url', () => {
      const ref: IStoreRef = { type: 'firestore' };
      expect(storeRefToId(ref)).toBe('firestore');
    });

    it('should return url for firestore with url', () => {
      const ref: IStoreRef = { type: 'firestore', url: 'custom-firestore' };
      expect(storeRefToId(ref)).toBe('custom-firestore');
    });

    it('should return type for github without url', () => {
      const ref: IStoreRef = { type: 'github' };
      expect(storeRefToId(ref)).toBe('github');
    });

    it('should return url for github with url', () => {
      const ref: IStoreRef = { type: 'github', url: 'github.com' };
      expect(storeRefToId(ref)).toBe('github.com');
    });

    it('should return url for gitlab with url', () => {
      const ref: IStoreRef = { type: 'gitlab', url: 'gitlab.example.com' };
      expect(storeRefToId(ref)).toBe('gitlab.example.com');
    });

    it('should throw error for gitlab without url', () => {
      const ref: IStoreRef = { type: 'gitlab' };
      expect(() => storeRefToId(ref)).toThrow(
        'store with type "agent" must have URL',
      );
    });

    it('should return url for agent with url', () => {
      const ref: IStoreRef = { type: 'agent', url: 'http://example.com' };
      expect(storeRefToId(ref)).toBe('http://example.com');
    });

    it('should throw error for agent without url', () => {
      const ref: IStoreRef = { type: 'agent' };
      expect(() => storeRefToId(ref)).toThrow(
        'store with type "agent" must have URL',
      );
    });

    it('should return empty string for browser type', () => {
      const ref: IStoreRef = { type: 'browser' };
      expect(storeRefToId(ref)).toBe('');
    });
  });

  describe('parseStoreRef', () => {
    it('should throw error for undefined storeId', () => {
      expect(() => parseStoreRef(undefined)).toThrow(
        'storeId is a required parameter',
      );
    });

    it('should throw error for empty storeId', () => {
      expect(() => parseStoreRef('')).toThrow(
        'storeId is a required parameter',
      );
    });

    it('should parse firestore store', () => {
      const result = parseStoreRef('firestore');
      expect(result).toEqual({ type: 'firestore' });
    });

    it('should parse github store', () => {
      const result = parseStoreRef('github');
      expect(result).toEqual({ type: 'github' });
    });

    it('should parse github.com as github type', () => {
      const result = parseStoreRef('github.com');
      expect(result).toEqual({ type: 'github' });
    });

    it('should parse http- prefix as agent with http url', () => {
      const result = parseStoreRef('http-example.com');
      expect(result).toEqual({ type: 'agent', url: 'http://example.com' });
    });

    it('should parse https- prefix as agent with https url', () => {
      const result = parseStoreRef('https-example.com');
      expect(result).toEqual({ type: 'agent', url: 'https://example.com' });
    });

    it('should throw error for unsupported format', () => {
      expect(() => parseStoreRef('unsupported-format')).toThrow(
        'unsupported format of store id:unsupported-format',
      );
    });

    it('should throw error for random string', () => {
      expect(() => parseStoreRef('random-string')).toThrow(
        'unsupported format of store id:random-string',
      );
    });
  });
});
