import { connect, WindowMessenger, type Methods } from 'penpal';

/**
 * Production bridge transport built on Penpal (the decided RPC library).
 *
 * Penpal's {@link WindowMessenger} performs the window-level handshake and
 * restricts communication to `allowedOrigins` - here pinned to the extension's
 * single registered origin, so a handshake from any other origin is rejected.
 * The versioned-envelope semantics and Sneat-side origin/scope authorization
 * are still owned by {@link BridgeHost} / the gateway regardless of the library.
 *
 * This is a thin browser-only factory; the origin-verification and RPC-envelope
 * behaviour is exercised by the transport-agnostic `BridgeHost` unit tests.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:handshake-origin-verified
 */
export function connectPenpalHost<TRemote extends Methods = Methods>(options: {
  /** The extension iframe's content window. */
  readonly remoteWindow: Window;
  /** The extension's single registered origin - the only allowed origin. */
  readonly registeredOrigin: string;
  /** Host methods exposed to the extension (read-only gateway, no secrets). */
  readonly methods: Methods;
}) {
  const messenger = new WindowMessenger({
    remoteWindow: options.remoteWindow,
    allowedOrigins: [options.registeredOrigin],
  });
  return connect<TRemote>({ messenger, methods: options.methods });
}
