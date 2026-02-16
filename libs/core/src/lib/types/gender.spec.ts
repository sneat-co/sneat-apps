import { describe, it, expect } from 'vitest';
import {
  GenderUndisclosed,
  GenderUnknown,
  GenderMale,
  GenderFemale,
  GenderOther,
} from './gender';

describe('Gender constants', () => {
  it('should have correct value for GenderUndisclosed', () => {
    expect(GenderUndisclosed).toBe('undisclosed');
  });

  it('should have correct value for GenderUnknown', () => {
    expect(GenderUnknown).toBe('unknown');
  });

  it('should have correct value for GenderMale', () => {
    expect(GenderMale).toBe('male');
  });

  it('should have correct value for GenderFemale', () => {
    expect(GenderFemale).toBe('female');
  });

  it('should have correct value for GenderOther', () => {
    expect(GenderOther).toBe('other');
  });

  it('should have all unique values', () => {
    const values = [
      GenderUndisclosed,
      GenderUnknown,
      GenderMale,
      GenderFemale,
      GenderOther,
    ];
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });
});
