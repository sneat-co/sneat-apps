import { describe, it, expect } from 'vitest';
import { RpcDispatcher } from './rpc-dispatcher';
import { RPC_PROTOCOL_VERSION, RpcRequest } from './models';

function req(over: Partial<RpcRequest> = {}): RpcRequest {
  return { v: RPC_PROTOCOL_VERSION, id: 'm1', type: 'ping', ...over };
}

describe('RpcDispatcher', () => {
  it('correlates a response to a request by message id', async () => {
    const d = new RpcDispatcher().register('ping', () => 'pong');
    const res = await d.dispatch(req({ id: 'abc-123' }));
    expect(res.id).toBe('abc-123');
    expect(res.ok).toBe(true);
    expect(res.result).toBe('pong');
    expect(res.v).toBe(RPC_PROTOCOL_VERSION);
  });

  it('passes the payload to the handler', async () => {
    const d = new RpcDispatcher().register('echo', (payload) => payload);
    const res = await d.dispatch(req({ type: 'echo', payload: { a: 1 } }));
    expect(res.result).toEqual({ a: 1 });
  });

  it('returns an unknown_type error for an unsupported type', async () => {
    const d = new RpcDispatcher();
    const res = await d.dispatch(req({ type: 'nope', id: 'x9' }));
    expect(res.ok).toBe(false);
    expect(res.id).toBe('x9');
    expect(res.error?.code).toBe('unknown_type');
  });

  it('rejects a protocol-version mismatch', async () => {
    const d = new RpcDispatcher().register('ping', () => 'pong');
    const res = await d.dispatch(req({ v: 999 }));
    expect(res.ok).toBe(false);
    expect(res.error?.code).toBe('version_mismatch');
  });

  it('rejects an envelope missing id or type', async () => {
    const d = new RpcDispatcher();
    const res = await d.dispatch({ v: RPC_PROTOCOL_VERSION } as RpcRequest);
    expect(res.ok).toBe(false);
    expect(res.error?.code).toBe('bad_request');
  });

  it('maps a throwing handler to a bad_request error response', async () => {
    const d = new RpcDispatcher().register('boom', () => {
      throw new Error('kaboom');
    });
    const res = await d.dispatch(req({ type: 'boom' }));
    expect(res.ok).toBe(false);
    expect(res.error?.code).toBe('bad_request');
    expect(res.error?.message).toBe('kaboom');
  });

  it('awaits async handlers', async () => {
    const d = new RpcDispatcher().register('slow', async () => {
      return Promise.resolve(7);
    });
    const res = await d.dispatch(req({ type: 'slow' }));
    expect(res.result).toBe(7);
  });
});
