---
format: https://specscore.md/feature-specification
status: Approved
---

# Feature: Protected-Data Gateway

> [SpecScore.**Studio**](https://specscore.studio): | [Explore](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/protected-data-gateway?op=explore) | [Edit](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/protected-data-gateway?op=edit) | [Ask question](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/protected-data-gateway?op=ask) | [Request change](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/protected-data-gateway?op=request-change) |
**Status:** Approved
**Source Ideas:** third-party-extension-platform
**Grade:** B

## Summary

Parent-side, scope-enforced gateway that answers an untrusted extension's read requests over the bridge: a fixed whitelist of read-only methods — `profile.get`, `contactDetails.get`, a permissionless user-mediated `contacts.pick`, and `contacts.list` (with each contact's details field-gated behind `contacts_details:read`) — enforced against the consent store, executed with the user's own session, and returned as sanitized DTOs. The iframe never receives a credential.

## Problem

An untrusted extension must be able to read the user's Sneat data it was granted — but never hold a Sneat credential or reach data it wasn't granted. This Feature is the single choke point that makes that possible: a parent-side gateway that answers the extension's read requests arriving over the bridge (Host & Bridge Feature), enforces the user's consent decisions (Consent & Scopes Feature), executes against existing Sneat data services using the signed-in user's own session, and returns only sanitized, scope-limited results. It serves the **untrusted** class only; trusted first-party extensions use the Firebase token directly and do not go through this gateway (Trusted First-Party Extensions Feature). Per the source Idea, the MVP gateway is read-only.

## Behavior

### Method Whitelist

#### REQ: method-scope-map

The gateway exposes a fixed whitelist of read-only data methods. Each method either requires a mapped scope, or is **user-mediated** (the user explicitly selects the single item returned, so no scope is required). MVP methods:

- `profile.get` → requires `profile:read` → returns the signed-in user's profile (e.g. name, gender);
- `contactDetails.get` → requires `contact_details:read` → returns the signed-in user's OWN contact details (e.g. email, phone);
- `contacts.pick` → **no scope required** (user-mediated picker) → opens a contact picker; the picker UI enforces single selection, so the user selects exactly one contact and the extension receives only that contact's basic fields `{ id, names, roles }`. Because the user explicitly picks the single contact returned, no consent scope is needed and no other contact is exposed;
- `contacts.list` → requires `contacts:read` → enumerates all the user's contacts as basic `{ id, names, roles }`. Each contact's additional details (email, phone, …) are included ONLY when `contacts_details:read` is also granted; otherwise those detail fields are omitted from every contact.

A bridge request naming any method not on this whitelist is rejected with an error and returns no data. Field-level gating (here, `contacts_details:read` on `contacts.list`) is enforced the same way as method-level scopes: the consent store is consulted and ungranted fields are omitted, never defaulted in.

### Scope Enforcement

#### REQ: scope-enforcement

For every scope-gated data-method call, the gateway resolves the calling extension and the signed-in user, looks up the method's required scope, and consults the consent store (Consent & Scopes Feature) as the authoritative source of truth. It executes and returns data ONLY if that scope is currently granted for that `(user, extension)`. If the scope is not currently granted — never granted, declined, or revoked — the call is denied with an error and no data is returned.

A **user-mediated** method (e.g. `contacts.pick`) is exempt from scope lookup: it requires no grant because the user explicitly selects the single item returned and only basic fields (`{ id, names, roles }`) are exposed. A user-mediated method is never used to enumerate data the user did not pick.

### Credential-Free Execution

#### REQ: parent-side-execution

The gateway runs entirely in the parent (sneat-app) context and executes against existing Sneat data services using the signed-in user's existing session. The untrusted extension never receives a token, Firebase credential, or raw service handle — only the sanitized result, or an error, travels back over the bridge.

### Result Sanitization

#### REQ: sanitized-results

The gateway returns only the fields that the granted scope covers, as explicit response DTOs. It does not pass through raw internal records, system/audit fields, or any data beyond the scope. Each method has a defined response shape.

### Read-Only

#### REQ: read-only-gateway

