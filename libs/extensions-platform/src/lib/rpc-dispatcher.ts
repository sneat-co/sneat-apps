import { RPC_PROTOCOL_VERSION, RpcRequest, RpcResponse } from './models';

/** A handler for one RPC request type. */
export type RpcHandler = (
  payload: unknown,
  request: RpcRequest,
) => unknown | Promise<unknown>;

/**
 * Versioned RPC envelope dispatcher. Correlates responses to requests by
 * message id, returns an error response for unknown/unsupported types, and
 * rejects protocol-version mismatches.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:rpc-correlates-and-errors
 */
export class RpcDispatcher {
  private readonly handlers = new Map<string, RpcHandler>();

  /** Register a handler for a request `type`. */
  register(type: string, handler: RpcHandler): this {
    this.handlers.set(type, handler);
    return this;
  }

  /**
   * Dispatch a request envelope and produce a correlated response envelope.
   * Never throws for protocol/handler errors - they map to error responses.
   */
  async dispatch(request: RpcRequest): Promise<RpcResponse> {
    const id = request?.id;
    if (typeof id !== 'string' || typeof request?.type !== 'string') {
      return {
        v: RPC_PROTOCOL_VERSION,
        id: typeof id === 'string' ? id : '',
        ok: false,
        error: {
          code: 'bad_request',
          message: 'Request envelope is missing a string id or type.',
        },
      };
    }

    if (request.v !== RPC_PROTOCOL_VERSION) {
      return {
        v: RPC_PROTOCOL_VERSION,
        id,
        ok: false,
        error: {
          code: 'version_mismatch',
          message: `Unsupported protocol version ${request.v}; expected ${RPC_PROTOCOL_VERSION}.`,
        },
      };
    }

    const handler = this.handlers.get(request.type);
    if (!handler) {
      return {
        v: RPC_PROTOCOL_VERSION,
        id,
        ok: false,
        error: {
          code: 'unknown_type',
          message: `Unknown request type "${request.type}".`,
        },
      };
    }

    try {
      const result = await handler(request.payload, request);
      return { v: RPC_PROTOCOL_VERSION, id, ok: true, result };
    } catch (e) {
      return {
        v: RPC_PROTOCOL_VERSION,
        id,
        ok: false,
        error: {
          code: 'bad_request',
          message: e instanceof Error ? e.message : 'Handler failed.',
        },
      };
    }
  }
}
