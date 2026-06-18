---
format: https://specscore.md/feature-specification
status: Approved
---

# Feature: Extension Consent & Scopes

> [SpecScore.**Studio**](https://specscore.studio): | [Explore](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-consent-and-scopes?op=explore) | [Edit](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-consent-and-scopes?op=edit) | [Ask question](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-consent-and-scopes?op=ask) | [Request change](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-consent-and-scopes?op=request-change) |
**Status:** Approved
**Source Ideas:** third-party-extension-platform
**Grade:** A

## Summary

Per-scope consent model for extensions: a catalog of read-only scopes, a granular Facebook-style consent dialog that shows the extension origin and lets the user grant or decline each requested scope individually, per-(user,extension,scope) grant storage with immediate revoke, and incremental re-consent when an installed extension later requests new scopes. The grant store is the authoritative source the protected-data gateway consults.

## Problem

An untrusted extension must never read the user's Sneat data without explicit, informed permission. The platform needs a permission model — a catalog of what can be requested, a consent moment where the user sees exactly which extension (and origin) is asking for what, granular control to grant some scopes and decline others, immediate revocation, and a single authoritative record of what is currently granted. This Feature owns that model. It rides on the Host & Bridge Feature (which loads the extension and reads its `sneat-extension.json` requested scopes) and is consulted by the Protected-Data Gateway Feature (which enforces it on every data read). Per the source Idea, MVP scopes are read-only; this Feature does not read or return any protected data itself — it only records and exposes consent decisions.

## Behavior

### Scope Catalog

#### REQ: scope-catalog

The platform defines a fixed catalog of supported read-only scopes, each with a stable id, a human-readable label, and a description shown in the consent dialog. The MVP catalog is exactly: `profile:read` (the user's profile — name, gender, …), `contact_details:read` (the user's own contact details — email, phone, …), and `contacts:read` (the user's contacts). A scope requested in a manifest that is not in the catalog is rejected: it is never offered for consent and never treated as granted.

This is the *semantic* (catalog-membership) check, applied at consent/enforcement time. *Structural* manifest validation — fetch, parseability, field types, and that `scopes` is an array of strings — is owned by the Host & Bridge Feature at registration; the Host & Bridge Feature records the raw requested scopes without filtering them, and this catalog filters them here when consent is sought.

### Granular Consent

#### REQ: consent-dialog-granular

When an extension is being installed, the host presents a consent dialog that prominently displays the extension's identity and origin and lists each catalog scope the extension requests (from its manifest) with that scope's label and description. The user decides each requested scope independently — granting some and declining others is allowed. The dialog returns the per-scope decisions; nothing is granted implicitly.

### Grant Storage

#### REQ: grant-storage

Consent decisions are persisted per `(user, extension, scope)`. A granted scope is recorded as granted for that user+extension; a declined scope is not recorded as granted (it is either absent or recorded as declined). Grants for one extension never apply to another, and grants for one user never apply to another.

### Revocation

#### REQ: revoke-immediate

The user can revoke any previously granted scope for an extension (individually, or all scopes of an extension at once). Revocation takes effect immediately: once revoked, the scope is treated as not-granted, so any subsequent data read for that scope is denied without requiring the extension to reload.

### Incremental Re-Consent

#### REQ: incremental-consent

When an already-installed extension's manifest comes to request a scope the user has not yet decided on, the host prompts the user for the newly-requested scope(s) only — previously granted scopes remain granted and are not re-asked. The extension gains a newly-requested scope only after the user grants it in this incremental prompt.

### Authoritative Consent Record

#### REQ: consent-source-of-truth

The per-`(user, extension, scope)` grant store is the single authoritative source of truth for what an extension may access. Any consumer (notably the Protected-Data Gateway) MUST treat a scope that is not currently granted — never granted, declined, or revoked — as denied.

## Dependencies

- extension-host-and-bridge

## Acceptance Criteria

### AC: catalog-defines-mvp-scopes

Scenario: The catalog exposes exactly the three MVP read scopes
Given the scope catalog
When it is read
Then it contains exactly `profile:read`, `contact_details:read`, and `contacts:read`, each with a label and a description, and all are read-only.
Verifies REQ: scope-catalog

### AC: unknown-scope-rejected

Scenario: A manifest scope outside the catalog is refused
Given an extension whose manifest requests a scope not in the catalog
When the extension is installed
Then the unknown scope is not offered in the consent dialog and is never treated as granted.
Verifies REQ: scope-catalog

### AC: granular-grant-and-decline

Scenario: User grants some requested scopes and declines others
Given an extension requesting `profile:read`, `contact_details:read`, and `contacts:read`
When the consent dialog is shown and the user grants `profile:read` and `contacts:read` but declines `contact_details:read`
Then exactly `profile:read` and `contacts:read` are recorded as granted and `contact_details:read` is not granted.
Verifies REQ: consent-dialog-granular

### AC: consent-shows-origin

Scenario: The consent dialog identifies the requesting origin
Given an extension being installed from a given origin
When the consent dialog is shown
Then it prominently displays that extension's origin alongside the requested scopes' labels and descriptions.
Verifies REQ: consent-dialog-granular

### AC: grants-isolated-per-user-and-extension

Scenario: Grants do not leak across extensions or users
Given user A granted `contacts:read` to extension X
When grants are evaluated for extension Y, or for user B
Then neither extension Y nor user B is treated as having that grant.
Verifies REQ: grant-storage

### AC: revoke-takes-effect-immediately

Scenario: Revoking a scope blocks it without a reload
Given an extension currently granted `contacts:read`
When the user revokes `contacts:read`
Then the scope is immediately treated as not-granted and a subsequent read for `contacts:read` is denied without the extension reloading.
Verifies REQ: revoke-immediate

### AC: incremental-consent-on-new-scope

Scenario: A newly requested scope prompts only for the new scope
Given an installed extension with `profile:read` already granted whose manifest now also requests `contacts:read`
When the extension is next loaded
Then the user is prompted only for `contacts:read`, `profile:read` remains granted and is not re-asked, and `contacts:read` becomes granted only if the user grants it in this prompt.
Verifies REQ: incremental-consent

### AC: ungranted-scope-treated-as-denied

Scenario: Anything not currently granted is denied
Given a scope that was never granted, was declined, or was revoked for an extension
When a consumer (e.g. the Protected-Data Gateway) checks access for that scope
Then the grant store reports it as not granted and the consumer denies access.
Verifies REQ: consent-source-of-truth

## Open Questions

- **Consent record storage location:** where the per-`(user, extension, scope)` grants live (the user's space vs. a central extensions collection) and the exact document shape — deferred to the Plan. Carries over the source Idea's open question on consent-record location and revocation propagation.
- **Manifest scope-set shrink:** if a manifest later stops requesting a previously-granted scope, does the stale grant get pruned automatically or left until revoked? MVP leaves it until the user revokes; revisit if it causes confusion.
- **Rehearse stubs:** all eight ACs are testable (catalog inspection, consent-dialog interaction, grant-store reads/writes, revoke and incremental-consent flows); `_tests/` stubs are deferred to the Plan.

---
*This document follows the https://specscore.md/feature-specification*
