import { describe, it, expect } from 'vitest';
import { CurrencyList } from './constants';

describe('CurrencyList', () => {
  it('should contain USD', () => {
    expect(CurrencyList).toContain('USD');
  });

  it('should contain EUR', () => {
    expect(CurrencyList).toContain('EUR');
  });

  it('should have exactly 2 currencies', () => {
    expect(CurrencyList).toHaveLength(2);
  });

  it('should be an array', () => {
    expect(Array.isArray(CurrencyList)).toBe(true);
  });
});
