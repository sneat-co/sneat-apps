# Single Shared Identity — Addendum to the Consumer/Work App Split

**Date:** 2026-06-09
**Status:** Decided (supersedes parts of the 2026-04-08 split design)
**Supersedes:** `docs/superpowers/specs/2026-04-08-consumer-and-work-app-split-design.md` — specifically the §Non-goals decision (line ~21) that consumer (`sneat.app`) and business (`sneat.work`) would live in **separate Firebase projects with no shared SSO**, and the two-project architecture that followed from it.
**Author:** Alexander Trakhimenok

## Context

The 2026-04-08 design split identity along consumer-vs-business lines: `sneat-eur3-1` for `sneat.app`, a separate `sneat-work` project for the B2B side (shared by `sneat-work` + `issue-number-one`).

**The plan was essentially fully executed** (it was not theoretical, contrary to first recollection). Audit on 2026-06-09:

- **Phase A — done:** `@sneat/app` dropped `firebaseConfigForSneatApp`/`prodEnvironmentConfig`, renamed `baseEnvironmentConfig` → `emulatorEnvironmentConfig`, and published `0.4.0`.
- **Phase B — done:** `apps/sneat-app` inlines the `sneat-eur3-1` config and consumes `@sneat/app@0.4.0`.
- **Phase C — done:** `apps/sneat-work` scaffolded and committed (commit `8da884120`), env files pointing at `projectId: 'sneat-work'`.
- **Phase D — done:** `issue-number-one` wired to `@sneat/*@0.4.0`, env files pointing at `projectId: 'sneat-work'`.
- **Phase E — partial:** `sneat-sites/websites/sneat.work/` landing page exists; `.firebaserc`/`firebase.json` have a `sneat-work` hosting target.

**No Firebase project has any users yet**, so consolidation is still essentially free — it requires repointing existing code, not migrating users.

Picking the work back up (now with `datatag.app`/`datatag.io` as the flagship focus, alongside `sneat.work` as a team-management umbrella and pluggable small apps like `issue-number-one`) surfaced two facts that reverse the split:

1. **Solo operator.** Every additional Firebase project is a permanent, recurring tax paid by one person: GitHub/Google/Microsoft OAuth apps registered and maintained per project, duplicated authorized-domains lists, security rules, provider config, key rotation, and monitoring. Multi-project doubles (or triples) ongoing ops for zero current benefit.
2. **Audience overlap is unknown.** Whether the same humans use consumer and business products can't be predicted yet. Under that uncertainty the regret is asymmetric: **merging two identity pools later is a migration nightmare** (overlapping emails, account-linking, dedup); **splitting later is additive** (add a GCIP tenant for a specific enterprise customer, existing users untouched).

With zero users today, consolidation is nearly free. It only gets more expensive.

## Decision

**One Firebase project — `sneat-eur3-1` — is the single Sneat identity pool for every product** (consumer and business): `sneat.app`, `datatag.app`/`datatag.io`, `sneat.work`, `issue-number-one`, and future apps.

- **Why `sneat-eur3-1`:** it already has the most auth setup (OAuth providers wired against `sneat.app/__/auth/handler`), its brand _is_ "Sneat", and `eur3` is a safe EU data-residency default. Reusing it means **no OAuth re-registration**.
- **One set of OAuth registrations**, branded "Sneat." Adding a new product = adding its domain to the project's Authorized domains. Near-zero marginal ops per product.
- **Consumer vs business is a data concern, not infrastructure** — modeled as org/team membership and/or a custom claim, which the `sneat.work` umbrella app must manage anyway. Not separate projects.
- **Auth method: `signInWithPopup`.** Avoids the cross-domain third-party-cookie problem (app domain ≠ `authDomain`) with zero extra infrastructure. Self-hosted auth handlers and per-product custom auth domains are deferred until there's a concrete reason.
- **Brand vs identity vs tenancy are distinct layers.** Login brand can be themed per product ("Sneat Work" on business surfaces) while the underlying account is one Sneat account. The OAuth consent screen shows "Sneat" / `sneat.app` for all products — on-brand, not confusing.

## Consequences

**Obsoleted by this decision:**

- The greenfield **`sneat-work` Firebase project** — abandon it (no users).
- The **hardcoded `sneat-work` Firebase keys** in the 2026-04-08 plan (tasks C8, D3) — do not use.
- The **`@sneat/app` library refactor** (Apr-08 Phase A) is **already done and shipped in `0.4.0` — keep it.** It is fully compatible with single-identity: every app declares its own config, and they will all simply declare the _same_ `sneat-eur3-1` config. Nothing to revert.

**Already-built code to reconcile (not greenfield) — repoint the dead `sneat-work` auth project to `sneat-eur3-1`:**

