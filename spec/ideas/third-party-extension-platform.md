---
format: https://specscore.md/idea-specification
status: Draft
---

# Idea: Third-Party Extension Platform (sandboxed iframe + scoped API)

**Status:** Draft
**Date:** 2026-06-17
**Owner:** alex
**Promotes To:** —
**Supersedes:** —
**Related Ideas:** depends_on:extract-listus-standalone-repo

## Problem Statement

How might we let an untrusted third party embed an extension inside Sneat as a sandboxed iframe that can request, and only with the user's explicit per-scope consent receive, access to the user's profile, contact details, and contacts, via a message-passing bridge to a scope-enforced protected API?

## Context

Sneat already supports extensions (docus, listus, trackus, budgetus, assetus under libs/extensions/\*), but these are first-party Angular libraries statically linked into apps/sneat-app with full in-process trust and direct Firestore/service access. The goal is a Facebook-Apps-style platform for UNTRUSTED third-party extensions: embedded as sandboxed iframes, communicating with the parent frame only via postMessage, gated by user-granted permission scopes, and served by a platform-provided protected API. First consumer is an internal decoupled team (dogfood) to prove the trust boundary before opening to outside developers.

## Recommended Direction

Build a sandboxed-iframe extension host with a parent-proxied, scope-enforced data bridge. The parent renders the third-party extension in an iframe with sandbox=allow-scripts (NO allow-same-origin, so the iframe gets an opaque origin and cannot reach Sneat's Firebase session/storage) under a strict CSP frame-src allowlist. A versioned RPC bridge over a private MessageChannel (established during an origin-checked handshake) carries scope requests and API calls. A parent-side API gateway is the single security choke point: it maps each whitelisted API method to a required scope, checks it against the scopes the user granted THIS extension, executes against existing Sneat data services, and returns sanitized results - the iframe never sees a credential or token. MVP scopes are read-only: profile:read (name, gender, ...), contact_details:read (email, phone, ...), contacts:read (the user's contacts). Each extension declares itself via a well-known `sneat-extension.json` manifest on its own origin (name, author name, author email, icon, and the scopes it requests); when a user adds the extension the platform fetches this manifest to drive auto-registration and the consent prompt. The extension contributes navigation by sending menu items over the bridge - each `{ title, emoji, path, args? }` - which the host renders as native sub-menu entries; activating one routes the extension's single content iframe to that path. This is a critical UX requirement: the host stays the single content surface (no second iframe, no direct iframe-to-iframe messaging). A Facebook-style consent dialog captures grants at install and prominently shows the extension's origin; a settings screen lets the user review and revoke per extension.

## Alternatives Considered

- **Graph-style scoped backend HTTP API + token.** The parent mints a short-lived scoped token and the iframe calls a Sneat backend API directly (the closest analogue to Facebook's Graph API). Lost for MVP: requires building/operating a token-issuance and gateway backend, and a token in the iframe is a credential that can leak. Kept as a likely follow-up for server-to-server and native contexts; the postMessage gateway can be re-pointed at it later without changing the extension-facing contract.
- **Direct scoped Firestore access for protected data.** The iframe reads contacts/profile straight from Firestore via security rules. Lost: app-level scopes can't be expressed in Firestore rules cleanly, it couples third parties to our schema, and it bypasses the single choke point. (A sandboxed `extensions/{ext-id}/**` namespace for the extension's _own_ data — not protected user data — remains a sensible future, listed under Not Doing.)
- **Permission abstraction over the existing static-linked model (no iframe).** Add a scope/consent layer but keep extensions as in-process Angular libs. Lost: in-process code has full trust regardless of any permission layer, so it cannot satisfy the untrusted-third-party requirement at all.

## MVP Scope

Delivered in two phases:

