import { eq } from './eq';
import { describe, it, expect } from 'vitest';

describe('eq', () => {
  it('should return true if both are undefined', () => {
    expect(eq(undefined, undefined)).toBe(true);
  });

  it('should return true if both are null', () => {
    expect(eq(null as any, null as any)).toBe(true);
  });

  it('should return true if both are same string', () => {
    expect(eq('a', 'a')).toBe(true);
  });

  it('should return false if strings differ', () => {
    expect(eq('a', 'b')).toBe(false);
  });

  it('should return true if one is null and other is undefined', () => {
    expect(eq(null as any, undefined)).toBe(true);
  });
});
