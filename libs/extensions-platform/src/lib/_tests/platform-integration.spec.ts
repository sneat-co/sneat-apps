import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { PortLike } from '../bridge-host';
import { ConsentStore } from '../consent-store.service';
import {
  CONSENT_DIALOG_PRESENTER,
  ConsentDialogPresenter,
} from '../consent-flow.service';
import { ExtensionRegistry } from '../extension-registry.service';
import { FrameSrcAllowlistService } from '../frame-src-allowlist.service';
import { ExtensionManifest } from '../models';
import {
  CONTACT_PICKER,
  GATEWAY_DATA_SOURCE,
  GatewayDataSource,
} from '../gateway-data-source';
import { IS_TRUSTED_ORIGIN } from '../is-trusted-origin';
import { PermissionManagementService } from '../permission-management.service';
import {
  GatewayDeniedError,
  ProtectedDataGateway,
} from '../protected-data-gateway.service';
import { RpcDispatcher } from '../rpc-dispatcher';
import {
  FirebaseIdToken,
  TRUSTED_TOKEN_MESSAGE,
  TRUSTED_TOKEN_SOURCE,
} from '../token-handoff.service';
import { TrustedBridgeAttachService } from '../trusted-bridge-attach.service';
import {
  FULL_ACCESS_DISCLOSURE_PRESENTER,
  FullAccessDisclosurePresenter,
  TrustedInstallFlowService,
} from '../trusted-install-flow.service';
import { provideTrustedOrigins } from '../trusted-origin-allowlist';

/**
 * Task 7 cross-wave integration: composes the REAL F1–F5 public services across
 * the four couplings the master plan requires together but that no single child
 * plan's unit tests exercise as one wired-up flow. Stubs are limited to the
 * credential-free DI seams the platform is designed to inject (data source,
 * token source, dialog/disclosure presenters).
 *
 * specscore: https://specscore.md/features/extension-platform
 */

const TRUSTED_ORIGIN = 'https://listus.app'; // member of the real F5 allowlist.
const TRUSTED_ID = 'listus.app';
const UNTRUSTED_ORIGIN = 'https://acme.example'; // NOT allowlisted.
const UNTRUSTED_ID = 'acme.example';
const USER = 'user-1';

/** A static manifest served over https for the add-by-URL flow. */
function manifestFor(
  origin: string,
  scopes: readonly string[],
  name: string,
): ExtensionManifest {
  return {
    name,
    author: { name: 'Jane', email: 'jane@example.com' },
    icon: `${origin}/icon.png`,
    scopes,
    origin,
  };
}

function okResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as unknown as Response;
}

function fakePort(record: unknown[]): PortLike {
  return {
    postMessage: (m) => record.push(m),
    start: vi.fn(),
    onmessage: null,
    close: vi.fn(),
  };
}

/** In-memory credential-free data source — returns plain DTOs only, never a token. */
const DATA_SOURCE: GatewayDataSource = {
  getProfile: async () => ({ name: 'Alex' }),
  getOwnContactDetails: async () => ({ email: 'alex@example.com' }),
  listContacts: async () => [
    { id: 'c1', names: 'Bob', roles: ['friend'], email: 'bob@x.test' },
  ],
};

