import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ConsentStore } from '../consent-store.service';

/**
 * The authoritative not-granted-is-denied contract that downstream consumers
 * (notably the Protected-Data Gateway) rely on: a scope that was NEVER granted,
 * was DECLINED, or was REVOKED is reported as not granted, so the consumer
 * denies access.
 *
 * specscore: https://specscore.md/features/extension-consent-and-scopes
 * Verifies: extension-consent-and-scopes#ac:ungranted-scope-treated-as-denied
 */
describe('ConsentStore — authoritative not-granted-is-denied contract', () => {
  const USER = 'user';
  const EXT = 'ext.app';
  let store: ConsentStore;

  /** A consumer denies when the store does not currently grant the scope. */
  const consumerAllows = (scope: string) => store.isGranted(USER, EXT, scope);

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ConsentStore);
  });

  it('denies a scope that was never granted', () => {
    expect(consumerAllows('contacts:read')).toBe(false);
  });

  it('denies a scope that was declined', () => {
    store.recordDecline(USER, EXT, 'contacts:read');
    expect(consumerAllows('contacts:read')).toBe(false);
  });

  it('denies a scope that was granted and then revoked', () => {
    store.recordGrant(USER, EXT, 'contacts:read');
    expect(consumerAllows('contacts:read')).toBe(true);
    store.revoke(USER, EXT, 'contacts:read');
    expect(consumerAllows('contacts:read')).toBe(false);
  });

  it('denies a scope outside the catalog even if persisted somehow', () => {
    expect(consumerAllows('files:write')).toBe(false);
  });
});
