import { InjectionToken } from '@angular/core';

// Per-environment slug of the Sneat GitHub App, used to build the install URL
// `https://github.com/apps/<slug>/installations/new` shown on the OVDB data
// storage settings page. Kept out of the component (not hardcoded) so each
// deployment can point at its own App — this mirrors the EnvConfigToken /
// FirebaseConfigToken InjectionToken pattern in @sneat/core. Override it by
// providing OVDB_GITHUB_APP_SLUG at an app composition root.
//
// TODO: the Sneat GitHub App is NOT registered yet (see
// backstage/docs/roadmaps/ovdb-access-tokens-grants.md, Decision 1 — register
// `sneat-dev` + `sneat` prod Apps). Replace the placeholder default below with
// the real dev/prod slugs once those Apps exist.
export const OVDB_GITHUB_APP_SLUG = new InjectionToken<string>(
  'OvdbGithubAppSlug',
  {
    providedIn: 'root',
    factory: () => 'sneat-dev',
  },
);
