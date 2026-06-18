import { describe, it, expect, vi } from 'vitest';
import {
  BridgeHost,
  IncomingMessageEvent,
  MessageChannelLike,
  PortLike,
} from './bridge-host';
import { RpcDispatcher } from './rpc-dispatcher';
import { RPC_PROTOCOL_VERSION } from './models';

const ORIGIN = 'https://listus.app';

function fakePort(): PortLike {
  return {
    postMessage: vi.fn(),
    start: vi.fn(),
    onmessage: null,
    close: vi.fn(),
  };
}

function fakeChannel(): MessageChannelLike {
  return { port1: fakePort(), port2: fakePort() };
}

function handshakeEvent(
  over: Partial<IncomingMessageEvent> = {},
): IncomingMessageEvent {
  return {
    origin: ORIGIN,
    data: { type: 'sneat-ext-handshake' },
    source: { postMessage: vi.fn() },
    ...over,
  };
}

describe('BridgeHost handshake origin verification', () => {
  it('accepts a handshake from the registered origin and transfers exactly one port', () => {
    const channel = fakeChannel();
    const host = new BridgeHost(ORIGIN, new RpcDispatcher(), () => channel);
    const source = { postMessage: vi.fn() };

    const accepted = host.handleMessage(handshakeEvent({ source }));

    expect(accepted).toBe(true);
    expect(host.isConnected).toBe(true);
    expect(host.portsTransferred).toBe(1);
    // Exactly one port transferred, to the registered origin only.
    expect(source.postMessage).toHaveBeenCalledTimes(1);
    const [, targetOrigin, transfer] = source.postMessage.mock.calls[0];
    expect(targetOrigin).toBe(ORIGIN);
    expect(transfer).toHaveLength(1);
    expect(transfer[0]).toBe(channel.port2);
  });

  it('ignores a handshake from any other origin', () => {
    const source = { postMessage: vi.fn() };
    const host = new BridgeHost(ORIGIN, new RpcDispatcher(), fakeChannel);
    const accepted = host.handleMessage(
      handshakeEvent({ origin: 'https://evil.app', source }),
    );
    expect(accepted).toBe(false);
    expect(host.isConnected).toBe(false);
    expect(host.portsTransferred).toBe(0);
    expect(source.postMessage).not.toHaveBeenCalled();
  });

  it('ignores non-handshake messages', () => {
    const host = new BridgeHost(ORIGIN, new RpcDispatcher(), fakeChannel);
    expect(
      host.handleMessage(handshakeEvent({ data: { type: 'other' } })),
    ).toBe(false);
    expect(host.isConnected).toBe(false);
  });

  it('never transfers a second port (single channel)', () => {
    const host = new BridgeHost(ORIGIN, new RpcDispatcher(), fakeChannel);
    host.handleMessage(handshakeEvent());
    const second = host.handleMessage(handshakeEvent());
    expect(second).toBe(false);
    expect(host.portsTransferred).toBe(1);
  });

  it('runs the RPC dispatcher over the retained port', async () => {
    const channel = fakeChannel();
    const dispatcher = new RpcDispatcher().register('ping', () => 'pong');
    const host = new BridgeHost(ORIGIN, dispatcher, () => channel);
    host.handleMessage(handshakeEvent());

    // Simulate the extension sending a request over the transferred port.
    channel.port1.onmessage?.({
      data: { v: RPC_PROTOCOL_VERSION, id: 'r1', type: 'ping' },
    });
    await Promise.resolve();
    await Promise.resolve();

    expect(channel.port1.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'r1', ok: true, result: 'pong' }),
    );
  });
});
