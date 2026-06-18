---
format: https://specscore.md/feature-specification
status: In Review
---

# Feature: Protected-Data Gateway

> [SpecScore.**Studio**](https://specscore.studio): | [Explore](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/protected-data-gateway?op=explore) | [Edit](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/protected-data-gateway?op=edit) | [Ask question](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/protected-data-gateway?op=ask) | [Request change](https://specscore.studio/app/github.com/sneat-co/sneat-apps/spec/features/protected-data-gateway?op=request-change) |
**Status:** In Review
**Source Ideas:** third-party-extension-platform

## Summary

Parent-side, scope-enforced gateway that answers an untrusted extension's read requests over the bridge: a fixed whitelist of read-only methods (profile.get, contactDetails.get, contacts.list) each mapped to one required scope, enforced against the consent store, executed with the user's own session, and returned as sanitized DTOs. The iframe never receives a credential.

## Problem

An untrusted extension must be able to read the user's Sneat data it was granted — but never hold a Sneat credential or reach data it wasn't granted. This Feature is the single choke point that makes that possible: a parent-side gateway that answers the extension's read requests arriving over the bridge (Host & Bridge Feature), enforces the user's consent decisions (Consent & Scopes Feature), executes against existing Sneat data services using the signed-in user's own session, and returns only sanitized, scope-limited results. It serves the **untrusted** class only; trusted first-party extensions use the Firebase token directly and do not go through this gateway (Trusted First-Party Extensions Feature). Per the source Idea, the MVP gateway is read-only.

## Behavior

### Method Whitelist

#### REQ: method-scope-map

The gateway exposes a fixed whitelist of read-only data methods, each mapped to exactly one required scope:

- `profile.get` → requires `profile:read` → returns the signed-in user's profile (e.g. name, gender);
- `contactDetails.get` → requires `contact_details:read` → returns the signed-in user's own contact details (e.g. email, phone);
- `contacts.list` → requires `contacts:read` → returns the signed-in user's contacts (each with name and contact details).

A bridge request naming any method not on this whitelist is rejected with an error and returns no data.

### Scope Enforcement

#### REQ: scope-enforcement

For every data-method call, the gateway resolves the calling extension and the signed-in user, looks up the method's required scope, and consults the consent store (Consent & Scopes Feature) as the authoritative source of truth. It executes and returns data ONLY if that scope is currently granted for that `(user, extension)`. If the scope is not currently granted — never granted, declined, or revoked — the call is denied with an error and no data is returned.

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

Scenario: The three MVP methods map to their required scopes
Given the gateway method whitelist
When it is inspected
Then it contains exactly `profile.get` (requires `profile:read`), `contactDetails.get` (requires `contact_details:read`), and `contacts.list` (requires `contacts:read`), all read-only.
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

- **Contact-detail granularity:** `contacts.list` currently returns each contact with their name and contact details under the single `contacts:read` scope. Should a contact's email/phone require a finer scope than the contact list itself? MVP keeps it coarse (`contacts:read` includes contacts' details); revisit if finer control is wanted.
- **Response DTO shapes:** the exact fields returned by each method (and `contacts.list` pagination for large address books) are pinned at Plan time.
- **Rehearse stubs:** all eight ACs are testable (method-registry inspection, bridge request/response with granted vs. ungranted/revoked scopes, payload shape assertions); `_tests/` stubs are deferred to the Plan.

---
*This document follows the https://specscore.md/feature-specification*
