---
format: https://specscore.md/plan-specification
status: Approved
---

# Plan: Extension Host And Bridge

**Status:** Approved
**Source Feature:** extension-host-and-bridge
**Date:** 2026-06-18
**Owner:** alex
**Supersedes:** —
**Grade:** A

## Summary

This plan implements the foundation for Sneat's third-party extension platform: a new `libs/extensions-platform` Nx Angular library that hosts an untrusted extension in a sandboxed `<iframe>`, registers it by fetching and structurally validating its `/.well-known/sneat-extension.json` manifest, maintains a dynamic CSP `frame-src` allowlist of consented origins, establishes an origin-verified `MessageChannel` RPC bridge (Penpal) with a versioned envelope, and renders extension-contributed menu items that re-route the extension's single content iframe. It delivers the shared shell that the sibling Consent, Protected-Data-Gateway, Permission-Management-UI, and Trusted-First-Party Features build on, while explicitly carrying no credential or server-to-server secret to any extension.

## Approach

The decomposition starts bottom-up with the data/registry layer that everything else reads from, then layers the CSP allowlist and manifest pipeline that populate it, then the iframe host + sandbox, then the bridge transport on top of the loaded frame, and finally menu contribution which depends on a live bridge. Deregistration closes the loop on registry + allowlist. The no-backend / no-secret guarantees are not new code so much as cross-cutting invariants verified against the host + bridge once they exist, so they come last as explicit verification tasks. Ordering is driven by data dependency: registry → allowlist → manifest pipeline → host → bridge handshake → RPC envelope → menu/single-surface → deregistration → no-secret invariants.

## Tasks

### Task 1: Scaffold extensions-platform lib and extension registry

**Verifies:** extension-host-and-bridge#ac:manifest-add-success
**Depends-On:** —
**Status:** pending

Generate the `libs/extensions-platform` Nx Angular library and implement the `ExtensionRegistry` (a Firestore-or-local-store service plus model) that records a registration keyed by id = origin `host[:port]`, holding URL, manifest metadata, and requested scopes, with create/read/list/delete operations.

### Task 2: Dynamic frame-src CSP allowlist service

**Verifies:** extension-host-and-bridge#ac:frame-src-allowlist-blocks-unknown-origin
**Depends-On:** 1
**Status:** pending

Implement the dynamic `frame-src` allowlist derived from registered origins and wire it into the host page's Content-Security-Policy so only explicitly-added origins can be framed; an origin absent from the allowlist is blocked by CSP and its iframe never loads.

### Task 3: Manifest fetch and structural validation

**Verifies:** extension-host-and-bridge#ac:manifest-invalid-rejected
**Verifies:** extension-host-and-bridge#ac:manifest-format-and-origin-checks
**Depends-On:** 1
**Status:** pending

Implement fetching the manifest from `/.well-known/sneat-extension.json` and structural validation: URL is `https`, manifest is fetchable and parses as JSON, required fields present with correct types (`name`, `author.name`, valid `author.email`, `https` `icon` URL, `scopes` string array), and self-declared origin equals the fetch origin; any failure surfaces a user-visible error and records/allowlists nothing.

### Task 4: Add-by-URL auto-registration flow

**Verifies:** extension-host-and-bridge#ac:manifest-add-success
**Depends-On:** 1, 2, 3
**Status:** pending

Wire the user-facing "add extension by https URL" flow that runs validation (Task 3) and, only on success, records the extension via the registry (Task 1) and appends its origin to the `frame-src` allowlist (Task 2).

### Task 5: Sandboxed iframe host component

**Verifies:** extension-host-and-bridge#ac:cross-origin-isolation-from-host
**Verifies:** extension-host-and-bridge#ac:extension-has-own-origin-storage
**Depends-On:** 1, 2
**Status:** pending

Implement the host component that renders a registered extension in a single `<iframe sandbox="allow-scripts allow-same-origin">` pointed at the extension's own `https` origin, so the same-origin policy isolates it from sneat-app's session/storage while letting it persist to its own-origin `localStorage`/`IndexedDB`.

### Task 6: Bridge handshake with origin verification

**Verifies:** extension-host-and-bridge#ac:handshake-origin-verified
**Depends-On:** 5
**Status:** pending

On iframe load, establish a private `MessageChannel` (via Penpal) and transfer exactly one `MessagePort` to the framed extension, accepting the handshake only when `event.origin` equals the extension's registered origin and ignoring handshake messages from any other origin.

### Task 7: Versioned RPC envelope and correlation

**Verifies:** extension-host-and-bridge#ac:rpc-correlates-and-errors
**Depends-On:** 6
**Status:** pending

Define the versioned transport envelope (protocol version, message id, type, payload) over the transferred port: correlate responses to requests by message id, return an error response for unknown/unsupported message types, and reject protocol-version mismatches.

### Task 8: Menu contribution rendering and single-iframe routing

**Verifies:** extension-host-and-bridge#ac:menu-items-rendered-and-route
**Verifies:** extension-host-and-bridge#ac:single-iframe-only
**Depends-On:** 7
**Status:** pending

Receive `{ title, emoji, path, args? }` menu items over the bridge, render well-formed items (non-empty `title` and `path`) as native sub-menu entries while ignoring malformed ones, and route the single existing content iframe to `path` (with `args`) on activation — never spawning a second iframe or a direct iframe-to-iframe channel.

### Task 9: Deregistration drops record and allowlist origin

**Verifies:** extension-host-and-bridge#ac:deregistration-drops-allowlist
**Depends-On:** 1, 2
**Status:** pending

Implement host deregistration that deletes the registration record and removes the extension's origin from the `frame-src` allowlist so subsequent embedding of that origin is CSP-blocked, touching only Sneat-side state.

### Task 10: No-backend / no-secret end-to-end verification

**Verifies:** extension-host-and-bridge#ac:backendless-extension-works
**Verifies:** extension-host-and-bridge#ac:no-secret-exchange
**Depends-On:** 4, 5, 6, 7, 8
**Status:** pending

Add an end-to-end test fixture for a static, backend-less extension (assets + manifest over `https`) that adds, embeds, handshakes, and reads data over the bridge with no backend running, and assert no shared secret, API key, or server-to-server credential is ever exchanged with any extension, and that an UNTRUSTED extension receives no credential. Scope the assertion exactly as F1 REQ:no-secret-exchange does — it MUST NOT forbid the intentional trusted client-side Firebase-token handoff, which is out of scope here and owned/verified by trusted-first-party-extensions Task 2.

## Open Questions

None at this time.

---

_This document follows the https://specscore.md/plan-specification_
