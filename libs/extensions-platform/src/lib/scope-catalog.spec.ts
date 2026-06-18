import { describe, it, expect } from 'vitest';
import {
  SCOPE_CATALOG,
  ScopeId,
  filterCatalogScopes,
  getScopeDescriptor,
  isCatalogScope,
} from './scope-catalog';

describe('SCOPE_CATALOG', () => {
  // AC: catalog-defines-mvp-scopes
  it('exposes exactly the four MVP read scopes, each read-only with a label and description', () => {
    expect(SCOPE_CATALOG.map((s) => s.id)).toEqual([
      'profile:read',
      'contact_details:read',
      'contacts:read',
      'contacts_details:read',
    ]);
    for (const s of SCOPE_CATALOG) {
      expect(s.label.length).toBeGreaterThan(0);
      expect(s.description.length).toBeGreaterThan(0);
      expect(s.readOnly).toBe(true);
    }
  });

  it('gives the own-details and contacts-details scopes distinct labels', () => {
    const own = getScopeDescriptor('contact_details:read');
    const contacts = getScopeDescriptor('contacts_details:read');
    expect(own?.label).not.toEqual(contacts?.label);
  });
});

describe('isCatalogScope / getScopeDescriptor', () => {
  it('recognises known scopes', () => {
    expect(isCatalogScope('contacts:read')).toBe(true);
    expect(getScopeDescriptor('contacts:read')?.id).toBe('contacts:read');
  });

  it('rejects unknown scopes', () => {
    expect(isCatalogScope('files:write')).toBe(false);
    expect(isCatalogScope('')).toBe(false);
    expect(getScopeDescriptor('files:write')).toBeUndefined();
  });
});

describe('filterCatalogScopes', () => {
  // AC: unknown-scope-rejected
  it('keeps only catalog members and drops unknown scopes', () => {
    const kept = filterCatalogScopes([
      'profile:read',
      'files:write',
      'contacts:read',
    ]);
    expect(kept.map((s) => s.id)).toEqual(['profile:read', 'contacts:read']);
  });

  it('returns scopes in catalog order regardless of request order', () => {
    const kept = filterCatalogScopes(['contacts:read', 'profile:read']);
    expect(kept.map((s) => s.id)).toEqual(['profile:read', 'contacts:read']);
  });

  it('de-duplicates repeated requested scopes', () => {
    const kept = filterCatalogScopes([
      'profile:read',
      'profile:read',
    ] as ScopeId[]);
    expect(kept.map((s) => s.id)).toEqual(['profile:read']);
  });

  it('returns nothing for an all-unknown request', () => {
    expect(filterCatalogScopes(['nope', 'also:nope'])).toEqual([]);
  });
});
