---
format: https://specscore.md/feature-specification
status: Approved
---

# Feature: Trusted First-Party Extensions

> [SpecScore.**Studio**](https://specscore.studio): | [Explore](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/trusted-first-party-extensions?op=explore) | [Edit](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/trusted-first-party-extensions?op=edit) | [Ask question](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/trusted-first-party-extensions?op=ask) | [Request change](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/trusted-first-party-extensions?op=request-change) |
**Status:** Approved
**Source Ideas:** third-party-extension-platform
**Grade:** B

## Summary

A statically-configured trusted-origin allowlist that designates first-party extensions (e.g. listus.app) as trusted: the parent hands the user's own Firebase ID token to a verified trusted iframe over the bridge (with refresh before expiry) so it uses Firestore + the Sneat API directly, bypassing the per-scope consent dialog and gateway. Untrusted origins never receive a token. Installing a trusted extension shows a one-time full-account-access disclosure.

## Problem

Some extensions are Sneat's own (e.g. `listus`, decoupled to `listus.app`): they are first-party code Sneat owns and ships, and forcing them through the untrusted read-only gateway would cripple a real product that needs full Firestore + Sneat-API access. This Feature defines the **trusted** class: a statically-configured allowlist of first-party origins whose iframes receive the user's own Firebase ID token via a client-side handoff and use Sneat directly — the same trust level as today's statically-linked extensions, simply running in an iframe from their own origin. This is the only path by which any credential leaves the parent; every origin not on the allowlist remains untrusted and uses the consent-gated gateway. It rides on the Host & Bridge Feature for embedding, origin verification, and the bridge transport.

## Behavior

### Trusted-Origin Allowlist

#### REQ: trusted-origin-allowlist

Sneat maintains a statically-configured allowlist of trusted first-party origins (e.g. `https://listus.app`). The allowlist is part of code-reviewed app/deployment configuration — it is NOT user-editable and NOT mutated at runtime. Only an origin on this allowlist is eligible for the token handoff below; every other origin is untrusted. This trusted allowlist is distinct from the dynamic `frame-src` embed allowlist (Host & Bridge Feature): being embeddable does not imply being trusted.

### Token Handoff

#### REQ: token-handoff

For an extension whose origin is on the trusted allowlist, the parent hands the user's current Firebase ID token to the iframe over the bridge. The trusted extension uses that token to call Firestore and the Sneat API directly. An extension whose origin is not on the trusted allowlist NEVER receives a token and must use the protected-data gateway (Protected-Data Gateway Feature).

#### REQ: origin-verified-handoff

The token is sent ONLY to an iframe whose browser-verified `event.origin` matches a trusted-allowlist entry, and only after the Host & Bridge origin-verified handshake (REQ: bridge-handshake) has established the channel. The handoff never targets any other origin. (Because the token is always the signed-in user's own, even a locally-spoofed trusted origin would only ever yield the spoofer their own token — no cross-user escalation; see the source Idea.)

#### REQ: token-refresh

Firebase ID tokens expire (~1 hour). For a long-lived trusted extension, the parent supplies a refreshed token over the bridge before/at expiry so the extension keeps working without a full reload.

### No Consent Gateway for Trusted

#### REQ: trusted-bypasses-consent-gateway

A trusted extension does not use the per-scope consent dialog or the protected-data gateway: it has full access via the token. The scope catalog, grants, and gateway (Consent & Scopes / Protected-Data Gateway Features) apply only to untrusted extensions.

### Install Disclosure

#### REQ: full-access-disclosure

When the user installs a trusted extension, the platform shows a one-time, clear disclosure that it is a trusted first-party Sneat extension with full account access — shown instead of the per-scope consent dialog. The extension is installed only if the user accepts. (Install-time UX ownership is split by class: the Consent & Scopes Feature owns the per-scope consent dialog for untrusted extensions; this Feature owns the full-access disclosure for trusted ones.)

## Dependencies

- extension-host-and-bridge

## Acceptance Criteria

### AC: only-allowlisted-origin-eligible

Scenario: Only a trusted-allowlist origin is eligible for a token
Given the trusted-origin allowlist contains `https://listus.app`
When eligibility is evaluated for `https://listus.app` and for some other origin `https://acme.example`
Then `https://listus.app` is eligible for the token handoff and `https://acme.example` is not.
Verifies REQ: trusted-origin-allowlist

### AC: trusted-receives-token-untrusted-does-not

Scenario: Token goes to trusted, never to untrusted
Given a trusted extension and an untrusted extension both loaded
When each is initialized
Then the trusted extension receives the user's Firebase ID token over the bridge and the untrusted extension receives no token (and must use the gateway).
Verifies REQ: token-handoff

### AC: token-only-to-verified-origin

Scenario: A non-trusted verified origin never gets the token
Given an iframe whose browser-verified `event.origin` is not on the trusted allowlist
When the parent decides whether to hand off the token
Then no token is sent to that iframe.
Verifies REQ: origin-verified-handoff

### AC: token-refreshed-before-expiry

Scenario: A long-lived trusted extension gets a refreshed token
Given a trusted extension running past the ~1-hour token lifetime
When the current token nears or reaches expiry
Then the parent supplies a refreshed token over the bridge and the extension continues without a full reload.
Verifies REQ: token-refresh

### AC: trusted-skips-consent-and-gateway

Scenario: Trusted extensions bypass consent and the gateway
Given a trusted extension
When it is installed and accesses data
Then no per-scope consent dialog is shown for it and it does not call the protected-data gateway; it uses the token directly.
Verifies REQ: trusted-bypasses-consent-gateway

### AC: install-shows-full-access-disclosure

Scenario: Installing a trusted extension shows the full-access disclosure
Given a trusted extension being installed
When the install flow runs
Then a one-time disclosure stating it is a trusted first-party extension with full account access is shown instead of the per-scope consent dialog, and the extension is installed only if the user accepts.
Verifies REQ: full-access-disclosure

### AC: declined-disclosure-aborts-install

Scenario: Declining the full-access disclosure aborts the install
Given a trusted extension being installed and its full-access disclosure shown
When the user declines the disclosure
Then the extension is not installed and no token is ever handed to it.
Verifies REQ: full-access-disclosure

## Open Questions

- **Token credential (decided):** trusted extensions receive the full Firebase ID token, refreshed before expiry, matching today's first-party trust. A narrower/shorter-lived token even for first-party is a post-MVP option, not MVP.
- **Management in the Permission UI (decided):** trusted extensions appear in the Permission Management UI with a "Trusted — full account access" indicator (no scope list) and a Remove action that deregisters them (stopping the token handoff); see that Feature's `trusted-extension-display`.
- **Allowlist management (decided for MVP):** static, code-reviewed config. A Firestore-backed config or an admin UI for editing trusted origins at runtime is deferred.
- **Compromised first-party origin:** the residual risk is a genuinely compromised trusted origin (e.g. XSS on `listus.app`) leaking tokens; mitigated by treating allowlisted origins as code Sneat owns and controls. Hardening (e.g. App Check, CSP on the trusted origin) is a post-MVP consideration.
- **Rehearse stubs:** all seven ACs are testable (allowlist eligibility, token-handoff presence/absence, origin-verified gating, refresh, consent/gateway bypass, and the install disclosure accept/decline paths); `_tests/` stubs are deferred to the Plan.

---

_This document follows the https://specscore.md/feature-specification_
