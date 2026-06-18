---
format: https://specscore.md/plan-specification
status: Approved
---

# Plan: Extension Consent And Scopes

**Status:** Approved
**Source Feature:** extension-consent-and-scopes
**Date:** 2026-06-18
**Owner:** alex
**Supersedes:** —
**Grade:** A

## Summary

This plan implements the per-scope consent model for untrusted extensions inside the `libs/extensions-platform` lib delivered by the Host & Bridge Feature (F1). It adds: a fixed read-only `ScopeCatalog` (id/label/description) with catalog-membership filtering of manifest-requested scopes; a per-`(user, extension, scope)` `ConsentStore` persisted under the signed-in user's own data space with create/read/revoke and a synchronous `isGranted` query; a granular, origin-displaying consent dialog returning per-scope grant/decline decisions; immediate revocation; and incremental re-consent that prompts only for newly-requested, not-yet-decided scopes. The store is the single authoritative source of truth that the Protected-Data Gateway and Permission-Management-UI Features consume; this Feature records and exposes consent decisions only — it reads no protected data itself.

## Approach

The decomposition is bottom-up and rides on F1's foundation. It assumes F1 Task 1 (the `ExtensionRegistry` recording raw requested scopes) and F1 Task 3 (structural manifest validation) are in place — this plan adds the _semantic_ catalog filter on top of F1's structural validation, and never re-plans the registry, host, or bridge. We start with the immutable catalog (pure data, depended on by everything), then the persistent grant store keyed by `(user, extension, scope)` with isolation and a live `isGranted` query (the authoritative record), then the granular consent dialog UI, then the install-time consent flow that wires manifest scopes → catalog filter → dialog → store. Revocation and incremental re-consent layer on the store + dialog. A final task asserts the store's authoritative not-granted-is-denied contract that downstream consumers rely on. Ordering is driven by data dependency: catalog → store → dialog → install flow → revoke / incremental → authoritative contract.

## Tasks

### Task 1: Read-only scope catalog

**Verifies:** extension-consent-and-scopes#ac:catalog-defines-mvp-scopes
**Depends-On:** —
**Status:** pending

Implement an immutable `ScopeCatalog` in `libs/extensions-platform` exposing exactly the four MVP read-only scopes (`profile:read`, `contact_details:read`, `contacts:read`, `contacts_details:read`), each with a stable id, a distinct human-readable label (e.g. "Your contact details" vs. "Your contacts' contact details"), and a description, plus a `has(scopeId)` membership check.

### Task 2: Catalog membership filter for manifest scopes

**Verifies:** extension-consent-and-scopes#ac:unknown-scope-rejected
**Depends-On:** 1
**Status:** pending

Add the semantic filter that takes an extension's raw requested scopes (recorded structurally by F1's registry/manifest validation) and keeps only catalog members, so a scope absent from the catalog is never offered for consent and never treated as granted. This is the catalog-membership check applied at consent/enforcement time, distinct from F1's structural manifest validation.

### Task 3: Per-(user, extension, scope) consent store

**Verifies:** extension-consent-and-scopes#ac:grants-isolated-per-user-and-extension
**Depends-On:** 1
**Status:** pending

Implement `ConsentStore` persisting grant decisions per `(user, extension, scope)` under the signed-in user's own data space/record. Document shape: one doc per `(user, extension)` keyed by `extId` (origin host[:port]) under the user's space, carrying a `grants` map of `scopeId -> { state: "granted" | "declined", decidedAt }`; absence of an entry means not-decided. Expose `record-grant`, `record-decline`, `list-granted`, and a synchronous `isGranted(user, extension, scope)` query, with strict keying so grants never leak across extensions or users.

### Task 4: Granular consent dialog with origin display

**Verifies:** extension-consent-and-scopes#ac:granular-grant-and-decline
**Verifies:** extension-consent-and-scopes#ac:consent-shows-origin
**Depends-On:** 1
**Status:** pending

Build the consent dialog component that prominently displays the extension's identity and origin and lists each requested catalog scope with its label and description, letting the user grant or decline each scope independently and returning the per-scope decisions; nothing is granted implicitly.

### Task 5: Install-time consent flow

**Verifies:** extension-consent-and-scopes#ac:granular-grant-and-decline
**Depends-On:** 2, 3, 4
**Status:** pending

Wire the install-time per-scope consent flow for untrusted origins (origin not on the Trusted allowlist) that takes the catalog-filtered requested scopes (Task 2), shows the granular dialog (Task 4), and persists the user's per-scope decisions to the store (Task 3) — recording granted scopes as granted and not recording declined scopes as granted. This flow is reached only for untrusted origins via the install-time trusted/untrusted branch owned by Trusted Task 5; this plan owns only the untrusted per-scope path. The extension is still installed/registered (by F1 Task 4) even when the user declines every scope — an all-declined consent simply records no grants; gating of F1 Task 4's record + allowlist step for the trusted abort-on-decline path is owned by Trusted Task 5, not here. Hooks into F1's add-by-URL / registration flow without re-planning it.

**Depends-On (cross-plan):** trusted-first-party-extensions Task 1 (`isTrustedOrigin`) and the install-time branch in Trusted Task 5 — the per-scope consent dialog is shown only when the origin is NOT trusted.

### Task 6: Immediate scope revocation

**Verifies:** extension-consent-and-scopes#ac:revoke-takes-effect-immediately
**Depends-On:** 3
**Status:** pending

Implement revoke on the consent store (individual scope, or all scopes of an extension at once) such that after revocation `isGranted` reports the scope as not-granted immediately, so a subsequent data read for that scope is denied without the extension reloading.

### Task 7: Incremental re-consent for newly-requested scopes

**Verifies:** extension-consent-and-scopes#ac:incremental-consent-on-new-scope
**Depends-On:** 3, 4
**Status:** pending

On load of an already-installed extension whose manifest now requests catalog scopes the user has not yet decided, compute the not-yet-decided subset and prompt only for those via the dialog, leaving previously-granted scopes granted and un-asked; a newly-requested scope becomes granted only if the user grants it in this incremental prompt. Depends-On (cross-plan): the host load/embed path (extension-host-and-bridge Task 5) is the trigger point that fires this on-load incremental check.

### Task 8: Authoritative not-granted-is-denied contract

**Verifies:** extension-consent-and-scopes#ac:ungranted-scope-treated-as-denied
**Depends-On:** 3, 6
**Status:** pending

Establish and test the store's authoritative contract that any scope not currently granted — never granted, declined, or revoked — is reported as not granted by `isGranted`, so a consumer (notably the Protected-Data Gateway) denies access; this task adds the `_tests/` coverage proving the source-of-truth guarantee across all three not-granted cases.

## Open Questions

None at this time.

---

_This document follows the https://specscore.md/plan-specification_
