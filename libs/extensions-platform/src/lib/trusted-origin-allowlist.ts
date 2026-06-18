import { Provider } from '@angular/core';
import { IS_TRUSTED_ORIGIN, IsTrustedOrigin } from './is-trusted-origin';

/**
 * The statically-configured, code-reviewed allowlist of trusted first-party
 * origins. Membership designates an extension as a TRUSTED first-party Sneat
 * extension: it receives the user's own Firebase ID token (Token Handoff) and
 * bypasses the per-scope consent dialog and Protected-Data Gateway.
 *
 * This is part of code-reviewed app/deployment configuration: it is NOT
 * user-editable and is NEVER mutated at runtime (hence `as const` / frozen).
 * It is deliberately DISTINCT from the dynamic `frame-src` embed allowlist
 * (Host & Bridge): being embeddable does not imply being trusted.
 *
 * Entries are full `https` origins (scheme + host[:port]), exactly as the
 * browser reports them in `event.origin`.
 *
 * specscore: https://specscore.md/features/trusted-first-party-extensions
 * Verifies: trusted-first-party-extensions#ac:only-allowlisted-origin-eligible
 */
export const TRUSTED_ORIGIN_ALLOWLIST: readonly string[] = Object.freeze([
  'https://listus.app',
]);

/**
 * The eligibility predicate: true ONLY when `origin` is an exact member of the
 * trusted-origin allowlist. Every other origin is untrusted and is NOT eligible
 * for the token handoff. The comparison is exact (no prefix/subdomain match) so
 * a non-allowlisted origin can never be mistaken for a trusted one.
 *
 * @param origin The extension's full `https` origin (scheme + host[:port]).
 */
export function isTrustedOrigin(origin: string): boolean {
  return TRUSTED_ORIGIN_ALLOWLIST.includes(origin);
}

/**
 * Binds {@link IS_TRUSTED_ORIGIN} to the real allowlist-backed predicate,
 * overriding F4's safe `() => false` default. With this provider in place the
 * Permission-Management UI's full-access badge lights up for trusted origins,
 * and the install fork / token handoff / gateway bypass all key off the same
 * allowlist.
 */
export function provideTrustedOrigins(): Provider {
  return {
    provide: IS_TRUSTED_ORIGIN,
    useValue: isTrustedOrigin satisfies IsTrustedOrigin,
  };
}
