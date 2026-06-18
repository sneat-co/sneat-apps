import { RpcDispatcher } from './rpc-dispatcher';
import { RpcRequest, RpcResponse } from './models';

/** Handshake message the framed extension posts to begin the bridge. */
export interface HandshakeMessage {
  readonly type: 'sneat-ext-handshake';
}

function isHandshake(data: unknown): data is HandshakeMessage {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as { type?: unknown }).type === 'sneat-ext-handshake'
  );
}

/** The minimal MessageEvent surface the host inspects for the handshake. */
export interface IncomingMessageEvent {
  readonly origin: string;
  readonly data: unknown;
  /** The iframe's window, used to transfer the port back to it. */
  readonly source: PostMessageTarget | null;
}

export interface PostMessageTarget {
  postMessage(
    message: unknown,
    targetOrigin: string,
    transfer?: Transferable[],
  ): void;
}

export interface PortLike {
  postMessage(message: unknown): void;
  start?(): void;
  onmessage: ((ev: { data: unknown }) => void) | null;
  close(): void;
}

export interface MessageChannelLike {
  readonly port1: PortLike;
  readonly port2: PortLike;
}

/**
 * Host side of the extension bridge handshake.
 *
 * On a handshake message it verifies `event.origin` against the extension's
 * registered origin, establishes a private `MessageChannel`, transfers exactly
 * ONE `MessagePort` to the framed extension, and runs the versioned RPC
 * dispatcher over the retained port. Handshake messages from any other origin
 * are ignored.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:handshake-origin-verified
 * Verifies: extension-host-and-bridge#ac:rpc-correlates-and-errors
 */
export class BridgeHost {
  private port: PortLike | undefined;
  /** Number of ports transferred to the extension (must never exceed 1). */
  private transferredPorts = 0;

  constructor(
    private readonly registeredOrigin: string,
    private readonly dispatcher: RpcDispatcher,
    private readonly createChannel: () => MessageChannelLike = () =>
      new MessageChannel() as unknown as MessageChannelLike,
  ) {}

  /** True once a handshake has been accepted and a port retained. */
  get isConnected(): boolean {
    return this.port !== undefined;
  }

  /** How many ports have been transferred to the extension. */
  get portsTransferred(): number {
    return this.transferredPorts;
  }

  /**
   * Handle a raw `message` event from the iframe. Returns true when a
   * handshake was accepted; false when ignored (wrong origin, already
   * connected, or not a handshake).
   */
  handleMessage(event: IncomingMessageEvent): boolean {
    if (!isHandshake(event.data)) {
      return false;
    }
    // Origin verification is the security boundary: reject any origin that is
    // not the extension's registered origin.
    if (event.origin !== this.registeredOrigin) {
      return false;
    }
    if (this.isConnected || !event.source) {
      return false;
    }

    const channel = this.createChannel();
    this.port = channel.port1;
    this.port.onmessage = (ev) => {
      void this.onPortMessage(ev.data);
    };
    this.port.start?.();

    // Transfer exactly one port to the extension's own origin.
    event.source.postMessage(
      { type: 'sneat-ext-handshake-ack' },
      this.registeredOrigin,
      [channel.port2 as unknown as Transferable],
    );
    this.transferredPorts += 1;
    return true;
  }

  private async onPortMessage(data: unknown): Promise<void> {
    if (!this.port) {
      return;
    }
    const response: RpcResponse = await this.dispatcher.dispatch(
      data as RpcRequest,
    );
    this.port.postMessage(response);
  }

  /** Tear down the bridge. */
  close(): void {
    this.port?.close();
    this.port = undefined;
  }
}
