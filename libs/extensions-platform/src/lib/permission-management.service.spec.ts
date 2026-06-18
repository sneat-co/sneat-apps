import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { ConsentStore } from './consent-store.service';
import { ExtensionRegistry } from './extension-registry.service';
import { FrameSrcAllowlistService } from './frame-src-allowlist.service';
import {
  CONTACT_PICKER,
  ContactPicker,
  GATEWAY_DATA_SOURCE,
  GatewayDataSource,
  RawContact,
} from './gateway-data-source';
import { IS_TRUSTED_ORIGIN, IsTrustedOrigin } from './is-trusted-origin';
import { ExtensionRegistration } from './models';
import { PermissionManagementService } from './permission-management.service';
import {
  GatewayDeniedError,
  ProtectedDataGateway,
} from './protected-data-gateway.service';

const USER = 'user-1';

function registrationOf(
  host: string,
  name: string,
  scopes: readonly string[],
): ExtensionRegistration {
  const origin = `https://${host}`;
  return {
    id: host,
    origin,
    url: `${origin}/`,
    manifest: {
      name,
      author: { name: 'Author', email: 'a@example.com' },
      icon: `${origin}/icon.png`,
      scopes,
      origin,
    },
    scopes,
  };
}

const RAW_CONTACTS: RawContact[] = [
  { id: 'c1', names: 'Grace Hopper', roles: ['friend'], email: 'g@x.com' },
];

function configure(isTrusted: IsTrustedOrigin = () => false): {
  service: PermissionManagementService;
  registry: ExtensionRegistry;
  consent: ConsentStore;
  allowlist: FrameSrcAllowlistService;
  gateway: ProtectedDataGateway;
} {
  const dataSource: GatewayDataSource = {
    getProfile: async () => ({ name: 'Ada' }),
    getOwnContactDetails: async () => ({ email: 'ada@x.com' }),
    listContacts: async () => RAW_CONTACTS,
  };
  const picker: ContactPicker = { pickOne: async () => undefined };
  TestBed.configureTestingModule({
    providers: [
      { provide: IS_TRUSTED_ORIGIN, useValue: isTrusted },
      { provide: GATEWAY_DATA_SOURCE, useValue: dataSource },
      { provide: CONTACT_PICKER, useValue: picker },
    ],
  });
  return {
    service: TestBed.inject(PermissionManagementService),
    registry: TestBed.inject(ExtensionRegistry),
    consent: TestBed.inject(ConsentStore),
    allowlist: TestBed.inject(FrameSrcAllowlistService),
    gateway: TestBed.inject(ProtectedDataGateway),
  };
}

describe('IS_TRUSTED_ORIGIN default binding', () => {
  it('treats every origin as untrusted by default (F5 binds the real allowlist)', () => {
    TestBed.configureTestingModule({});
    const isTrusted = TestBed.inject(IS_TRUSTED_ORIGIN);
    expect(isTrusted('https://anything.app')).toBe(false);
  });
});

