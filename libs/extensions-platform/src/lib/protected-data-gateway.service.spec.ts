import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ConsentStore } from './consent-store.service';
import {
  CONTACT_PICKER,
  ContactPicker,
  GATEWAY_DATA_SOURCE,
  GatewayDataSource,
  RawContact,
} from './gateway-data-source';
import { BasicContactDto } from './gateway-methods';
import {
  GatewayDeniedError,
  ProtectedDataGateway,
} from './protected-data-gateway.service';
import { RpcDispatcher } from './rpc-dispatcher';
import { RPC_PROTOCOL_VERSION } from './models';

const USER = 'user-1';
const EXT = 'acme.app';

const PROFILE = { name: 'Ada Lovelace', gender: 'female' };
const OWN_DETAILS = { email: 'ada@example.com', phone: '+1 555 0100' };
const RAW_CONTACTS: RawContact[] = [
  {
    id: 'c1',
    names: 'Grace Hopper',
    roles: ['friend'],
    email: 'grace@example.com',
    phone: '+1 555 0101',
  },
  {
    id: 'c2',
    names: 'Alan Turing',
    roles: ['colleague'],
    phone: '+1 555 0102',
  },
];

let picked: BasicContactDto | undefined;

function configure(): {
  gateway: ProtectedDataGateway;
  consent: ConsentStore;
} {
  const dataSource: GatewayDataSource = {
    getProfile: async () => PROFILE,
    getOwnContactDetails: async () => OWN_DETAILS,
    listContacts: async () => RAW_CONTACTS,
  };
  const picker: ContactPicker = {
    pickOne: async () => picked,
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: GATEWAY_DATA_SOURCE, useValue: dataSource },
      { provide: CONTACT_PICKER, useValue: picker },
    ],
  });
  return {
    gateway: TestBed.inject(ProtectedDataGateway),
    consent: TestBed.inject(ConsentStore),
  };
}

describe('ProtectedDataGateway — scope enforcement', () => {
  let gateway: ProtectedDataGateway;
  let consent: ConsentStore;

  beforeEach(() => {
    ({ gateway, consent } = configure());
  });

  /**
   * specscore: https://specscore.md/features/protected-data-gateway
   * Verifies: protected-data-gateway#ac:granted-scope-returns-data
   */
  it('returns data when the required scope is granted', async () => {
    consent.recordGrant(USER, EXT, 'contacts:read');
    const result = await gateway.handle('contacts.list', {
      userId: USER,
      extId: EXT,
    });
    expect(result).toEqual([
      { id: 'c1', names: 'Grace Hopper', roles: ['friend'] },
      { id: 'c2', names: 'Alan Turing', roles: ['colleague'] },
    ]);
  });

  /**
   * Verifies: protected-data-gateway#ac:ungranted-scope-denied
   */
  it('denies when the scope was never granted', async () => {
    await expect(
      gateway.handle('profile.get', { userId: USER, extId: EXT }),
    ).rejects.toBeInstanceOf(GatewayDeniedError);
  });

  it('denies when the scope was declined', async () => {
    consent.recordDecline(USER, EXT, 'profile:read');
    await expect(
      gateway.handle('profile.get', { userId: USER, extId: EXT }),
    ).rejects.toBeInstanceOf(GatewayDeniedError);
  });

  /**
   * Verifies: protected-data-gateway#ac:revoked-scope-denied-on-next-call
   */
  it('denies on the next call after revocation (store re-read, not cached)', async () => {
    consent.recordGrant(USER, EXT, 'contacts:read');
    await expect(
      gateway.handle('contacts.list', { userId: USER, extId: EXT }),
    ).resolves.toBeTruthy();

    consent.revoke(USER, EXT, 'contacts:read');
    await expect(
      gateway.handle('contacts.list', { userId: USER, extId: EXT }),
    ).rejects.toBeInstanceOf(GatewayDeniedError);
  });

  it('isolates grants per (user, extension)', async () => {
    consent.recordGrant(USER, EXT, 'profile:read');
    await expect(
      gateway.handle('profile.get', { userId: USER, extId: 'other.app' }),
    ).rejects.toBeInstanceOf(GatewayDeniedError);
    await expect(
      gateway.handle('profile.get', { userId: 'user-2', extId: EXT }),
    ).rejects.toBeInstanceOf(GatewayDeniedError);
  });
});

