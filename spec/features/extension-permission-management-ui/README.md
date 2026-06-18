---
format: https://specscore.md/feature-specification
status: In Review
---

# Feature: Extension Permission Management UI

> [SpecScore.**Studio**](https://specscore.studio): | [Explore](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-permission-management-ui?op=explore) | [Edit](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-permission-management-ui?op=edit) | [Ask question](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-permission-management-ui?op=ask) | [Request change](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-permission-management-ui?op=request-change) |
**Status:** In Review
**Source Ideas:** third-party-extension-platform

## Summary

A settings screen where the user reviews installed extensions (name, icon, origin), sees the scopes currently granted to each, revokes an individual scope, and removes an extension entirely (revoking all its scopes, deleting its registration, and dropping its origin from the dynamic frame-src allowlist).

## Problem

Granting an extension access is only half of informed consent — the user also needs an ongoing, legible place to see what they have granted and to take it back. This Feature is the Facebook-style "app permissions" screen: it lists the user's installed extensions, shows the scopes each currently holds, and lets the user revoke a single scope or remove an extension entirely. It is the human-facing surface over the consent store (Consent & Scopes Feature) and the extension registry/allowlist (Host & Bridge Feature); it holds no consent logic of its own — revocation and removal delegate to those Features. Removal affects only Sneat-side state (registration, grants, allowlist); it does not reach into data the extension stored on its own external backend.

## Behavior

### Installed Extensions List

#### REQ: installed-extensions-list

The settings screen lists every extension the signed-in user has installed, each shown with its name, icon, and origin (from the registered manifest). When the user has no installed extensions, the screen shows an empty state rather than an error.

### Granted Scopes Display

#### REQ: per-extension-granted-scopes

For each installed extension, the screen displays the scopes currently granted to it, using each scope's human-readable label from the catalog (Consent & Scopes Feature). A scope that is not currently granted (never granted, declined, or revoked) is not shown as granted.

### Revoke a Scope

#### REQ: revoke-scope-action

The user can revoke an individual granted scope for an extension. The action delegates to the consent store's revoke (Consent & Scopes Feature); on success the scope immediately disappears from that extension's granted list, and — per the consent store — subsequent gateway access for that scope is denied.

### Remove an Extension

#### REQ: remove-extension-action

The user can remove (uninstall) an extension entirely. Removal revokes all of the extension's scopes (Consent & Scopes Feature) and deregisters it via the host (Host & Bridge Feature's `extension-deregistration`: deletes the registration record and drops the origin from the dynamic `frame-src` allowlist), so the extension is no longer embeddable and holds no grants. Removal affects only Sneat-side state; it does not delete data the extension stored on its own external backend.

## Dependencies

- extension-host-and-bridge
- extension-consent-and-scopes

## Acceptance Criteria

### AC: list-shows-installed-extensions

Scenario: Installed extensions are listed with identity
Given the signed-in user has installed two extensions
When the user opens the permission-management screen
Then both extensions are listed, each showing its name, icon, and origin.
Verifies REQ: installed-extensions-list

### AC: empty-state-when-none-installed

Scenario: No extensions installed shows an empty state
Given the signed-in user has no installed extensions
When the user opens the permission-management screen
Then an empty state is shown and no error occurs.
Verifies REQ: installed-extensions-list

### AC: shows-currently-granted-scopes

Scenario: Each extension shows its granted scopes by label
Given an extension granted `profile:read` and `contacts:read` but not `contacts_details:read`
When the user views that extension on the screen
Then `profile:read` and `contacts:read` are shown as granted using their catalog labels, and `contacts_details:read` is not shown as granted.
Verifies REQ: per-extension-granted-scopes

### AC: revoke-single-scope

Scenario: Revoking one scope updates the list and blocks access
Given an extension currently granted `contacts:read`
When the user revokes `contacts:read` from the screen
Then `contacts:read` is removed from that extension's granted list and a subsequent `contacts.list` gateway call for that extension is denied.
Verifies REQ: revoke-scope-action

### AC: remove-extension-fully

Scenario: Removing an extension clears grants, registration, and allowlist
Given an installed extension with one or more granted scopes
When the user removes the extension
Then all its scopes are revoked, its registration is deleted, and its origin is dropped from the `frame-src` allowlist so it can no longer be embedded.
Verifies REQ: remove-extension-action

### AC: remove-does-not-touch-external-data

Scenario: Removal does not reach the extension's own backend
Given an extension that stored data on its own external backend
When the user removes the extension from Sneat
Then only Sneat-side state (registration, grants, allowlist entry) is cleared; the extension's externally-stored data is not touched by Sneat.
Verifies REQ: remove-extension-action

## Open Questions

- **Re-grant from settings:** MVP supports review + revoke + remove. Whether the user can re-grant a previously declined/revoked scope directly from this screen (vs. only via the extension re-requesting it through incremental consent) is deferred.
- **Live session on revoke/remove:** for an extension currently open in an iframe, data access stops immediately (the gateway denies on the next call per the Consent & Scopes Feature). Whether revoke/remove also visibly tears down the live iframe then and there, or only blocks re-embedding on next load, is a Plan/UX detail.
- **Rehearse stubs:** all six ACs are testable (list rendering, empty state, granted-scope display, revoke flow + gateway effect, full removal + allowlist effect); `_tests/` stubs are deferred to the Plan.

---
*This document follows the https://specscore.md/feature-specification*