- `apps/sneat-work/src/environments/environment.ts` + `environment.prod.ts` — change `firebaseConfig` from `projectId: 'sneat-work'` to the shared `sneat-eur3-1` config. **Keep the app.**
- `issue-number-one/src/environments/environment.ts` + `environment.prod.ts` — same repoint to `sneat-eur3-1`.
- `sneat-sites/.firebaserc` + `firebase.json` carry a `sneat-work` **hosting** target. Hosting is orthogonal to auth — the sneat.work site can stay where it deploys and still authenticate against `sneat-eur3-1` via the app's `firebaseConfig`. Only revisit this if fully decommissioning the `sneat-work` Firebase project (then move the hosting site under `sneat-eur3-1`).

**Required config (one-time):**

- Add `datatag.app`, `datatag.io`, `sneat.work`, the `issue-number-one` domain, and `localhost` to `sneat-eur3-1`'s **Authorized domains**.
- Each product's `firebaseConfig` points at `sneat-eur3-1`.
- If Telegram (or any consumer-only provider) is enabled on `sneat-eur3-1`, hide it in business UI as desired.

**Tradeoffs accepted:**

- **Bigger blast radius** — one pool for everything. Acceptable pre-scale; revisit with GCIP if/when it isn't.
- **No hard consumer/business firewall at the credential layer.** This was the one remaining legitimate reason to split (a structural guarantee that the same provider-account can never be the same user across consumer and business). It was **considered and consciously declined** — there is no current regulatory or product need for it, and the platform vision prefers shared identity. Revisit only if a hard data-firewall requirement appears.
- **Consent screen shows one brand** ("Sneat") for all products — by design.

## Session & SSO model — why one project is safe

The concern that originally motivated the split was: _"if everything shares one project, won't I be unable to hold a work session and a personal session at the same time?"_ This is a misconception. **Firebase web sessions are isolated by browser _origin_ (the website domain), not by Firebase project.** Auth state lives in IndexedDB, which the browser scopes strictly per-origin (and even per-subdomain — subdomains do not share IndexedDB). So every product domain keeps its own independent session regardless of what's behind it.

### Worked example

Setup: one Firebase project (`sneat-eur3-1`) behind all products. The user has a personal identity `alex@trakhimenok.com` and a work identity `alex@acme.com` (different emails → distinct user records even within one project).

1. **Log into `sneat.app` as `alex@trakhimenok.com` AND `sneat.work` as `alex@acme.com`, same browser, simultaneously?**
   ✅ **Works.** `sneat.app` and `sneat.work` are different origins → independent IndexedDB stores → independent logins. Two tabs, two accounts, no conflict. The shared project does not change this — the _origin_ is what isolates sessions.

2. **Go to `issue-number.one` and sign in — which identity?**
   `issue-number.one` is its own origin with an empty session store. It does **not** inherit the work or personal session (cross-origin sessions don't bleed). The user signs in fresh, and whichever account they pick at the OAuth provider's account chooser becomes the identity — mapped to the _same UID_ it holds everywhere else in the shared project.

|                               | sneat.app(personal) + sneat.work(work) at once? | issue-number.one auto-knows the work user? |
| ----------------------------- | ----------------------------------------------- | ------------------------------------------ |
| **One project (chosen)**      | ✅ yes (origin-isolated)                        | ❌ no — fresh login (cross-origin)         |
| **Split projects (rejected)** | ✅ yes (origin-isolated)                        | ❌ no — fresh login                        |

**The project boundary changes neither row.** Splitting would have bought nothing for these scenarios while doubling ops. What the project boundary _actually_ controls is only whether the same provider-account is the **same UID across products** — which the platform vision (teams, permissions, pluggable apps) wants to be _yes_, i.e. one project.

### Consequences for the pluggable model

True SSO ("already logged in when I arrive at another product") is a **separate feature built on top** — it does not come free from sharing a project, because products on different registrable domains can't share browser storage. A pluggable app inherits the work identity automatically only when it is served from the **same origin** as `sneat.work` (a module/route under `sneat.work`); a separate standalone origin (`issue-number.one`) needs its own login or explicit token-passing. So the "pluggable, already-work-authed" experience is an **integration choice (same-origin vs federated), not a Firebase-project choice.**

### Auth method confirmation

`signInWithPopup` keeps this model clean: the resulting credential is written to the **calling origin's** storage, with no reliance on cross-origin third-party state (which browsers are deprecating). Confirms the addendum's earlier `signInWithPopup` decision.

## Escape hatch (no lock-in)

When a real enterprise customer demands enforced corporate SSO (SAML/OIDC), add a **GCIP tenant inside the same `sneat-eur3-1` project** — additive, existing users untouched, no migration. Collapsing to one pool now forecloses nothing here.

## Open items

- Exact model for the consumer-vs-business distinction in data (org membership vs custom claim vs both) — to be designed when the `sneat.work` umbrella's team/permission layer is specified.
- Whether to add a neutral platform auth domain (e.g. `id.sneat.app`) later for branding polish — deferred; not needed for `signInWithPopup`.
