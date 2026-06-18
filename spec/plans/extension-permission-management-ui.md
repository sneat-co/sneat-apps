---
format: https://specscore.md/plan-specification
status: Approved
---

# Plan: Extension Permission Management Ui

**Status:** Approved
**Source Feature:** extension-permission-management-ui
**Date:** 2026-06-18
**Owner:** alex
**Supersedes:** —
**Grade:** A

## Summary

This plan implements the settings/permission-management screen for installed extensions inside the shared `libs/extensions-platform` lib. It is a thin human-facing surface over interfaces owned by sibling Features: the extension registry and `frame-src` allowlist + deregistration from the Host & Bridge Feature (foundation), the per-`(user, extension, scope)` grant store, scope catalog labels, and immediate revoke from the Consent & Scopes Feature, and the trusted-origin allowlist from the Trusted First-Party Extensions Feature. It holds no consent logic of its own: it reads installed extensions and their currently-granted scopes for display, and its revoke/remove actions delegate to the consent store and the host's deregistration. Removal touches only Sneat-side state (registration, grants, allowlist) and never the extension's own external backend.

## Approach

The decomposition is UI-up over already-existing interfaces. It assumes the foundation is in place: F1 (extension-host-and-bridge) Task 1 provides the `ExtensionRegistry` (list/read/delete keyed by origin), Task 2 the dynamic `frame-src` allowlist, and Task 9 the `extension-deregistration` that deletes the registration record and drops the origin from the allowlist; the Consent & Scopes Feature provides the grant store (read currently-granted scopes), the scope catalog labels, and immediate per-scope revoke; the Trusted First-Party Extensions Feature provides the static trusted-origin allowlist used as the trusted/untrusted discriminator. We first build a read-model/view-model service that joins registry + grant store + catalog + trusted allowlist into a per-extension display model, then the list component and its empty state, then the granted-scopes and trusted-badge rendering on top of that model, then the two mutating actions (revoke a scope, remove an extension) that delegate downstream, and finally an explicit verification that removal does not reach the extension's external backend. Ordering follows data dependency: view-model → list/empty-state → scopes/trusted display → revoke/remove actions → external-data invariant.

## Tasks

### Task 1: Permission-management view-model service

**Verifies:** extension-permission-management-ui#ac:list-shows-installed-extensions
**Depends-On:** —
**Status:** pending

Build a read-only view-model service in `libs/extensions-platform` that, for the signed-in user, lists installed extensions from F1's `ExtensionRegistry` (F1 Task 1) and joins each with its currently-granted scopes from the Consent & Scopes grant store, its catalog scope labels, and a trusted flag derived from the Trusted First-Party trusted-origin allowlist — producing a per-extension display model carrying name, icon, origin, granted-scope labels, and `isTrusted`. Depends-On (cross-plan): extension-host-and-bridge Task 1 (`ExtensionRegistry` list/read), extension-consent-and-scopes Task 1 (scope catalog labels) and Task 3 (grant-store list-granted), trusted-first-party-extensions Task 1 (`isTrustedOrigin`) — this plan is a pure consumer of those interfaces.

### Task 2: Installed-extensions list and empty state

**Verifies:** extension-permission-management-ui#ac:list-shows-installed-extensions
**Verifies:** extension-permission-management-ui#ac:empty-state-when-none-installed
**Depends-On:** 1
**Status:** pending

Implement the settings screen component that renders each extension from the view-model (Task 1) showing its name, icon, and origin, and renders a non-error empty state when the user has no installed extensions.

### Task 3: Per-extension granted-scopes display

**Verifies:** extension-permission-management-ui#ac:shows-currently-granted-scopes
**Depends-On:** 1, 2
**Status:** pending

Render, for each non-trusted extension, only its currently-granted scopes using each scope's human-readable catalog label (Consent & Scopes Feature); a scope that was never granted, declined, or revoked is not shown as granted. An extension renders exactly ONE of two mutually-exclusive branches: the scope list here (untrusted) or the trusted full-access badge (Task 4) — never both.

### Task 4: Trusted extension full-access badge

**Verifies:** extension-permission-management-ui#ac:trusted-extension-shows-full-access-badge
**Depends-On:** 1, 2
**Status:** pending

For an extension whose origin is on the trusted allowlist (the discriminator, per Trusted First-Party Extensions Feature), show a "Trusted — full account access" indicator instead of a scope list while still exposing the Remove action.

### Task 5: Revoke a single scope

**Verifies:** extension-permission-management-ui#ac:revoke-single-scope
**Depends-On:** 3
**Status:** pending

Wire the per-scope revoke control to delegate to the Consent & Scopes store's immediate revoke; on success the scope disappears from that extension's granted list and, per the consent store, a subsequent gateway call for that scope is denied. Include a test asserting the list update plus the denied follow-on gateway access.

### Task 6: Remove an extension

**Verifies:** extension-permission-management-ui#ac:remove-extension-fully
**Depends-On:** 2, 4
**Status:** pending

Wire the Remove action to revoke all of the extension's scopes (Consent & Scopes Feature) and then deregister it via the host's `extension-deregistration` (F1 Task 9), which deletes the registration record and drops the origin from the `frame-src` allowlist so it can no longer be embedded; assert grants, registration, and allowlist entry are all cleared.

### Task 7: Removal leaves external backend untouched

**Verifies:** extension-permission-management-ui#ac:remove-does-not-touch-external-data
**Depends-On:** 6
**Status:** pending

Add a test fixture/assertion confirming the Remove flow (Task 6) clears only Sneat-side state (registration, grants, allowlist entry) and issues no call against the extension's own external backend, so externally-stored data is not touched by Sneat.

## Open Questions

None at this time.

---

_This document follows the https://specscore.md/plan-specification_
