import { InjectionToken } from '@angular/core';
import {
  BasicContactDto,
  ContactDetailsDto,
  ProfileDto,
} from './gateway-methods';

/**
 * Credential-free read access to the signed-in user's own Sneat data, plus a
 * raw contact record the gateway sanitizes itself.
 *
 * The gateway executes ENTIRELY in the parent (sneat-app) context against the
 * existing Sneat data services using the user's own session. This token
 * abstracts those services so the app binds a Firestore-backed adapter while
 * tests provide an in-memory stub. The adapter returns plain data only — never a
 * token, Firebase credential, or service handle.
 *
 * Contact detail fields (`email`, `phone`) are returned alongside the basic
 * fields; the gateway strips them when `contacts_details:read` is not granted.
 *
 * specscore: https://specscore.md/features/protected-data-gateway
 * Verifies: protected-data-gateway#ac:no-credential-reaches-iframe
 * Verifies: protected-data-gateway#ac:results-limited-to-scope
 * Verifies: protected-data-gateway#ac:contacts-details-field-gated
 */

/** A contact as the data source returns it: basic fields plus raw details. */
export interface RawContact extends BasicContactDto {
  readonly email?: string;
  readonly phone?: string;
}

/** Read-only data access bound to the signed-in user's own session. */
export interface GatewayDataSource {
  /** The signed-in user's profile, already mapped to scope-covered fields. */
  getProfile(userId: string): Promise<ProfileDto>;
  /** The signed-in user's OWN contact details. */
  getOwnContactDetails(userId: string): Promise<ContactDetailsDto>;
  /** The signed-in user's contacts, each with raw (ungated) detail fields. */
  listContacts(userId: string): Promise<readonly RawContact[]>;
}

/** DI token for the credential-free data source. */
export const GATEWAY_DATA_SOURCE = new InjectionToken<GatewayDataSource>(
  'GATEWAY_DATA_SOURCE',
);

/**
 * A parent-side single-selection contact picker. The picker UI enforces that the
 * user selects exactly one contact; it resolves with that one contact or
 * `undefined` if the user cancels. Requires no scope.
 */
export interface ContactPicker {
  pickOne(userId: string): Promise<BasicContactDto | undefined>;
}

/** DI token for the user-mediated contact picker. */
export const CONTACT_PICKER = new InjectionToken<ContactPicker>(
  'CONTACT_PICKER',
);