**Phase 1 - Proof of Concept (POC): the minimal demo extension.** A small, _kept_ demo extension (not throwaway) loaded from an external https URL into a sandboxed iframe inside sneat-app - it lives on as the minimal reference example and smoke test for the platform. On install the user sees a consent dialog listing the three requested read-scopes and grants/denies them; granted scopes are persisted per (user, extension). The extension then requests data over the postMessage bridge and the parent gateway returns - only for granted scopes - the user's profile info, contact details, and contacts. The demo must render this as visible UI, not merely log a data-received proof: it displays the user's name as text and the contacts as a visible list (each row showing the contact's name and, where granted, contact details such as email/phone). The demo also sends menu items (`{ title, emoji, path, args? }`) that the host renders in the sub-menu and that route the iframe. A settings screen lists installed extensions with their granted scopes and lets the user revoke; revocation immediately blocks further data access. The POC's job is to prove the trust boundary, the bridge, consent/revoke, and menu contribution end to end.

**Phase 2 - MVP: the decoupled `listus` extension.** Run the real `listus` extension - decoupled per the `extract-listus-standalone-repo` idea - as a genuine iframe extension on the platform, exercising the same sandbox, bridge, scopes, consent, revoke, and menu-contribution path as a real first-party-turned-third-party product rather than a minimal demo. This validates the platform against a real extension with real navigation and real data needs.

## Not Doing (and Why)

- Public self-serve developer portal & app-review pipeline - internal dogfood first
- Rich in-iframe UI component SDK - cross-origin iframe can't share Angular components; defer to a separate ideation
- Write/mutation scopes - MVP is read-only (profile, contact details, contacts)
- Graph-style scoped backend HTTP API + token issuance - MVP uses the parent-proxy postMessage path only
- Extension-owned Firestore storage namespace (extensions/{ext-id}/\*\*) - planned follow-up, not MVP
- Author email confirmation/verification flow - out of MVP; the manifest carries the author email, but confirmation is a post-MVP trust signal (a consent-dialog badge), not a hard gate, and never an auto-block of an active extension
- App marketplace, directory, ratings, and billing/monetization - far past MVP

## Key Assumptions to Validate

| Tier           | Assumption                                                                                                                                                  | How to validate                                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Must-be-true   | An iframe with `sandbox="allow-scripts"` (no `allow-same-origin`) fully isolates third-party code from Sneat's Firebase auth session, cookies, and storage. | Spike: load a hostile sample iframe; confirm it cannot read parent cookies/localStorage/IndexedDB or obtain a Firebase token.    |
| Must-be-true   | A `MessageChannel`-based RPC with strict `origin` checks on both sides reliably carries scope requests + API calls across the trust boundary.               | Spike a request/response round-trip with origin assertions; attempt a spoofed-origin message and confirm it's rejected.          |
| Must-be-true   | The data behind the three scopes (profile, contact details, contacts) is readable by a parent-side service for the signed-in user today.                    | Inventory existing `libs/user` and contact data services; confirm a parent gateway can fetch all three without new backend work. |
| Should-be-true | An internal decoupled team is a realistic first consumer whose needs generalize to true third parties later.                                                | Confirm an internal team will build the demo extension against the same untrusted contract outsiders would use.                  |
| Should-be-true | Per-(user, extension) grant + revoke records fit cleanly into existing Firestore structures.                                                                | Prototype the install/consent record and a revoke that immediately blocks the gateway.                                           |
| Should-be-true | A strict CSP `frame-src` allowlist is enforceable across the app's deployment surfaces (Firebase Hosting web + Capacitor native webviews).                  | Test CSP enforcement in web build and in the Android/iOS Capacitor wrappers.                                                     |
| Might-be-true  | `extensions/{ext-id}/**` is the right home for extension-owned storage.                                                                                     | Defer; revisit when extension-owned persistence is specified.                                                                    |
| Might-be-true  | A scoped backend token API will be required for native/server-to-server contexts.                                                                           | Defer; revisit if the postMessage path proves insufficient.                                                                      |
| Might-be-true  | Third-party developers will demand a reusable in-iframe UI kit.                                                                                             | Defer to a separate ideation once external developers are onboarded.                                                             |

## SpecScore Integration

- **New Features this would create:** likely several — (1) sandboxed-iframe extension host + bridge protocol, (2) scope/consent model + storage, (3) parent-side protected-data API gateway, (4) extension permission-management (review/revoke) UI. To be split at `specstudio:specify` time.
- **Existing Features affected:** none directly; conceptually contrasts with the static-linked extension model under `libs/extensions/*` (docus, listus, trackus, budgetus, assetus). Platform code would likely live in a new lib (e.g. `libs/extensions-platform` / host + bridge + gateway) rather than inside any individual extension lib.
- **Dependencies:** existing `libs/user` and contact data services (for the gateway); Firebase auth/Firestore (parent-side only); app deployment CSP config. Phase 2 (MVP) depends on `extract-listus-standalone-repo` (the decoupled `listus` is the first real extension).

## Open Questions

- When (if ever) do we add the scoped backend token API alongside the postMessage proxy — and what triggers it (native, server-to-server, performance)?
- Where do install + consent records live (per-user space vs. a central extensions collection), and how is revocation propagated to in-flight sessions?
- How does an extension prove its identity when loaded from an arbitrary external URL (manifest registration, signature, origin pinning)?
- Do sandboxed iframes + CSP `frame-src` behave identically inside the Capacitor native webviews (Android/iOS) as on the web?
- What is the "building blocks (UI components)" story for cross-origin iframes — a published HTML/CSS kit, parent-rendered chrome, or web components — and does it warrant its own Idea?
- **postMessage RPC library vs. hand-roll?** Options: (a) **Penpal** — purpose-built parent↔iframe RPC with handshake + origin validation; (b) **Comlink** — `MessageChannel` proxy RPC, more "magic"; (c) **post-robot** — battle-tested but effectively deprecated, avoid; (d) **hand-roll** — ~100–150 lines, zero dependency on the trust boundary. _Current lean (subject to re-evaluation): Penpal for transport, or hand-roll if we want zero third-party code on the boundary — and in all cases origin verification + scope→method authorization stay in our own gateway, never delegated to the library._
- **Do developers pre-register an extension, or can any contract-satisfying URL be auto-registered with reactive blocking?** Options: (a) **Pre-registration / curated registry** (Facebook-style) — known origins drive a closed CSP `frame-src` allowlist, scope declarations are fixed and reviewable up front; (b) **Open auto-register by URL + reactive blocklist** — zero onboarding friction, but CSP can't be a closed allowlist and blocking is always after-the-fact; (c) **Hybrid** — minimal config-seeded registry now, open auto-register later. Note: registration ≠ trust — the real protection is sandbox + per-scope consent + the gateway (no token is ever issued, so a rogue extension only ever gets data the user explicitly granted). Key reframing: a closed CSP allowlist does **not** require developer pre-registration — the **user adding the extension URL is itself the registration**, so the `frame-src` allowlist can be built dynamically from origins users have actually added. _Current lean (subject to re-evaluation): favor **frictionless auto-register by URL** — no developer portal, the add action records the extension (id, origin URL, declared scopes, name/icon) and appends its origin to a dynamic CSP allowlist. This keeps the allowlist closed without onboarding friction, which is a real advantage in an era of AI-generated extensions where "spin up and try" matters. Pair it with a consent dialog that prominently shows the extension's origin, and a blocklist for the rogue tail. (This supersedes the earlier lean toward a config-seeded registry.)_
