import { describe, it, expect } from 'vitest';
import { setHrefQueryParam } from './location-href';

describe('setHrefQueryParam', () => {
  it('should add query param to URL without existing params', () => {
    const href = 'https://example.com/path';
    const result = setHrefQueryParam('foo', 'bar', href);
    expect(result).toBe('https://example.com/path?foo=bar');
  });

  it('should add query param to URL with existing params', () => {
    const href = 'https://example.com/path?existing=value';
    const result = setHrefQueryParam('foo', 'bar', href);
    expect(result).toBe('https://example.com/path?existing=value&foo=bar');
  });

  it('should update existing query param', () => {
    const href = 'https://example.com/path?foo=old';
    const result = setHrefQueryParam('foo', 'new', href);
    expect(result).toBe('https://example.com/path?foo=new');
  });

  it('should handle special characters in param value', () => {
    const href = 'https://example.com/path';
    const result = setHrefQueryParam('foo', 'hello world', href);
    expect(result).toBe('https://example.com/path?foo=hello+world');
  });

  it('should handle empty string value', () => {
    const href = 'https://example.com/path';
    const result = setHrefQueryParam('foo', '', href);
    expect(result).toBe('https://example.com/path?foo=');
  });

  it('should preserve hash in URL', () => {
    const href = 'https://example.com/path#section';
    const result = setHrefQueryParam('foo', 'bar', href);
    expect(result).toBe('https://example.com/path?foo=bar#section');
  });

  it('should work with localhost', () => {
    const href = 'http://localhost:4200/path';
    const result = setHrefQueryParam('test', 'value', href);
    expect(result).toBe('http://localhost:4200/path?test=value');
  });

  it('should handle multiple updates to same URL', () => {
    const href = 'https://example.com/path';
    const result1 = setHrefQueryParam('foo', 'bar', href);
    const result2 = setHrefQueryParam('baz', 'qux', result1);
    expect(result2).toBe('https://example.com/path?foo=bar&baz=qux');
  });
});