describe('Extension platform — cross-wave integration (Task 7)', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    document.getElementById('sneat-ext-frame-src-csp')?.remove();
  });

  afterEach(() => vi.restoreAllMocks());

  // (a) Untrusted demo end-to-end: install fork -> F2 per-scope consent ->
  // F3 gateway returns only consented data, denies the ungranted scope, and
  // hands no credential to the untrusted extension.
  it('(a) untrusted: install -> consent grants one scope -> gateway returns only consented data, denies the rest, leaks no credential', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      okResponse(
        manifestFor(
          UNTRUSTED_ORIGIN,
          ['contacts:read', 'profile:read'],
          'Acme',
        ),
      ),
    );
    // User grants contacts:read, declines profile:read.
    const consentDialog: ConsentDialogPresenter = {
      present: async () => ({
        decisions: [
          { scope: 'contacts:read', granted: true },
          { scope: 'profile:read', granted: false },
        ],
      }),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: CONSENT_DIALOG_PRESENTER, useValue: consentDialog },
        { provide: GATEWAY_DATA_SOURCE, useValue: DATA_SOURCE },
        { provide: CONTACT_PICKER, useValue: {} },
        // Disclosure presenter would only fire for a trusted origin; bind a
        // throwing stub to assert it never runs on the untrusted path.
        {
          provide: FULL_ACCESS_DISCLOSURE_PRESENTER,
          useValue: {
            present: vi.fn(() => {
              throw new Error('disclosure must not run for untrusted origin');
            }),
          } as FullAccessDisclosurePresenter,
        },
      ],
    });

    const install = TestBed.inject(TrustedInstallFlowService);
    const gateway = TestBed.inject(ProtectedDataGateway);

    const outcome = await install.install(UNTRUSTED_ORIGIN, {
      userId: USER,
      extensionName: 'Acme',
    });
    expect(outcome.ok).toBe(true);
    if (outcome.ok) expect(outcome.trusted).toBe(false);

    // Granted scope flows through F3 and returns sanitized data only.
    const contacts = (await gateway.handle('contacts.list', {
      userId: USER,
      extId: UNTRUSTED_ID,
    })) as Array<Record<string, unknown>>;
    expect(contacts).toHaveLength(1);
    // contacts_details:read was never granted -> detail fields stripped.
    expect(contacts[0]).toEqual({ id: 'c1', names: 'Bob', roles: ['friend'] });

    // Ungranted scope (profile:read declined) is denied with no data.
    await expect(
      gateway.handle('profile.get', { userId: USER, extId: UNTRUSTED_ID }),
    ).rejects.toBeInstanceOf(GatewayDeniedError);

    // No token/credential is ever produced for the untrusted extension: the
    // gateway returns plain DTOs and TRUSTED_TOKEN_SOURCE is not even bound.
    const returned = JSON.stringify(contacts);
    for (const forbidden of [
      'token',
      'idtoken',
      'credential',
      'apikey',
      'secret',
    ]) {
      expect(returned.toLowerCase()).not.toContain(forbidden);
    }
  });

  // (b) F4 badge vs F5 real allowlist: with provideTrustedOrigins() bound to
  // IS_TRUSTED_ORIGIN, an allowlisted origin reports full-access (badge, no
  // scope list) and a non-allowlisted origin reports per-scope.
  it('(b) PermissionManagementService: real F5 allowlist drives the trusted badge vs per-scope discrimination', () => {
    TestBed.configureTestingModule({ providers: [provideTrustedOrigins()] });

    // Sanity: the real predicate is bound, not F4's safe default.
    const predicate = TestBed.inject(IS_TRUSTED_ORIGIN);
    expect(predicate(TRUSTED_ORIGIN)).toBe(true);
    expect(predicate(UNTRUSTED_ORIGIN)).toBe(false);

    const registry = TestBed.inject(ExtensionRegistry);
    const consent = TestBed.inject(ConsentStore);
    const perms = TestBed.inject(PermissionManagementService);

    registry.create({
      id: TRUSTED_ID,
      origin: TRUSTED_ORIGIN,
      url: TRUSTED_ORIGIN,
      manifest: manifestFor(TRUSTED_ORIGIN, [], 'Listus'),
      scopes: [],
    });
    registry.create({
      id: UNTRUSTED_ID,
      origin: UNTRUSTED_ORIGIN,
      url: UNTRUSTED_ORIGIN,
      manifest: manifestFor(UNTRUSTED_ORIGIN, ['contacts:read'], 'Acme'),
      scopes: ['contacts:read'],
    });
    consent.recordGrant(USER, UNTRUSTED_ID, 'contacts:read');

    const trusted = perms.get(USER, TRUSTED_ID);
    expect(trusted?.isTrusted).toBe(true);
    expect(trusted?.grantedScopes).toEqual([]); // badge, not a scope list.

    const untrusted = perms.get(USER, UNTRUSTED_ID);
    expect(untrusted?.isTrusted).toBe(false);
    expect(untrusted?.grantedScopes.map((s) => s.id)).toEqual([
      'contacts:read',
    ]);
  });

  // (c) Trusted token-handoff smoke: a trusted origin goes through the trusted
  // attach path, receives the Firebase token over the verified port, and the
  // gateway enforcement handler is NOT registered (full bypass).
  it('(c) trusted attach: token delivered over the verified port; gateway handler NOT registered', async () => {
    const token: FirebaseIdToken = {
      token: 'firebase-id-token',
      expiresAt: Date.now() + 3_600_000,
    };
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TRUSTED_TOKEN_SOURCE,
          useValue: { getIdToken: async () => token },
        },
        { provide: GATEWAY_DATA_SOURCE, useValue: DATA_SOURCE },
        { provide: CONTACT_PICKER, useValue: {} },
      ],
    });

    const attach = TestBed.inject(TrustedBridgeAttachService);
    const inbox: unknown[] = [];
    const dispatcher = new RpcDispatcher();
    const registerSpy = vi.spyOn(dispatcher, 'register');

    const kind = await attach.attach({
      verifiedOrigin: TRUSTED_ORIGIN,
      extId: TRUSTED_ID,
      resolveUserId: () => USER,
      port: fakePort(inbox),
      dispatcher,
    });

    expect(kind).toBe('trusted-token');
    expect(inbox).toContainEqual(
      expect.objectContaining({
        type: TRUSTED_TOKEN_MESSAGE,
        token: token.token,
      }),
    );
    // Bypass: no gateway method handler is registered on the trusted iframe.
    expect(registerSpy).not.toHaveBeenCalled();
  });

  // (d) Install-time fork routing: a trusted origin goes to F5's full-access
  // disclosure (decline aborts with nothing recorded); an untrusted origin
  // goes to F2's per-scope consent. Each path calls one collaborator, not both.
  it('(d) install fork: trusted -> disclosure (decline aborts), untrusted -> per-scope consent', async () => {
    const disclose = { present: vi.fn(async () => false) }; // trusted user declines.
    const consentDialog = { present: vi.fn(async () => ({ decisions: [] })) };
    TestBed.configureTestingModule({
      providers: [
        { provide: FULL_ACCESS_DISCLOSURE_PRESENTER, useValue: disclose },
        { provide: CONSENT_DIALOG_PRESENTER, useValue: consentDialog },
        { provide: GATEWAY_DATA_SOURCE, useValue: DATA_SOURCE },
        { provide: CONTACT_PICKER, useValue: {} },
      ],
    });

    const install = TestBed.inject(TrustedInstallFlowService);
    const registry = TestBed.inject(ExtensionRegistry);
    const allowlist = TestBed.inject(FrameSrcAllowlistService);
    const fetchMock = vi.spyOn(globalThis, 'fetch');

    // Trusted decline routes to the disclosure (not consent) and records nothing.
    const declined = await install.install(TRUSTED_ORIGIN, {
      userId: USER,
      extensionName: 'Listus',
    });
    expect(disclose.present).toHaveBeenCalledTimes(1);
    expect(consentDialog.present).not.toHaveBeenCalled();
    expect(declined.ok).toBe(false);
    expect(registry.has(TRUSTED_ID)).toBe(false);
    expect(allowlist.isAllowed(TRUSTED_ORIGIN)).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled(); // declined before any manifest fetch.

    // Untrusted routes to per-scope consent and never the disclosure.
    fetchMock.mockResolvedValue(
      okResponse(manifestFor(UNTRUSTED_ORIGIN, ['contacts:read'], 'Acme')),
    );
    const installed = await install.install(UNTRUSTED_ORIGIN, {
      userId: USER,
      extensionName: 'Acme',
    });
    expect(consentDialog.present).toHaveBeenCalledTimes(1);
    expect(disclose.present).toHaveBeenCalledTimes(1); // still only the trusted call.
    expect(installed.ok).toBe(true);
    expect(registry.has(UNTRUSTED_ID)).toBe(true);
  });
});
