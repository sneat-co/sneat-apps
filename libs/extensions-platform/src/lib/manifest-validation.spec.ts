import { describe, it, expect } from 'vitest';
import { validateManifest } from './manifest-validation';

const ORIGIN = 'https://listus.app';

function validManifest(over: Record<string, unknown> = {}): unknown {
  return {
    name: 'Listus',
    author: { name: 'Jane Dev', email: 'jane@listus.app' },
    icon: 'https://listus.app/icon.png',
    scopes: ['contacts:read', 'lists:read'],
    origin: ORIGIN,
    ...over,
  };
}

describe('validateManifest', () => {
  it('accepts a well-formed manifest whose origin matches the fetch origin', () => {
    const result = validateManifest(validManifest(), ORIGIN);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.manifest.name).toBe('Listus');
      expect(result.manifest.origin).toBe(ORIGIN);
      expect(result.manifest.scopes).toEqual(['contacts:read', 'lists:read']);
    }
  });

  it('rejects a non-object body', () => {
    expect(validateManifest('not json', ORIGIN).ok).toBe(false);
    expect(validateManifest(null, ORIGIN).ok).toBe(false);
    expect(validateManifest(42, ORIGIN).ok).toBe(false);
  });

  it('rejects a missing or empty name', () => {
    expect(
      validateManifest(validManifest({ name: undefined }), ORIGIN).ok,
    ).toBe(false);
    expect(validateManifest(validManifest({ name: '' }), ORIGIN).ok).toBe(
      false,
    );
    expect(validateManifest(validManifest({ name: 123 }), ORIGIN).ok).toBe(
      false,
    );
  });

  it('rejects a missing author or author.name', () => {
    expect(
      validateManifest(validManifest({ author: undefined }), ORIGIN).ok,
    ).toBe(false);
    expect(
      validateManifest(
        validManifest({ author: { email: 'jane@listus.app' } }),
        ORIGIN,
      ).ok,
    ).toBe(false);
  });

  it('rejects a syntactically invalid author.email', () => {
    for (const email of [
      'notanemail',
      'jane@',
      '@listus.app',
      'jane@listus',
      'a b@c.d',
    ]) {
      expect(
        validateManifest(
          validManifest({ author: { name: 'Jane', email } }),
          ORIGIN,
        ).ok,
      ).toBe(false);
    }
  });

  it('rejects a non-https icon URL', () => {
    expect(
      validateManifest(
        validManifest({ icon: 'http://listus.app/i.png' }),
        ORIGIN,
      ).ok,
    ).toBe(false);
    expect(
      validateManifest(validManifest({ icon: '/relative.png' }), ORIGIN).ok,
    ).toBe(false);
    expect(validateManifest(validManifest({ icon: 123 }), ORIGIN).ok).toBe(
      false,
    );
  });

  it('rejects scopes that are not a string array', () => {
    expect(validateManifest(validManifest({ scopes: 'x' }), ORIGIN).ok).toBe(
      false,
    );
    expect(validateManifest(validManifest({ scopes: [1, 2] }), ORIGIN).ok).toBe(
      false,
    );
    expect(
      validateManifest(validManifest({ scopes: undefined }), ORIGIN).ok,
    ).toBe(false);
  });

  it('accepts an empty scopes array (structural only - support is not checked here)', () => {
    expect(validateManifest(validManifest({ scopes: [] }), ORIGIN).ok).toBe(
      true,
    );
  });

  it('rejects a self-declared origin that differs from the fetch origin', () => {
    const result = validateManifest(
      validManifest({ origin: 'https://evil.app' }),
      ORIGIN,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain('does not match');
    }
  });

  it('rejects a non-https self-declared origin', () => {
    expect(
      validateManifest(validManifest({ origin: 'http://listus.app' }), ORIGIN)
        .ok,
    ).toBe(false);
  });
});
