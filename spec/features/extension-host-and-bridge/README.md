---
format: https://specscore.md/feature-specification
status: Approved
---

# Feature: Extension Host & Bridge

> [SpecScore.**Studio**](https://specscore.studio): | [Explore](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-host-and-bridge?op=explore) | [Edit](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-host-and-bridge?op=edit) | [Ask question](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-host-and-bridge?op=ask) | [Request change](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/extension-host-and-bridge?op=request-change) |
**Status:** Approved
**Source Ideas:** third-party-extension-platform
**Grade:** A

## Summary

Sandboxed-iframe host and postMessage bridge that loads a third-party extension by URL, auto-registers it from its sneat-extension.json manifest, establishes an origin-verified MessageChannel RPC, and renders extension-contributed menu items into the host sub-menu — the shared foundation both untrusted and trusted extension classes build on.

## Problem

Sneat's existing extensions (docus, listus, trackus, budgetus, assetus) are first-party Angular libraries statically linked into `apps/sneat-app` with full in-process trust. To support a Facebook-Apps-style platform for **untrusted** third-party extensions, Sneat needs a host that embeds extension code as a sandboxed iframe, isolates it from the app's Firebase session, and communicates with it only over a controlled message channel. This Feature delivers that foundation — the sandboxed host, the auto-registration-by-URL flow driven by a `sneat-extension.json` manifest, the origin-verified `MessageChannel` RPC transport, and host-rendered menu contribution. It is the shared shell both extension classes build on; per-scope consent, the protected-data gateway, the permission-management UI, and the trusted-first-party token handoff are separate Features that ride on this bridge.

## Behavior

### Iframe Sandbox & Isolation

#### REQ: sandboxed-iframe-host

The host renders an extension's content in an `<iframe>` whose `sandbox` grants `allow-scripts allow-same-origin`. Here `allow-same-origin` means the framed document keeps its OWN origin (e.g. `https://listus.app`) rather than being downgraded to an opaque/null origin — which is what lets a backend-less extension persist to its own `localStorage`/`IndexedDB`. It grants NO access to sneat-app's origin: because an extension is always served from a different origin than sneat-app, the browser's same-origin policy prevents it from reading sneat-app's Firebase session, cookies, `localStorage`, or `IndexedDB`. (Withholding `allow-same-origin` would only matter for a frame that is same-origin as the host — which an extension never is — so it is granted here to give extensions their own storage without weakening isolation from Sneat.) The host page's Content-Security-Policy `frame-src` restricts embeddable origins to a dynamic allowlist of origins the user has explicitly added; an origin not on the allowlist cannot be framed.

### Manifest & Auto-Registration

#### REQ: manifest-autoregister

A user adds an extension by entering its `https` URL — no developer pre-registration. The host fetches the manifest from the well-known path `/.well-known/sneat-extension.json` on that origin. Only after the manifest passes structural validation (REQ: manifest-structural-validation) does the host record the extension (id = the origin `host[:port]`, URL, manifest metadata, requested scopes) and append the origin to the dynamic `frame-src` allowlist. Nothing is recorded or embedded for a manifest that fails validation.

#### REQ: manifest-structural-validation

Before an extension is registered, its manifest MUST pass structural validation. Each check below, on failure, refuses the add with a user-visible error and records/allowlists nothing:

- the extension URL MUST be `https`;
- the manifest MUST be fetchable at `/.well-known/sneat-extension.json` and parse as JSON;
- required fields MUST be present with the correct types: `name` (string), `author.name` (string), `author.email` (string that is a syntactically valid email address), `icon` (string that is an `https` URL), and `scopes` (an array of strings);
- the manifest's self-declared origin MUST equal the origin it was fetched from — an extension may not claim another origin.

This is *structural* validation only. Whether each requested scope is a *supported* scope is NOT checked here; that semantic check is owned by the Consent & Scopes Feature's catalog at consent time.

### Bridge Handshake & Origin Verification

#### REQ: bridge-handshake

On iframe load, host and extension perform a handshake that establishes a private `MessageChannel`; the host transfers exactly one `MessagePort` to the framed extension. The host accepts the handshake only when the message's `event.origin` equals the extension's registered origin and ignores handshake messages from any other origin. All subsequent RPC flows over the transferred port.

#### REQ: rpc-protocol

Messages over the bridge use a versioned envelope (protocol version, message id, type, payload). Requests are correlated to responses by message id; an unknown/unsupported message type returns an error response; a protocol-version mismatch is rejected. This Feature defines the transport envelope only — scope and data-access methods are defined by the Consent and Protected-Data-Gateway Features.

### Menu Contribution

#### REQ: menu-contribution

An extension sends menu items over the bridge, each shaped `{ title, emoji, path, args? }`. The host renders them as native sub-menu entries under the extension; activating an entry routes the extension's single content iframe to `path` (passing `args` when present). The host accepts only items with a non-empty `title` and `path` and ignores malformed items.

### Single Content Surface

#### REQ: single-content-surface

Each extension has exactly one content iframe. The host never creates a second iframe for an extension (e.g. a separate side-menu frame) and exposes no direct iframe-to-iframe channel; any cross-surface interaction is mediated by the host. Menu navigation re-routes the single existing iframe rather than spawning another.

### Extension Hosting Model

#### REQ: no-backend-no-secret

An extension is a static frontend (its assets plus its `/.well-known/sneat-extension.json` manifest) served over `https`. Hosting and running an extension requires NO backend and NO server-to-server integration with Sneat, and NO shared secret, API key, or server-to-server credential is exchanged between Sneat and an extension:

- an **untrusted** extension reads consented Sneat data solely over the bridge gateway and never receives any credential;
- a **trusted** (allowlisted, first-party) extension receives the user's own Firebase ID token via a client-side handoff from the parent frame — not a server-issued secret (the trusted handoff mechanism is owned by the Trusted First-Party Extensions Feature).

A backend or external storage service is OPTIONAL — needed only if the extension persists data beyond its own-origin browser storage (`localStorage`/`IndexedDB`). A stateless extension, or one that persists only to its own-origin browser storage, needs no backend at all.

## Acceptance Criteria

### AC: cross-origin-isolation-from-host

Scenario: Sandboxed extension cannot reach the host app's session
Given an extension loaded in the host iframe with `sandbox="allow-scripts allow-same-origin"` and served from a different origin than sneat-app
When the extension script tries to read sneat-app's cookies, `localStorage`, `IndexedDB`, or Firebase auth token
Then the same-origin policy blocks all such cross-origin access.
Verifies REQ: sandboxed-iframe-host

### AC: extension-has-own-origin-storage

Scenario: A backend-less extension can persist to its own storage
Given an extension loaded with `allow-same-origin` from its own `https` origin
When it writes to its own `localStorage`/`IndexedDB`
Then the writes succeed under the extension's own origin and are not visible to sneat-app or to any other extension's origin.
Verifies REQ: sandboxed-iframe-host

### AC: frame-src-allowlist-blocks-unknown-origin

Scenario: An origin the user never added cannot be embedded
Given an origin that is not on the dynamic `frame-src` allowlist
When the host attempts to embed that origin in an iframe
Then CSP `frame-src` blocks the frame and it does not load.
Verifies REQ: sandboxed-iframe-host

### AC: manifest-add-success

Scenario: Adding a valid extension by URL auto-registers it
Given a reachable `https` extension URL serving a valid manifest at `/.well-known/sneat-extension.json` (name, author.name, a valid author.email, an `https` icon URL, a `scopes` string array) whose self-declared origin matches the fetch origin
When the user adds the extension by its URL
Then the manifest is fetched from `/.well-known/sneat-extension.json`, the extension is recorded with id = its origin `host[:port]` and its requested scopes, and its origin is appended to the `frame-src` allowlist.
Verifies REQ: manifest-autoregister

### AC: manifest-invalid-rejected

Scenario: A non-https, missing, unparseable, or wrong-typed manifest is refused
Given an extension URL that is not `https`, or whose manifest is absent at `/.well-known/sneat-extension.json`, unparseable, or missing a required field or has a field of the wrong type
When the user attempts to add it
Then the extension is not added, nothing is recorded or allowlisted, and an error is shown to the user.
Verifies REQ: manifest-structural-validation

### AC: manifest-format-and-origin-checks

Scenario: Bad email, non-https icon, or origin mismatch is refused
Given a parseable manifest whose `author.email` is not a valid email address, OR whose `icon` is not an `https` URL, OR whose self-declared origin differs from the origin it was fetched from
When the user attempts to add it
Then structural validation fails, the extension is not added, and an error is shown to the user.
Verifies REQ: manifest-structural-validation

### AC: handshake-origin-verified

Scenario: Only the registered origin completes the handshake
Given a loaded extension iframe served from its registered origin
When the handshake runs
Then a private `MessageChannel` is established and one `MessagePort` is transferred to the iframe, and a handshake message whose `event.origin` differs from the registered origin is ignored.
Verifies REQ: bridge-handshake

### AC: rpc-correlates-and-errors

Scenario: Requests correlate; bad messages error
Given an established bridge
When the extension sends a versioned request, and separately a message of unknown type or mismatched protocol version
Then the valid request receives a response correlated by its message id, and the unknown-type / version-mismatch message receives an error response.
Verifies REQ: rpc-protocol

### AC: menu-items-rendered-and-route

Scenario: Contributed menu items render and navigate the single iframe
Given an extension that sends menu items `[{ title, emoji, path, args? }]`, some malformed
When the host receives them and the user activates a well-formed entry
Then each well-formed item appears as a native sub-menu entry, activating it routes the single content iframe to that item's `path` (with `args` when present), and malformed items are ignored.
Verifies REQ: menu-contribution

### AC: single-iframe-only

Scenario: Navigation reuses one iframe, never spawns another
Given an extension contributing menu items and content
When the user navigates among the extension's menu entries
Then the host re-routes the one existing content iframe and never creates a second iframe or a direct iframe-to-iframe channel.
Verifies REQ: single-content-surface

### AC: backendless-extension-works

Scenario: A static, backend-less extension functions end to end
Given a static extension (frontend assets + manifest served over `https`) with no backend
When the user adds it, grants scopes, and the extension requests consented Sneat data over the bridge
Then it embeds, handshakes, and reads the consented data with no backend running and no secret exchanged with Sneat.
Verifies REQ: no-backend-no-secret

### AC: no-secret-exchange

Scenario: No server-to-server secret is exchanged with any extension
Given any extension, untrusted or trusted
When it is registered and loaded
Then no shared secret, API key, or server-to-server credential is exchanged between Sneat and the extension — an untrusted extension receives no credential, and a trusted extension receives only the user's own Firebase token via a client-side handoff.
Verifies REQ: no-backend-no-secret

## Open Questions

- **postMessage RPC transport:** use Penpal, Comlink, or a hand-rolled ~100–150-line layer? Deferred to the Plan; origin verification and (later) scope→method authorization stay in Sneat's own code regardless of the library. Carries over the source Idea's open question.
- **CSP enforcement on native:** do sandboxed iframes + `frame-src` behave identically inside the Capacitor Android/iOS webviews as on the web? Must be validated during implementation (source Idea Should-be-true assumption).
- **Deferred to sibling Features (not this one):** per-scope consent + grant/revoke storage, the read-only protected-data gateway, the permission-management UI, and the trusted-origin allowlist + Firebase-token handoff. The source Idea's Must-be-true assumptions about protected-data readability and the trusted allowlist are owned by those Features; this Feature's ACs cover the sandbox-isolation and `MessageChannel`-RPC Must-be-true assumptions.
- **Rehearse stubs:** all twelve ACs are testable (DOM/CSP, own-origin storage, `postMessage`/`MessageChannel` events, and manifest-fetch surfaces); `_tests/` stubs are deferred to the Plan rather than scaffolded now.

---
*This document follows the https://specscore.md/feature-specification*
