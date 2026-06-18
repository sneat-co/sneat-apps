---
format: https://specscore.md/features-index-specification
---

# Features

Feature specifications for this project.

## Index

| Feature                                                                            | Status   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [extract-listus-standalone-repo](extract-listus-standalone-repo/README.md)         | Approved | Move the listus extension out of sneat-apps into a dedicated AGPL-3.0 full-stack repo (github.com/sneat-co/listus) with an Nx/Angular frontend and a Go backend scaffold, publish it as @sneat/extension-listus, and rewire sneat-apps to consume it.                                                                                                                                                                                                                         |
| [extension-host-and-bridge](extension-host-and-bridge/README.md)                   | Approved | Sandboxed-iframe host and postMessage bridge that loads a third-party extension by URL, auto-registers it from its sneat-extension.json manifest, establishes an origin-verified MessageChannel RPC, and renders extension-contributed menu items into the host sub-menu — the shared foundation both untrusted and trusted extension classes build on.                                                                                                                       |
| [extension-consent-and-scopes](extension-consent-and-scopes/README.md)             | Approved | Per-scope consent model for extensions: a catalog of read-only scopes, a granular Facebook-style consent dialog that shows the extension origin and lets the user grant or decline each requested scope individually, per-(user,extension,scope) grant storage with immediate revoke, and incremental re-consent when an installed extension later requests new scopes. The grant store is the authoritative source the protected-data gateway consults.                      |
| [protected-data-gateway](protected-data-gateway/README.md)                         | Approved | Parent-side, scope-enforced gateway that answers an untrusted extension's read requests over the bridge: a fixed whitelist of read-only methods (profile.get, contactDetails.get, contacts.list) each mapped to one required scope, enforced against the consent store, executed with the user's own session, and returned as sanitized DTOs. The iframe never receives a credential.                                                                                         |
| [extension-permission-management-ui](extension-permission-management-ui/README.md) | Approved | A settings screen where the user reviews installed extensions (name, icon, origin), sees the scopes currently granted to each, revokes an individual scope, and removes an extension entirely (revoking all its scopes, deleting its registration, and dropping its origin from the dynamic frame-src allowlist).                                                                                                                                                             |
| [trusted-first-party-extensions](trusted-first-party-extensions/README.md)         | Approved | A statically-configured trusted-origin allowlist that designates first-party extensions (e.g. listus.app) as trusted: the parent hands the user's own Firebase ID token to a verified trusted iframe over the bridge (with refresh before expiry) so it uses Firestore + the Sneat API directly, bypassing the per-scope consent dialog and gateway. Untrusted origins never receive a token. Installing a trusted extension shows a one-time full-account-access disclosure. |

## Open Questions

None at this time.

---

_This document follows the https://specscore.md/features-index-specification_
