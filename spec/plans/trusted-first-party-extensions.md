---
format: https://specscore.md/plan-specification
status: Implemented
---

# Plan: Trusted First Party Extensions

**Status:** Implemented
**Source Feature:** trusted-first-party-extensions
**Date:** 2026-06-18
**Owner:** alex
**Supersedes:** —
**Parent:** platform
**Grade:** A

## Summary

This plan implements the **trusted** extension class on top of the Host & Bridge foundation (F1, `extension-host-and-bridge`): a statically-configured, code-reviewed trusted-origin allowlist distinct from F1's dynamic `frame-src` embed allowlist; an origin-verified, one-way client-side handoff of the signed-in user's own Firebase ID token to a trusted iframe over F1's already-established bridge; proactive token refresh before the ~1-hour expiry so a long-lived trusted extension keeps working without a reload; the bypass of the per-scope consent dialog and Protected-Data Gateway for trusted extensions; and a one-time full-account-access install disclosure shown in place of the per-scope consent dialog, where declining aborts the install and no token is ever handed off. All work lives in `libs/extensions-platform`. The token handoff is the only path by which any credential leaves the parent, and it targets only browser-verified trusted origins; every non-allowlisted origin remains untrusted and uses the consent-gated gateway.

## Approach

The decomposition is bottom-up over F1's foundation and deliberately avoids re-planning anything F1 owns. It assumes F1 is in place: F1 Task 1 provides the `ExtensionRegistry` (registration keyed by origin), F1 Task 4 the add-by-URL install/registration flow we hook into, F1 Task 6 the origin-verified `MessageChannel` handshake (`event.origin` equals the registered origin), and F1 Task 7 the versioned RPC envelope the token messages travel over. The per-scope consent dialog and grant store are owned by the Consent & Scopes Feature, the gateway by the Protected-Data Gateway Feature, and the trusted-extension display in the Permission UI by the Permission-Management-UI Feature (its Task 1/4 read the trusted allowlist this plan produces) — we reference those, not re-plan them.

We start with the static trusted-origin allowlist plus its eligibility predicate (pure config + data, depended on by everything else), then the token-handoff that gates on both the allowlist and F1's verified origin and never sends to anyone else, then refresh-before-expiry layered on the handoff, then the consent/gateway bypass that is a discriminator-driven branch in the install/data path, then the install-time full-access disclosure that replaces the consent dialog and aborts on decline (no handoff). Ordering follows data dependency: allowlist/eligibility → token handoff (origin-verified) → refresh → consent/gateway bypass → install disclosure (accept/decline).

## Tasks

### Task 1: Static trusted-origin allowlist and eligibility predicate

**Verifies:** trusted-first-party-extensions#ac:only-allowlisted-origin-eligible
**Depends-On:** —
**Status:** done

Add a statically-configured, code-reviewed trusted-origin allowlist (e.g. `https://listus.app`) to `libs/extensions-platform` as deployment/app config that is not user-editable and not mutated at runtime, distinct from F1's dynamic `frame-src` embed allowlist, plus an `isTrustedOrigin(origin)` predicate so an allowlisted origin is eligible for the token handoff and every other origin is not.

### Task 2: Origin-verified one-way token handoff over the bridge

**Verifies:** trusted-first-party-extensions#ac:trusted-receives-token-untrusted-does-not
**Verifies:** trusted-first-party-extensions#ac:token-only-to-verified-origin
**Depends-On:** 1
**Status:** done

After F1's origin-verified handshake (F1 Task 6) establishes the channel, hand the signed-in user's current Firebase ID token to the iframe over F1's RPC envelope (F1 Task 7) only when the browser-verified `event.origin` is on the trusted allowlist (Task 1); an untrusted/non-allowlisted verified origin receives no token and must use the gateway. Include tests asserting the trusted iframe receives the token, the untrusted one receives none, and a non-allowlisted verified origin is never targeted.

### Task 3: Token refresh before expiry

**Verifies:** trusted-first-party-extensions#ac:token-refreshed-before-expiry
**Depends-On:** 2
**Status:** done

For a long-lived trusted extension, schedule a refresh that obtains a fresh Firebase ID token (via the Firebase Auth SDK) before/at the ~1-hour expiry and pushes it over the bridge to the trusted iframe so it keeps working without a full reload; the refreshed token is sent only to the same already-verified trusted origin.

### Task 4: Trusted extensions bypass consent dialog and gateway

**Verifies:** trusted-first-party-extensions#ac:trusted-skips-consent-and-gateway
**Depends-On:** 1, 2
**Status:** done

Make the trusted allowlist (Task 1) the discriminator in the install/data path so a trusted extension shows no per-scope consent dialog (Consent & Scopes Feature) and makes no Protected-Data Gateway calls (Protected-Data Gateway Feature) — it uses the handed-off token directly; the scope catalog/grants/gateway apply only to untrusted extensions. This task owns the bypass enforcement point at handler-attachment time: for a trusted origin, the gateway request handler (protected-data-gateway Task 3) is not registered on that iframe's port; the token handoff (Task 2) is used instead. Add a test asserting no consent dialog and no gateway handler/call for a trusted extension.

**Depends-On (cross-plan):** protected-data-gateway Task 3 (the gateway request handler this branch chooses not to attach for trusted origins).

### Task 5: One-time full-access install disclosure with accept/decline gating

**Verifies:** trusted-first-party-extensions#ac:install-shows-full-access-disclosure
**Verifies:** trusted-first-party-extensions#ac:declined-disclosure-aborts-install
**Depends-On:** 1, 2, 4
**Status:** done

This task owns the install-time trusted/untrusted fork inserted into F1 Task 4's add-by-URL flow: after F1 Task 3's manifest validation succeeds and before F1 Task 4 records the extension and appends its origin to the `frame-src` allowlist, branch on `isTrustedOrigin(origin)` (Task 1). For a trusted origin, show a one-time disclosure stating it is a trusted first-party Sneat extension with full account access in place of the per-scope consent dialog; the extension is registered (F1 Task 4's record + allowlist step proceeds) only if the user accepts, and on decline the install aborts with nothing recorded, nothing allowlisted, and no token ever handed off (Task 2). For an untrusted origin, fall through to the Consent plan's untrusted install flow (extension-consent-and-scopes Task 5) — this plan does not show the per-scope dialog. Include tests for the trusted accept (installed) and trusted decline (not installed, no handoff) paths, and a test asserting an untrusted origin is routed to the consent path and not shown the disclosure.

**Depends-On (cross-plan):** extension-consent-and-scopes Task 5 (the untrusted per-scope install path this fork routes non-trusted origins to).

## Open Questions

None at this time.

---

_This document follows the https://specscore.md/plan-specification_
