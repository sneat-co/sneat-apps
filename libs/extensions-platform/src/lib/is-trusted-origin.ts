import { InjectionToken } from '@angular/core';

/**
 * Predicate deciding whether an extension origin is a trusted first-party
 * origin. A trusted extension holds the user's token for full account access
 * and therefore has no per-scope grants; the Permission-Management UI uses this
 * predicate as the discriminator between the trusted full-access badge and the
 * per-scope list.
 *
 * The real allowlist-backed binding is owned by the Trusted First-Party
 * Extensions Feature (F5) and is provided at integration. Until then the safe
 * default below treats every origin as untrusted, so the UI is fully functional
 * (it always renders the per-scope list).
 *
 * @param origin The extension's full `https` origin (scheme + host[:port]).
 */
export type IsTrustedOrigin = (origin: string) => boolean;

/**
 * DI token for {@link IsTrustedOrigin}, following the `CONSENT_PERSISTENCE` /
 * `GATEWAY_DATA_SOURCE` token pattern. Default binding returns `false` for every
 * origin (untrusted). F5 overrides this with the static trusted-origin allowlist.
 */
export const IS_TRUSTED_ORIGIN = new InjectionToken<IsTrustedOrigin>(
  'IS_TRUSTED_ORIGIN',
  {
    providedIn: 'root',
    factory: (): IsTrustedOrigin => () => false,
  },
);