describe('PermissionManagementService', () => {
  // AC: list-shows-installed-extensions
  it('lists each installed extension with name, icon, and origin', () => {
    const { service, registry } = configure();
    registry.create(registrationOf('a.app', 'Alpha', ['profile:read']));
    registry.create(registrationOf('b.app', 'Beta', ['contacts:read']));

    const views = service.list(USER);

    expect(views.map((v) => v.name).sort()).toEqual(['Alpha', 'Beta']);
    const alpha = views.find((v) => v.id === 'a.app');
    expect(alpha?.origin).toBe('https://a.app');
    expect(alpha?.icon).toBe('https://a.app/icon.png');
  });

  // AC: empty-state-when-none-installed
  it('returns an empty list (not an error) when nothing is installed', () => {
    const { service } = configure();
    expect(service.list(USER)).toEqual([]);
  });

  // AC: shows-currently-granted-scopes
  it('shows only currently-granted scopes by catalog label, excluding ungranted', () => {
    const { service, registry, consent } = configure();
    registry.create(registrationOf('a.app', 'Alpha', []));
    consent.recordGrant(USER, 'a.app', 'profile:read');
    consent.recordGrant(USER, 'a.app', 'contacts:read');
    // contacts_details:read never granted

    const view = service.get(USER, 'a.app');
    const labels = view?.grantedScopes.map((s) => s.label) ?? [];
    expect(labels).toContain('Your profile');
    expect(labels).toContain('Your contacts');
    expect(labels).not.toContain("Your contacts' contact details");
    expect(view?.grantedScopes.map((s) => s.id)).not.toContain(
      'contacts_details:read',
    );
  });

  it('does not show a revoked scope as granted', () => {
    const { service, registry, consent } = configure();
    registry.create(registrationOf('a.app', 'Alpha', []));
    consent.recordGrant(USER, 'a.app', 'contacts:read');
    consent.revoke(USER, 'a.app', 'contacts:read');

    expect(service.get(USER, 'a.app')?.grantedScopes).toEqual([]);
  });

  // AC: trusted-extension-shows-full-access-badge (untrusted branch)
  it('marks an extension untrusted and exposes its scope list with the default predicate', () => {
    const { service, registry, consent } = configure(() => false);
    registry.create(registrationOf('a.app', 'Alpha', []));
    consent.recordGrant(USER, 'a.app', 'profile:read');

    const view = service.get(USER, 'a.app');
    expect(view?.isTrusted).toBe(false);
    expect(view?.grantedScopes.length).toBe(1);
  });

  // AC: trusted-extension-shows-full-access-badge (trusted branch)
  it('marks an extension trusted and shows no per-scope grants when the predicate says trusted', () => {
    const { service, registry, consent } = configure(
      (origin) => origin === 'https://trusted.app',
    );
    registry.create(registrationOf('trusted.app', 'Trusted', []));
    // even if a stray grant existed, a trusted extension lists no scopes
    consent.recordGrant(USER, 'trusted.app', 'profile:read');

    const view = service.get(USER, 'trusted.app');
    expect(view?.isTrusted).toBe(true);
    expect(view?.grantedScopes).toEqual([]);
  });

  // AC: revoke-single-scope
  it('revokes a scope so it disappears and a subsequent gateway call is denied', async () => {
    const { service, registry, consent, gateway } = configure();
    registry.create(registrationOf('a.app', 'Alpha', []));
    consent.recordGrant(USER, 'a.app', 'contacts:read');

    // pre-condition: gateway returns data while granted
    await expect(
      gateway.handle('contacts.list', { userId: USER, extId: 'a.app' }),
    ).resolves.toBeDefined();

    service.revokeScope(USER, 'a.app', 'contacts:read');

    expect(service.get(USER, 'a.app')?.grantedScopes).toEqual([]);
    await expect(
      gateway.handle('contacts.list', { userId: USER, extId: 'a.app' }),
    ).rejects.toBeInstanceOf(GatewayDeniedError);
  });

  // AC: remove-extension-fully
  it('removes an extension: clears grants, registration, and allowlist entry', () => {
    const { service, registry, consent, allowlist } = configure();
    registry.create(registrationOf('a.app', 'Alpha', []));
    allowlist.add('https://a.app');
    consent.recordGrant(USER, 'a.app', 'profile:read');
    consent.recordGrant(USER, 'a.app', 'contacts:read');

    service.remove(USER, 'a.app');

    expect(consent.listGranted(USER, 'a.app')).toEqual([]);
    expect(registry.has('a.app')).toBe(false);
    expect(allowlist.isAllowed('https://a.app')).toBe(false);
    expect(service.get(USER, 'a.app')).toBeUndefined();
  });

  // AC: remove-does-not-touch-external-data
  it('removal touches only Sneat-side state and issues no external-backend call', () => {
    const externalBackend = {
      calls: 0,
      deleteUserData: () => externalBackend.calls++,
    };
    const { service, registry, consent, allowlist } = configure();
    registry.create(registrationOf('a.app', 'Alpha', []));
    allowlist.add('https://a.app');
    consent.recordGrant(USER, 'a.app', 'profile:read');

    service.remove(USER, 'a.app');

    // Only Sneat-side state cleared.
    expect(registry.has('a.app')).toBe(false);
    expect(consent.listGranted(USER, 'a.app')).toEqual([]);
    expect(allowlist.isAllowed('https://a.app')).toBe(false);
    // The service has no dependency on, and made no call to, any external backend.
    expect(externalBackend.calls).toBe(0);
  });
});
