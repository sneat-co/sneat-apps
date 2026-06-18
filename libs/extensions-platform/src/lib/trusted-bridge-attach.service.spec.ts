import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PortLike } from './bridge-host';
import { RPC_PROTOCOL_VERSION } from './models';
import { CONTACT_PICKER, GATEWAY_DATA_SOURCE } from './gateway-data-source';
import { RpcDispatcher } from './rpc-dispatcher';
import {
  FirebaseIdToken,
  TRUSTED_TOKEN_MESSAGE,
  TRUSTED_TOKEN_SOURCE,
} from './token-handoff.service';
import { TrustedBridgeAttachService } from './trusted-bridge-attach.service';

const TRUSTED = 'https://listus.app';
const UNTRUSTED = 'https://acme.example';

function fakePort(record: unknown[]): PortLike {
  return {
    postMessage: (m) => record.push(m),
    start: vi.fn(),
    onmessage: null,
    close: vi.fn(),
  };
}

function setup(): TrustedBridgeAttachService {
  const token: FirebaseIdToken = {
    token: 'id-token',
    expiresAt: Date.now() + 3_600_000,
  };
  TestBed.configureTestingModule({
    providers: [
      {
        provide: TRUSTED_TOKEN_SOURCE,
        useValue: { getIdToken: async () => token },
      },
      { provide: GATEWAY_DATA_SOURCE, useValue: {} },
      { provide: CONTACT_PICKER, useValue: {} },
    ],
  });
  return TestBed.inject(TrustedBridgeAttachService);
}

describe('TrustedBridgeAttachService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.resetTestingModule();
  });

  // AC: trusted-skips-consent-and-gateway
  it('a trusted origin gets the token and NO gateway handler is registered', async () => {
    const service = setup();
    const inbox: unknown[] = [];
    const dispatcher = new RpcDispatcher();

    const kind = await service.attach({
      verifiedOrigin: TRUSTED,
      extId: 'listus.app',
      resolveUserId: () => 'user-1',
      port: fakePort(inbox),
      dispatcher,
    });

    expect(kind).toBe('trusted-token');
    expect(inbox).toContainEqual(
      expect.objectContaining({ type: TRUSTED_TOKEN_MESSAGE }),
    );
    // The gateway method is not registered -> dispatcher rejects it.
    const res = await dispatcher.dispatch({
      v: RPC_PROTOCOL_VERSION,
      id: 'r1',
      type: 'profile.get',
    });
    expect(res.ok).toBe(false);
    expect(res.error?.code).toBe('unknown_type');
  });

  // AC: trusted-skips-consent-and-gateway (untrusted branch)
  it('an untrusted origin registers the gateway handler and gets no token', async () => {
    const service = setup();
    const inbox: unknown[] = [];
    const dispatcher = new RpcDispatcher();
    const registerSpy = vi.spyOn(dispatcher, 'register');

    const kind = await service.attach({
      verifiedOrigin: UNTRUSTED,
      extId: 'acme.example',
      resolveUserId: () => 'user-1',
      port: fakePort(inbox),
      dispatcher,
    });

    expect(kind).toBe('untrusted-gateway');
    expect(inbox).toEqual([]);
    expect(registerSpy.mock.calls.map((c) => c[0])).toContain('profile.get');
  });
});
