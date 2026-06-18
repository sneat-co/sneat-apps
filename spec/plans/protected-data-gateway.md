---
format: https://specscore.md/plan-specification
status: Implemented
---

# Plan: Protected Data Gateway

**Status:** Implemented
**Source Feature:** protected-data-gateway
**Date:** 2026-06-18
**Owner:** alex
**Supersedes:** —
**Parent:** platform
**Grade:** A

## Summary

This plan implements the parent-side, scope-enforced read gateway that answers an untrusted extension's data requests arriving over the bridge. It adds a gateway module to `libs/extensions-platform` that exposes a fixed whitelist of read-only methods (`profile.get`, `contactDetails.get`, the user-mediated `contacts.pick`, and `contacts.list`), enforces each method's required scope against the Consent & Scopes grant store as the source of truth, executes against existing Sneat data services using the signed-in user's own session, and returns sanitized response DTOs over the bridge. The iframe never receives a token, Firebase credential, or raw service handle — only sanitized data or an error.

## Approach

The gateway rides entirely on the foundation: it consumes F1's origin-verified `MessageChannel` RPC and versioned envelope (extension-host-and-bridge Tasks 6–7) to receive requests and resolve the calling extension, and it consults F2's `(user, extension, scope)` grant store (extension-consent-and-scopes, REQ: consent-source-of-truth) on every scope-gated call — never re-implementing either. Decomposition is bottom-up: first the method↔scope registry and response DTO contracts (the read-only whitelist that every other task references), then the scope-enforcement core that consults the consent store, then the credential-free executor that binds methods to existing Sneat data services and dispatches incoming bridge requests, then the per-method handlers (profile, own contact details, the user-mediated picker, and contacts enumeration with field-gating), and finally cross-cutting verification of credential-free payloads and the read-only/no-mutation invariant. Ordering is driven by data dependency: registry → enforcement → executor/dispatch → method handlers → cross-cutting invariants.

## Tasks

### Task 1: Method whitelist, scope map, and response DTOs

**Verifies:** protected-data-gateway#ac:whitelisted-methods-mapped-to-scopes
**Verifies:** protected-data-gateway#ac:no-mutation-surface
**Depends-On:** —

**Status:** done

In `libs/extensions-platform`, define the fixed read-only method registry mapping exactly `profile.get`→`profile:read`, `contactDetails.get`→`contact_details:read`, `contacts.pick`→user-mediated (no scope), and `contacts.list`→`contacts:read` (with `contacts_details:read` field-gating), plus the explicit per-method response DTO shapes (profile fields; own contact details; basic contact `{ id, names, roles }`; contact-with-optional-details). The registry contains no create/update/delete entry, establishing the no-mutation surface.

### Task 2: Scope-enforcement core against the consent store

**Verifies:** protected-data-gateway#ac:granted-scope-returns-data
**Verifies:** protected-data-gateway#ac:ungranted-scope-denied
**Verifies:** protected-data-gateway#ac:revoked-scope-denied-on-next-call
**Depends-On:** 1

**Status:** done

Implement the enforcement core that, for a scope-gated method call, resolves the calling extension (from F1's origin-verified bridge) and the signed-in user, looks up the method's required scope (Task 1), and consults F2's consent grant store (extension-consent-and-scopes REQ: consent-source-of-truth) on every call; it returns data only when the scope is currently granted and denies with an error when never-granted, declined, or revoked (revocation is observed because the store is re-read per call, never cached).

### Task 3: Credential-free request dispatcher and data-service binding

**Verifies:** protected-data-gateway#ac:unknown-method-rejected
**Verifies:** protected-data-gateway#ac:no-credential-reaches-iframe
**Depends-On:** 1, 2

**Status:** done

Register a gateway handler on F1's RPC transport (extension-host-and-bridge Task 7) that dispatches an incoming envelope to a whitelisted method, rejecting any non-whitelisted method name with an error and no data; methods execute in the parent (sneat-app) context against existing Sneat data services using the signed-in user's own session, and only sanitized DTOs or an error are written back over the port — never a token, Firebase credential, or service handle.

### Task 4: profile.get and contactDetails.get handlers with sanitization

**Verifies:** protected-data-gateway#ac:results-limited-to-scope
**Depends-On:** 2, 3

**Status:** done

Implement the `profile.get` (scope `profile:read`) and `contactDetails.get` (scope `contact_details:read`) handlers that fetch the signed-in user's profile / own contact details from the existing Sneat services and map them into their Task 1 DTOs, returning only the scope-covered fields and omitting raw internal records and system/audit fields.

### Task 5: User-mediated contacts.pick handler

**Verifies:** protected-data-gateway#ac:contact-picker-permissionless
**Depends-On:** 3

**Status:** done

Implement `contacts.pick` as a parent-side single-selection contact picker that requires no scope lookup: the picker UI enforces selecting exactly one contact and the gateway returns only that one contact's basic `{ id, names, roles }`, exposing no other contact.

### Task 6: contacts.list enumeration with details field-gating

**Verifies:** protected-data-gateway#ac:contacts-details-field-gated
**Depends-On:** 2, 3

**Status:** done

Implement `contacts.list` (scope `contacts:read`) that enumerates the user's contacts as basic `{ id, names, roles }`, then consults the consent store for `contacts_details:read` and includes each contact's email/phone detail fields only when that second scope is granted, omitting them from every contact otherwise (never defaulted in). Pagination of large address books is out of MVP scope (no AC asserts it); the method returns the full basic list — revisit pagination only if real address-book sizes demand it.

## Open Questions

None at this time.

---

_This document follows the https://specscore.md/plan-specification_
