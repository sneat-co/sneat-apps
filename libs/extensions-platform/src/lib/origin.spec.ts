import { describe, it, expect } from 'vitest';
import { extensionIdOf, httpsOriginOf } from './origin';

describe('httpsOriginOf', () => {
  it('returns the origin for an https URL', () => {
    expect(httpsOriginOf('https://listus.app/path?x=1')).toBe(
      'https://listus.app',
    );
    expect(httpsOriginOf('https://listus.app:8443/')).toBe(
      'https://listus.app:8443',
    );
  });

  it('returns undefined for non-https or invalid URLs', () => {
    expect(httpsOriginOf('http://listus.app')).toBeUndefined();
    expect(httpsOriginOf('ftp://listus.app')).toBeUndefined();
    expect(httpsOriginOf('not a url')).toBeUndefined();
  });
});

describe('extensionIdOf', () => {
  it('returns host[:port] for an https origin or URL', () => {
    expect(extensionIdOf('https://listus.app')).toBe('listus.app');
    expect(extensionIdOf('https://listus.app:8443/foo')).toBe(
      'listus.app:8443',
    );
  });

  it('returns undefined for non-https input', () => {
    expect(extensionIdOf('http://listus.app')).toBeUndefined();
  });
});