describe('ProtectedDataGateway — unknown method', () => {
  let gateway: ProtectedDataGateway;

  beforeEach(() => {
    ({ gateway } = configure());
  });

  /**
   * Verifies: protected-data-gateway#ac:unknown-method-rejected
   */
  it('rejects a non-whitelisted method with no data', async () => {
    await expect(
      gateway.handle('files.write', { userId: USER, extId: EXT }),
    ).rejects.toBeInstanceOf(GatewayDeniedError);
  });
});

describe('ProtectedDataGateway — profile.get and contactDetails.get sanitization', () => {
  let gateway: ProtectedDataGateway;
  let consent: ConsentStore;

  beforeEach(() => {
    ({ gateway, consent } = configure());
  });

  /**
   * Verifies: protected-data-gateway#ac:results-limited-to-scope
   */
  it('returns only the scope-covered profile fields', async () => {
    consent.recordGrant(USER, EXT, 'profile:read');
    const result = await gateway.handle('profile.get', {
      userId: USER,
      extId: EXT,
    });
    expect(result).toEqual({ name: 'Ada Lovelace', gender: 'female' });
  });

  it('returns the user own contact details when granted', async () => {
    consent.recordGrant(USER, EXT, 'contact_details:read');
    const result = await gateway.handle('contactDetails.get', {
      userId: USER,
      extId: EXT,
    });
    expect(result).toEqual({
      email: 'ada@example.com',
      phone: '+1 555 0100',
    });
  });
});

describe('ProtectedDataGateway — contacts.pick (user-mediated)', () => {
  let gateway: ProtectedDataGateway;

  beforeEach(() => {
    ({ gateway } = configure());
  });

  /**
   * Verifies: protected-data-gateway#ac:contact-picker-permissionless
   */
  it('returns only the single picked contact basic fields, no scope required', async () => {
    picked = {
      id: 'c1',
      names: 'Grace Hopper',
      roles: ['friend'],
    };
    const result = await gateway.handle('contacts.pick', {
      userId: USER,
      extId: EXT,
    });
    expect(result).toEqual({
      id: 'c1',
      names: 'Grace Hopper',
      roles: ['friend'],
    });
  });

  it('denies when the user cancels the picker', async () => {
    picked = undefined;
    await expect(
      gateway.handle('contacts.pick', { userId: USER, extId: EXT }),
    ).rejects.toBeInstanceOf(GatewayDeniedError);
  });
});

describe('ProtectedDataGateway — contacts.list field-gating', () => {
  let gateway: ProtectedDataGateway;
  let consent: ConsentStore;

  beforeEach(() => {
    ({ gateway, consent } = configure());
  });

  /**
   * Verifies: protected-data-gateway#ac:contacts-details-field-gated
   */
  it('omits detail fields from every contact when contacts_details:read is NOT granted', async () => {
    consent.recordGrant(USER, EXT, 'contacts:read');
    const result = (await gateway.handle('contacts.list', {
      userId: USER,
      extId: EXT,
    })) as Record<string, unknown>[];
    for (const c of result) {
      expect(c).not.toHaveProperty('email');
      expect(c).not.toHaveProperty('phone');
    }
    expect(result).toEqual([
      { id: 'c1', names: 'Grace Hopper', roles: ['friend'] },
      { id: 'c2', names: 'Alan Turing', roles: ['colleague'] },
    ]);
  });

  it('includes detail fields when contacts_details:read IS also granted', async () => {
    consent.recordGrant(USER, EXT, 'contacts:read');
    consent.recordGrant(USER, EXT, 'contacts_details:read');
    const result = await gateway.handle('contacts.list', {
      userId: USER,
      extId: EXT,
    });
    expect(result).toEqual([
      {
        id: 'c1',
        names: 'Grace Hopper',
        roles: ['friend'],
        email: 'grace@example.com',
        phone: '+1 555 0101',
      },
      {
        id: 'c2',
        names: 'Alan Turing',
        roles: ['colleague'],
        phone: '+1 555 0102',
      },
    ]);
  });
});

