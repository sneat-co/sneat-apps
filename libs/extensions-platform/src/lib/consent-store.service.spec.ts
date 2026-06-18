import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ConsentStore } from './consent-store.service';

const USER_A = 'userA';
const USER_B = 'userB';
const EXT_X = 'x.app';
const EXT_Y = 'y.app';

describe('ConsentStore', () => {
  let store: ConsentStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(ConsentStore);
  });

  it('records a grant so isGranted reports it and listGranted includes it', () => {
    store.recordGrant(USER_A, EXT_X, 'contacts:read');
    expect(store.isGranted(USER_A, EXT_X, 'contacts:read')).toBe(true);
    expect(store.listGranted(USER_A, EXT_X)).toEqual(['contacts:read']);
  });

  it('treats a never-decided scope as not granted', () => {
    expect(store.isGranted(USER_A, EXT_X, 'profile:read')).toBe(false);
    expect(store.listGranted(USER_A, EXT_X)).toEqual([]);
  });

  it('treats a declined scope as not granted', () => {
    store.recordDecline(USER_A, EXT_X, 'profile:read');
    expect(store.isGranted(USER_A, EXT_X, 'profile:read')).toBe(false);
    expect(store.listGranted(USER_A, EXT_X)).toEqual([]);
    expect(store.decidedScopes(USER_A, EXT_X).has('profile:read')).toBe(true);
  });

  it('never reports a non-catalog scope as granted', () => {
    expect(store.isGranted(USER_A, EXT_X, 'files:write')).toBe(false);
  });

  // AC: grants-isolated-per-user-and-extension
  it('does not leak grants across extensions', () => {
    store.recordGrant(USER_A, EXT_X, 'contacts:read');
    expect(store.isGranted(USER_A, EXT_Y, 'contacts:read')).toBe(false);
    expect(store.listGranted(USER_A, EXT_Y)).toEqual([]);
  });

  // AC: grants-isolated-per-user-and-extension
  it('does not leak grants across users', () => {
    store.recordGrant(USER_A, EXT_X, 'contacts:read');
    expect(store.isGranted(USER_B, EXT_X, 'contacts:read')).toBe(false);
  });

  it('decidedScopes returns both granted and declined scopes', () => {
    store.recordGrant(USER_A, EXT_X, 'profile:read');
    store.recordDecline(USER_A, EXT_X, 'contacts:read');
    expect([...store.decidedScopes(USER_A, EXT_X)].sort()).toEqual([
      'contacts:read',
      'profile:read',
    ]);
  });

  describe('revoke', () => {
    // AC: revoke-takes-effect-immediately
    it('makes a granted scope not-granted immediately', () => {
      store.recordGrant(USER_A, EXT_X, 'contacts:read');
      store.revoke(USER_A, EXT_X, 'contacts:read');
      expect(store.isGranted(USER_A, EXT_X, 'contacts:read')).toBe(false);
      expect(store.listGranted(USER_A, EXT_X)).toEqual([]);
    });

    it('does not affect other granted scopes', () => {
      store.recordGrant(USER_A, EXT_X, 'contacts:read');
      store.recordGrant(USER_A, EXT_X, 'profile:read');
      store.revoke(USER_A, EXT_X, 'contacts:read');
      expect(store.isGranted(USER_A, EXT_X, 'profile:read')).toBe(true);
    });

    it('is a no-op for an extension with no record', () => {
      expect(() => store.revoke(USER_A, EXT_X, 'contacts:read')).not.toThrow();
      expect(store.isGranted(USER_A, EXT_X, 'contacts:read')).toBe(false);
    });

    it('revokeAll makes every granted scope not-granted', () => {
      store.recordGrant(USER_A, EXT_X, 'contacts:read');
      store.recordGrant(USER_A, EXT_X, 'profile:read');
      store.revokeAll(USER_A, EXT_X);
      expect(store.listGranted(USER_A, EXT_X)).toEqual([]);
    });
  });

  it('persists the latest decision when re-deciding a scope', () => {
    store.recordDecline(USER_A, EXT_X, 'profile:read');
    store.recordGrant(USER_A, EXT_X, 'profile:read');
    expect(store.isGranted(USER_A, EXT_X, 'profile:read')).toBe(true);
  });
});
