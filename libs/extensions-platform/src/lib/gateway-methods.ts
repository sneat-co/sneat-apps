import { ScopeId } from './scope-catalog';

/**
 * The fixed, read-only method whitelist of the Protected-Data Gateway, the
 * method↔scope map, and the explicit per-method response DTO shapes.
 *
 * This registry is the single source of truth every other gateway task
 * references. It contains exactly four methods and NO create/update/delete
 * entry, which is what makes the gateway a read-only, no-mutation surface.
 *
 * specscore: https://specscore.md/features/protected-data-gateway
 * Verifies: protected-data-gateway#ac:whitelisted-methods-mapped-to-scopes
 * Verifies: protected-data-gateway#ac:no-mutation-surface
 */

/** The four whitelisted, read-only gateway method names. */
export type GatewayMethodName =
  | 'profile.get'
  | 'contactDetails.get'
  | 'contacts.pick'
  | 'contacts.list';

/**
 * How a method is gated:
 * - `scope`: requires the named scope, checked against the consent store;
 * - `user-mediated`: requires no scope because the user explicitly selects the
 *   single item returned.
 */
export type GatewayMethodGate =
  | { readonly kind: 'scope'; readonly scope: ScopeId }
  | { readonly kind: 'user-mediated' };

/** A single whitelist entry. Every entry is read-only. */
export interface GatewayMethodSpec {
  readonly name: GatewayMethodName;
  readonly gate: GatewayMethodGate;
  /**
   * An optional second scope that field-gates extra fields of the response.
   * Only `contacts.list` uses it (`contacts_details:read`).
   */
  readonly fieldGateScope?: ScopeId;
  /** MVP gateway methods are read-only; always `true`. */
  readonly readOnly: true;
}

/**
 * The immutable method registry. Exactly the four MVP methods, in a stable
 * order. No create/update/delete method exists here — there is no write surface.
 */
export const GATEWAY_METHODS: readonly GatewayMethodSpec[] = [
  {
    name: 'profile.get',
    gate: { kind: 'scope', scope: 'profile:read' },
    readOnly: true,
  },
  {
    name: 'contactDetails.get',
    gate: { kind: 'scope', scope: 'contact_details:read' },
    readOnly: true,
  },
  {
    name: 'contacts.pick',
    gate: { kind: 'user-mediated' },
    readOnly: true,
  },
  {
    name: 'contacts.list',
    gate: { kind: 'scope', scope: 'contacts:read' },
    fieldGateScope: 'contacts_details:read',
    readOnly: true,
  },
] as const;

const BY_NAME: ReadonlyMap<string, GatewayMethodSpec> = new Map(
  GATEWAY_METHODS.map((m) => [m.name, m]),
);

/** True when `method` is a whitelisted gateway method. */
export function isGatewayMethod(method: string): method is GatewayMethodName {
  return BY_NAME.has(method);
}

/** Look up a method spec, or `undefined` when the method is not whitelisted. */
export function getGatewayMethod(
  method: string,
): GatewayMethodSpec | undefined {
  return BY_NAME.get(method);
}

/**
 * The scope required to call `method`, or `undefined` when the method is
 * user-mediated (no scope) or not whitelisted.
 */
export function requiredScopeFor(method: string): ScopeId | undefined {
  const spec = BY_NAME.get(method);
  return spec?.gate.kind === 'scope' ? spec.gate.scope : undefined;
}

// --- Response DTO shapes -------------------------------------------------

/** `profile.get` response: only scope-covered profile fields. */
export interface ProfileDto {
  readonly name: string;
  readonly gender?: string;
}

/** `contactDetails.get` response: the user's OWN contact details. */
export interface ContactDetailsDto {
  readonly email?: string;
  readonly phone?: string;
}

/** The basic contact fields exposed by every contacts method. */
export interface BasicContactDto {
  readonly id: string;
  readonly names: string;
  readonly roles: readonly string[];
}

/**
 * A contact in `contacts.list` with optional detail fields, present only when
 * `contacts_details:read` is granted.
 */
export interface ContactWithDetailsDto extends BasicContactDto {
  readonly email?: string;
  readonly phone?: string;
}