describe('ProtectedDataGateway — RPC dispatch and credential-free payload', () => {
  let gateway: ProtectedDataGateway;
  let consent: ConsentStore;

  beforeEach(() => {
    ({ gateway, consent } = configure());
  });

  function dispatcherFor(): RpcDispatcher {
    return gateway.registerOn(new RpcDispatcher(), EXT, () => USER);
  }

  /**
   * Verifies: protected-data-gateway#ac:unknown-method-rejected
   */
  it('rejects an unregistered method over the RPC transport with no data', async () => {
    const res = await dispatcherFor().dispatch({
      v: RPC_PROTOCOL_VERSION,
      id: 'r1',
      type: 'evil.delete',
    });
    expect(res.ok).toBe(false);
    expect(res.result).toBeUndefined();
  });

  it('returns an error response (no data) when scope is ungranted', async () => {
    const res = await dispatcherFor().dispatch({
      v: RPC_PROTOCOL_VERSION,
      id: 'r2',
      type: 'profile.get',
    });
    expect(res.ok).toBe(false);
    expect(res.result).toBeUndefined();
  });

  /**
   * Verifies: protected-data-gateway#ac:no-credential-reaches-iframe
   */
  it('returns sanitized data with no credential in the payload', async () => {
    consent.recordGrant(USER, EXT, 'profile:read');
    consent.recordGrant(USER, EXT, 'contact_details:read');
    consent.recordGrant(USER, EXT, 'contacts:read');
    consent.recordGrant(USER, EXT, 'contacts_details:read');
    const dispatcher = dispatcherFor();

    const responses = [];
    for (const type of ['profile.get', 'contactDetails.get', 'contacts.list']) {
      responses.push(
        await dispatcher.dispatch({ v: RPC_PROTOCOL_VERSION, id: type, type }),
      );
    }
    const serialized = JSON.stringify(responses).toLowerCase();
    for (const forbidden of [
      'token',
      'idtoken',
      'apikey',
      'api_key',
      'secret',
      'credential',
      'password',
      'authorization',
      'firebase',
    ]) {
      expect(serialized).not.toContain(forbidden);
    }
    expect(responses.every((r) => r.ok)).toBe(true);
  });

  it('resolves the signed-in user at call time so a session change is observed', async () => {
    let currentUser = 'user-A';
    const dispatcher = gateway.registerOn(
      new RpcDispatcher(),
      EXT,
      () => currentUser,
    );
    consent.recordGrant('user-B', EXT, 'profile:read');

    const denied = await dispatcher.dispatch({
      v: RPC_PROTOCOL_VERSION,
      id: 'a',
      type: 'profile.get',
    });
    expect(denied.ok).toBe(false);

    currentUser = 'user-B';
    const allowed = await dispatcher.dispatch({
      v: RPC_PROTOCOL_VERSION,
      id: 'b',
      type: 'profile.get',
    });
    expect(allowed.ok).toBe(true);
  });
});

describe('ProtectedDataGateway — read-only invariant', () => {
  let gateway: ProtectedDataGateway;
  let consent: ConsentStore;

  beforeEach(() => {
    ({ gateway, consent } = configure());
  });

  /**
   * Verifies: protected-data-gateway#ac:no-mutation-surface
   */
  it('a registered dispatcher answers only the four read methods; any mutation verb errors with no data', async () => {
    consent.recordGrant(USER, EXT, 'profile:read');
    const dispatcher = gateway.registerOn(new RpcDispatcher(), EXT, () => USER);

    for (const verb of [
      'profile.set',
      'profile.update',
      'contacts.create',
      'contacts.delete',
      'contacts.update',
      'contactDetails.update',
    ]) {
      const res = await dispatcher.dispatch({
        v: RPC_PROTOCOL_VERSION,
        id: verb,
        type: verb,
      });
      expect(res.ok).toBe(false);
      expect(res.result).toBeUndefined();
    }
  });
});
