import { describe, it, expect } from 'vitest';
import {
  excludeUndefined,
  excludeEmpty,
  undefinedIfEmpty,
  excludeZeroValues,
} from './exclude-undefined';

describe('excludeUndefined', () => {
  it('should return the same value if input is null', () => {
    expect(excludeUndefined(null)).toBe(null);
  });

  it('should return the same value if input is undefined', () => {
    expect(excludeUndefined(undefined)).toBe(undefined);
  });

  it('should remove undefined values from object', () => {
    const input = { a: 1, b: undefined, c: 'test' };
    const result = excludeUndefined(input);
    expect(result).toEqual({ a: 1, c: 'test' });
  });

  it('should keep null values in object', () => {
    const input = { a: 1, b: null, c: 'test' };
    const result = excludeUndefined(input);
    expect(result).toEqual({ a: 1, b: null, c: 'test' });
  });

  it('should keep empty string values in object', () => {
    const input = { a: 1, b: '', c: 'test' };
    const result = excludeUndefined(input);
    expect(result).toEqual({ a: 1, b: '', c: 'test' });
  });

  it('should keep zero values in object', () => {
    const input = { a: 0, b: 'test' };
    const result = excludeUndefined(input);
    expect(result).toEqual({ a: 0, b: 'test' });
  });

  it('should handle empty object', () => {
    const input = {};
    const result = excludeUndefined(input);
    expect(result).toEqual({});
  });
});

describe('excludeEmpty', () => {
  it('should return the same value if input is null', () => {
    expect(excludeEmpty(null)).toBe(null);
  });

  it('should return the same value if input is undefined', () => {
    expect(excludeEmpty(undefined)).toBe(undefined);
  });

  it('should remove undefined values from object', () => {
    const input = { a: 1, b: undefined, c: 'test' };
    const result = excludeEmpty(input);
    expect(result).toEqual({ a: 1, c: 'test' });
  });

  it('should remove empty string values from object', () => {
    const input = { a: 1, b: '', c: 'test' };
    const result = excludeEmpty(input);
    expect(result).toEqual({ a: 1, c: 'test' });
  });

  it('should keep null values in object', () => {
    const input = { a: 1, b: null, c: 'test' };
    const result = excludeEmpty(input);
    expect(result).toEqual({ a: 1, b: null, c: 'test' });
  });

  it('should keep zero values in object', () => {
    const input = { a: 0, b: 'test' };
    const result = excludeEmpty(input);
    expect(result).toEqual({ a: 0, b: 'test' });
  });

  it('should handle empty object', () => {
    const input = {};
    const result = excludeEmpty(input);
    expect(result).toEqual({});
  });
});

describe('undefinedIfEmpty', () => {
  it('should return the same value if input is null', () => {
    expect(undefinedIfEmpty(null as unknown as Record<string, unknown>)).toBe(
      null,
    );
  });

  it('should return the same value if input is undefined', () => {
    expect(
      undefinedIfEmpty(undefined as unknown as Record<string, unknown>),
    ).toBe(undefined);
  });

  it('should return undefined for empty object', () => {
    const input = {};
    const result = undefinedIfEmpty(input);
    expect(result).toBe(undefined);
  });

  it('should return the object if not empty', () => {
    const input = { a: 1, b: 'test' };
    const result = undefinedIfEmpty(input);
    expect(result).toEqual({ a: 1, b: 'test' });
  });

  it('should return the object with undefined values', () => {
    const input = { a: undefined, b: undefined };
    const result = undefinedIfEmpty(input);
    expect(result).toEqual({ a: undefined, b: undefined });
  });
});

describe('excludeZeroValues', () => {
  it('should return the same value if input is null', () => {
    expect(excludeZeroValues(null)).toBe(null);
  });

  it('should return the same value if input is undefined', () => {
    expect(excludeZeroValues(undefined)).toBe(undefined);
  });

  it('should remove zero values from object', () => {
    const input = { a: 0, b: 1, c: 'test' };
    const result = excludeZeroValues(input);
    expect(result).toEqual({ b: 1, c: 'test' });
  });

  it('should remove undefined values from object', () => {
    const input = { a: 1, b: undefined, c: 'test' };
    const result = excludeZeroValues(input);
    expect(result).toEqual({ a: 1, c: 'test' });
  });

  it('should keep empty string values in object', () => {
    const input = { a: 1, b: '', c: 'test' };
    const result = excludeZeroValues(input);
    expect(result).toEqual({ a: 1, b: '', c: 'test' });
  });

  it('should keep null values in object', () => {
    const input = { a: 1, b: null, c: 'test' };
    const result = excludeZeroValues(input);
    expect(result).toEqual({ a: 1, b: null, c: 'test' });
  });

  it('should handle empty object', () => {
    const input = {};
    const result = excludeZeroValues(input);
    expect(result).toEqual({});
  });

  it('should handle multiple zero values', () => {
    const input = { a: 0, b: 0, c: 1 };
    const result = excludeZeroValues(input);
    expect(result).toEqual({ c: 1 });
  });
});
