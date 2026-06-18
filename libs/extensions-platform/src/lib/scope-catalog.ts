/**
 * The fixed catalog of read-only scopes an untrusted extension may request,
 * and the semantic catalog-membership filter applied at consent/enforcement time.
 *
 * This is distinct from the Host & Bridge Feature's STRUCTURAL manifest
 * validation (fetch/parse/field types/`scopes` is an array of strings). The
 * registry records the raw requested scopes unfiltered; this catalog decides
 * which of them are real, known scopes that may be offered for consent.
 *
 * specscore: https://specscore.md/features/extension-consent-and-scopes
 * Verifies: extension-consent-and-scopes#ac:catalog-defines-mvp-scopes
 * Verifies: extension-consent-and-scopes#ac:unknown-scope-rejected
 */

/** The four MVP scope ids. All are read-only. */
export type ScopeId =
  | 'profile:read'
  | 'contact_details:read'
  | 'contacts:read'
  | 'contacts_details:read';

/** A catalog entry describing a single supported scope. */
export interface ScopeDescriptor {
  /** Stable scope id, e.g. `profile:read`. */
  readonly id: ScopeId;
  /** Distinct human-readable label shown in the consent dialog. */
  readonly label: string;
  /** Longer description shown in the consent dialog. */
  readonly description: string;
  /** MVP scopes are read-only; always `true`. */
  readonly readOnly: true;
}

/**
 * The immutable MVP scope catalog: exactly the four read-only scopes, in a
 * stable order. `contact_details:read` (the user's OWN details) and
 * `contacts_details:read` (the details OF the user's contacts) are deliberately
 * distinct scopes with labels that make the difference explicit.
 */
export const SCOPE_CATALOG: readonly ScopeDescriptor[] = [
  {
    id: 'profile:read',
    label: 'Your profile',
    description: 'Your profile (name, gender, …).',
    readOnly: true,
  },
  {
    id: 'contact_details:read',
    label: 'Your contact details',
    description: 'Your own contact details (email, phone, …).',
    readOnly: true,
  },
  {
    id: 'contacts:read',
    label: 'Your contacts',
    description:
      'Enumerate your contacts as basic fields (id, names, roles); no per-contact email or phone.',
    readOnly: true,
  },
  {
    id: 'contacts_details:read',
    label: "Your contacts' contact details",
    description: 'The contact details (email, phone, …) of your contacts.',
    readOnly: true,
  },
] as const;

const BY_ID: ReadonlyMap<string, ScopeDescriptor> = new Map(
  SCOPE_CATALOG.map((s) => [s.id, s]),
);

/** True when `scopeId` is a member of the catalog. */
export function isCatalogScope(scopeId: string): scopeId is ScopeId {
  return BY_ID.has(scopeId);
}

/** Look up a catalog entry by id, or `undefined` when the scope is unknown. */
export function getScopeDescriptor(
  scopeId: string,
): ScopeDescriptor | undefined {
  return BY_ID.get(scopeId);
}

/**
 * The semantic catalog-membership filter: from an extension's raw requested
 * scopes (recorded structurally by the registry), keep only catalog members, in
 * catalog order, de-duplicated. A scope absent from the catalog is dropped — it
 * is never offered for consent and never treated as granted.
 */
export function filterCatalogScopes(
  requested: readonly string[],
): ScopeDescriptor[] {
  const requestedSet = new Set(requested);
  return SCOPE_CATALOG.filter((s) => requestedSet.has(s.id));
}
