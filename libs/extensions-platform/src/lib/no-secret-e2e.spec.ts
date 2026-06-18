import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ExtensionRegistrationService } from './extension-registration.service';
import { FrameSrcAllowlistService } from './frame-src-allowlist.service';
import { BridgeHost, MessageChannelLike, PortLike } from './bridge-host';
import { RpcDispatcher } from './rpc-dispatcher';
import { RPC_PROTOCOL_VERSION } from './models';

const ORIGIN = 'https://static-listus.app';

// A static, backend-less extension: just assets + a manifest served over https.
const STATIC_MANIFEST = {
  name: 'Static Listus',
  author: { name: 'Jane', email: 'jane@static-listus.app' },
  icon: 'https://static-listus.app/icon.png',
  scopes: ['lists:read'],
  origin: ORIGIN,
};

function fakePort(record: unknown[]): PortLike {
  return {
    postMessage: (m) => record.push(m),
    start: vi.fn(),
    onmessage: null,
    close: vi.fn(),
  };
}

/**
 * Task 10 end-to-end: a static backend-less extension is added, embedded,
 * handshakes, and reads consented data over the bridge with no backend running
 * and NO secret exchanged with an untrusted extension.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:backendless-extension-works
 * Verifies: extension-host-and-bridge#ac:no-secret-exchange
 */
describe('Backend-less extension end-to-end (no secret)', () => {
  let registration: ExtensionRegistrationService;
  let allowlist: FrameSrcAllowlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    registration = TestBed.inject(ExtensionRegistrationService);
    allowlist = TestBed.inject(FrameSrcAllowlistService);
    document.getElementById('sneat-ext-frame-src-csp')?.remove();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds, embeds, handshakes and reads data with no backend and no credential', async () => {
    // The only network call is a static GET of the manifest (no backend).
    const fetchCalls: string[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      fetchCalls.push(String(input));
      return {
        ok: true,
        status: 200,
        json: async () => STATIC_MANIFEST,
      } as unknown as Response;
    });

    // 1. Add by URL -> records + allowlists.
    const added = await registration.add(ORIGIN);
    expect(added.ok).toBe(true);
    expect(allowlist.isAllowed(ORIGIN)).toBe(true);

    // The host's read-only data gateway over the bridge. It returns consented
    // data only - never a credential.
    const consentedData = { lists: [{ id: 'l1', title: 'Groceries' }] };
    const dispatcher = new RpcDispatcher().register(
      'data:read',
      () => consentedData,
    );

    // 2. Handshake from the registered origin transfers exactly one port.
    const hostToExt: unknown[] = [];
    const extInbox: unknown[] = [];
    const channel: MessageChannelLike = {
      port1: fakePort(extInbox), // host-retained port
      port2: fakePort(hostToExt), // would be transferred to the iframe
    };
    const host = new BridgeHost(ORIGIN, dispatcher, () => channel);
    const transferRecord: { transfer?: Transferable[]; targetOrigin?: string } =
      {};
    host.handleMessage({
      origin: ORIGIN,
      data: { type: 'sneat-ext-handshake' },
      source: {
        postMessage: (_m, targetOrigin, transfer) => {
          transferRecord.targetOrigin = targetOrigin;
          transferRecord.transfer = transfer;
        },
      },
    });
    expect(host.portsTransferred).toBe(1);
    expect(transferRecord.transfer).toHaveLength(1);

    // 3. Extension reads consented data over the bridge.
    channel.port1.onmessage?.({
      data: { v: RPC_PROTOCOL_VERSION, id: 'd1', type: 'data:read' },
    });
    await Promise.resolve();
    await Promise.resolve();

    expect(extInbox).toContainEqual(
      expect.objectContaining({ id: 'd1', ok: true, result: consentedData }),
    );

    // 4. No backend: the only fetch is the static manifest GET.
    expect(fetchCalls).toEqual([
      'https://static-listus.app/.well-known/sneat-extension.json',
    ]);

    // 5. No secret: nothing sent to the untrusted extension carries a
    // credential / API key / Firebase token.
    const everythingSentToExtension = JSON.stringify([
      transferRecord,
      ...extInbox,
      ...hostToExt,
    ]);
    for (const forbidden of [
      'apiKey',
      'api_key',
      'secret',
      'token',
      'idToken',
      'credential',
      'password',
      'Authorization',
    ]) {
      expect(everythingSentToExtension.toLowerCase()).not.toContain(
        forbidden.toLowerCase(),
      );
    }
  });
});
