import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { IS_TRUSTED_ORIGIN } from './is-trusted-origin';
import {
  TRUSTED_ORIGIN_ALLOWLIST,
  isTrustedOrigin,
  provideTrustedOrigins,
} from './trusted-origin-allowlist';

describe('trusted-origin allowlist', () => {
  // AC: only-allowlisted-origin-eligible
  it('an allowlisted origin is eligible and another origin is not', () => {
    expect(TRUSTED_ORIGIN_ALLOWLIST).toContain('https://listus.app');
    expect(isTrustedOrigin('https://listus.app')).toBe(true);
    expect(isTrustedOrigin('https://acme.example')).toBe(false);
  });

  it('matches exactly: scheme, host and port must all match', () => {
    expect(isTrustedOrigin('http://listus.app')).toBe(false);
    expect(isTrustedOrigin('https://listus.app:8443')).toBe(false);
    expect(isTrustedOrigin('https://evil.listus.app')).toBe(false);
    expect(isTrustedOrigin('https://listus.app.evil.com')).toBe(false);
  });

  it('is not mutable at runtime', () => {
    expect(() =>
      (TRUSTED_ORIGIN_ALLOWLIST as string[]).push('https://injected.example'),
    ).toThrow();
    expect(isTrustedOrigin('https://injected.example')).toBe(false);
  });

  it('provideTrustedOrigins binds IS_TRUSTED_ORIGIN to the real predicate', () => {
    TestBed.configureTestingModule({ providers: [provideTrustedOrigins()] });
    const predicate = TestBed.inject(IS_TRUSTED_ORIGIN);
    expect(predicate('https://listus.app')).toBe(true);
    expect(predicate('https://acme.example')).toBe(false);
  });
});
