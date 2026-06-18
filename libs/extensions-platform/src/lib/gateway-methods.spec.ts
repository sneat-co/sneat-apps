import { describe, it, expect } from 'vitest';
import {
  GATEWAY_METHODS,
  getGatewayMethod,
  isGatewayMethod,
  requiredScopeFor,
} from './gateway-methods';

/**
 * specscore: https://specscore.md/features/protected-data-gateway
 * Verifies: protected-data-gateway#ac:whitelisted-methods-mapped-to-scopes
 * Verifies: protected-data-gateway#ac:no-mutation-surface
 */
describe('Gateway method whitelist and scope map', () => {
  it('contains exactly the four MVP methods in order', () => {
    expect(GATEWAY_METHODS.map((m) => m.name)).toEqual([
      'profile.get',
      'contactDetails.get',
      'contacts.pick',
      'contacts.list',
    ]);
  });

  it('maps profile.get to profile:read', () => {
    expect(requiredScopeFor('profile.get')).toBe('profile:read');
  });

  it('maps contactDetails.get to contact_details:read', () => {
    expect(requiredScopeFor('contactDetails.get')).toBe('contact_details:read');
  });

  it('maps contacts.list to contacts:read with contacts_details:read field-gating', () => {
    expect(requiredScopeFor('contacts.list')).toBe('contacts:read');
    expect(getGatewayMethod('contacts.list')?.fieldGateScope).toBe(
      'contacts_details:read',
    );
  });

  it('marks contacts.pick as user-mediated requiring no scope', () => {
    expect(getGatewayMethod('contacts.pick')?.gate).toEqual({
      kind: 'user-mediated',
    });
    expect(requiredScopeFor('contacts.pick')).toBeUndefined();
  });

  it('every method is read-only', () => {
    for (const m of GATEWAY_METHODS) {
      expect(m.readOnly).toBe(true);
    }
  });

  it('exposes no create/update/delete method (no mutation surface)', () => {
    const names = GATEWAY_METHODS.map((m) => m.name);
    for (const name of names) {
      expect(name).not.toMatch(/\.(create|add|set|update|put|delete|remove)$/);
    }
    // Nothing outside the four whitelisted reads is a known method.
    for (const forbidden of [
      'profile.set',
      'contacts.create',
      'contacts.delete',
      'contactDetails.update',
    ]) {
      expect(isGatewayMethod(forbidden)).toBe(false);
    }
  });

  it('rejects unknown method names', () => {
    expect(isGatewayMethod('anything.else')).toBe(false);
    expect(getGatewayMethod('anything.else')).toBeUndefined();
    expect(requiredScopeFor('anything.else')).toBeUndefined();
  });
});