Every MVP gateway method is read-only. The gateway exposes no method that creates, updates, or deletes Sneat data; there is no write/mutation surface for protected data in the MVP.

## Dependencies

- extension-host-and-bridge
- extension-consent-and-scopes

## Acceptance Criteria

### AC: whitelisted-methods-mapped-to-scopes

Scenario: The MVP methods map to their required scopes
Given the gateway method whitelist
When it is inspected
Then it contains exactly `profile.get` (requires `profile:read`), `contactDetails.get` (requires `contact_details:read`), `contacts.pick` (no scope; user-mediated), and `contacts.list` (requires `contacts:read`, with `contacts_details:read` gating each contact's details), all read-only.
Verifies REQ: method-scope-map

### AC: contact-picker-permissionless

Scenario: The picker returns one user-chosen contact without any scope
Given an extension that has been granted no contacts scopes
When it calls `contacts.pick` and the user selects one contact
Then the extension receives only that contact's basic fields `{ id, names, roles }`, no other contact is exposed, and no scope was required.
Verifies REQ: method-scope-map

### AC: contacts-details-field-gated

Scenario: Contact details are gated by a second scope
Given an extension granted `contacts:read` but NOT `contacts_details:read`
When it calls `contacts.list`
Then every contact is returned as basic `{ id, names, roles }` with email/phone omitted; and when `contacts_details:read` is also granted, those detail fields are included.
Verifies REQ: method-scope-map

### AC: unknown-method-rejected

Scenario: A non-whitelisted method is refused
Given an established bridge to an extension
When the extension calls a method that is not on the gateway whitelist
Then the gateway returns an error and no data.
Verifies REQ: method-scope-map

### AC: granted-scope-returns-data

Scenario: A granted scope yields its data
Given an extension granted `contacts:read` by the signed-in user
When the extension calls `contacts.list` over the bridge
Then the gateway returns the user's contacts.
Verifies REQ: scope-enforcement

### AC: ungranted-scope-denied

Scenario: An ungranted scope is denied
Given an extension that has NOT been granted `profile:read`
When the extension calls `profile.get`
Then the gateway denies the call with an error and returns no profile data.
Verifies REQ: scope-enforcement

### AC: revoked-scope-denied-on-next-call

Scenario: Revocation blocks the next call
Given an extension previously granted `contacts:read` that has since been revoked
When the extension next calls `contacts.list`
Then the gateway consults the consent store, finds the scope not granted, and denies the call.
Verifies REQ: scope-enforcement

### AC: no-credential-reaches-iframe

Scenario: The extension never receives a credential
Given an extension making any successful gateway call
When the result is returned over the bridge
Then the payload contains only the sanitized data and no token, Firebase credential, or service handle.
Verifies REQ: parent-side-execution

### AC: results-limited-to-scope

Scenario: Results are sanitized to the scope's fields
Given an extension granted `profile:read`
When it calls `profile.get`
Then the response contains only the profile fields the scope covers and no raw internal record, system/audit fields, or out-of-scope data.
Verifies REQ: sanitized-results

### AC: no-mutation-surface

Scenario: There is no way to write protected data
Given the gateway method whitelist
When it is inspected for create/update/delete operations on Sneat data
Then no such method exists; every method is read-only.
Verifies REQ: read-only-gateway

## Open Questions

- **Contact access model (decided):** three tiers — `contacts.pick` (no scope; user-mediated; basic `{ id, names, roles }` of one picked contact), `contacts:read` (enumerate all contacts as basic `{ id, names, roles }`), and `contacts_details:read` (adds each contact's email/phone, …). `contact_details:read` remains the user's OWN details and is separate.
- **Response DTO shapes:** the exact basic vs. detail field sets per method, and `contacts.list` pagination for large address books, are pinned at Plan time. A `contacts.get(id)`-style detail fetch for an already-picked contact is a possible future addition, not MVP.
- **Rehearse stubs:** all ten ACs are testable (method-registry inspection, the user-mediated picker flow, bridge request/response with granted vs. ungranted/revoked scopes, and field-gating/payload-shape assertions); `_tests/` stubs are deferred to the Plan.

---
*This document follows the https://specscore.md/feature-specification*
