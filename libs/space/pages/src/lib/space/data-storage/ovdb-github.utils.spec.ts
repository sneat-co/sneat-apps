import {
  isSpaceAdmin,
  isValidRepo,
  parseInstallationID,
} from './ovdb-github.utils';

describe('ovdb-github.utils', () => {
  describe('isValidRepo', () => {
    it('accepts owner/name', () => {
      expect(isValidRepo('octocat/family-data')).toBe(true);
      expect(isValidRepo('Some_Org/repo.name')).toBe(true);
      expect(isValidRepo('  octocat/data  ')).toBe(true); // trimmed
    });
    it('rejects malformed values', () => {
      expect(isValidRepo('octocat')).toBe(false);
      expect(isValidRepo('octocat/')).toBe(false);
      expect(isValidRepo('/data')).toBe(false);
      expect(isValidRepo('a/b/c')).toBe(false);
      expect(isValidRepo('octo cat/data')).toBe(false);
      expect(isValidRepo('')).toBe(false);
    });
  });

  describe('parseInstallationID', () => {
    it('parses a positive integer', () => {
      expect(parseInstallationID('12345')).toBe(12345);
      expect(parseInstallationID('  42 ')).toBe(42);
    });
    it('rejects non-positive / non-numeric input', () => {
      expect(parseInstallationID('0')).toBeUndefined();
      expect(parseInstallationID('-3')).toBeUndefined();
      expect(parseInstallationID('12.5')).toBeUndefined();
      expect(parseInstallationID('abc')).toBeUndefined();
      expect(parseInstallationID('')).toBeUndefined();
    });
  });

  describe('isSpaceAdmin', () => {
    it('is true for admin or creator roles', () => {
      expect(isSpaceAdmin(['admin'])).toBe(true);
      expect(isSpaceAdmin(['contributor', 'creator'])).toBe(true);
    });
    it('is false otherwise', () => {
      expect(isSpaceAdmin(['contributor'])).toBe(false);
      expect(isSpaceAdmin([])).toBe(false);
      expect(isSpaceAdmin(undefined)).toBe(false);
    });
  });
});
