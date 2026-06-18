/**
 * Shared models for the Sneat extension host & bridge.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 */

/** The manifest a third-party extension serves at `/.well-known/sneat-extension.json`. */
export interface ExtensionManifest {
  /** Human-readable extension name. */
  readonly name: string;
  readonly author: {
    readonly name: string;
    /** Syntactically valid email address. */
    readonly email: string;
  };
  /** `https` URL of the extension icon. */
  readonly icon: string;
  /** Requested scope identifiers. Structural only - support is checked by Consent. */
  readonly scopes: readonly string[];
  /**
   * Self-declared origin (`https://host[:port]`). MUST equal the origin the
   * manifest was fetched from.
   */
  readonly origin: string;
}

/** A recorded extension registration. id = origin `host[:port]`. */
export interface ExtensionRegistration {
  /** Stable id = origin `host[:port]` (no scheme). */
  readonly id: string;
  /** The full `https` origin (scheme + host[:port]). */
  readonly origin: string;
  /** The URL the user entered when adding the extension. */
  readonly url: string;
  /** Validated manifest metadata. */
  readonly manifest: ExtensionManifest;
  /** Scopes the extension requested in its manifest. */
  readonly scopes: readonly string[];
}

/** A menu item contributed by an extension over the bridge. */
export interface ExtensionMenuItem {
  readonly title: string;
  readonly emoji?: string;
  readonly path: string;
  readonly args?: Record<string, unknown>;
}

/** Current bridge protocol version. */
export const RPC_PROTOCOL_VERSION = 1 as const;

/** Versioned RPC request envelope sent over the transferred port. */
export interface RpcRequest<P = unknown> {
  /** Protocol version - must equal {@link RPC_PROTOCOL_VERSION}. */
  readonly v: number;
  /** Correlation id; the response echoes it. */
  readonly id: string;
  /** Request type / method name. */
  readonly type: string;
  readonly payload?: P;
}

/** Versioned RPC response envelope correlated to a request by `id`. */
export interface RpcResponse<R = unknown> {
  readonly v: number;
  /** Correlation id echoed from the originating request. */
  readonly id: string;
  readonly ok: boolean;
  readonly result?: R;
  readonly error?: RpcError;
}

export interface RpcError {
  readonly code: RpcErrorCode;
  readonly message: string;
}

export type RpcErrorCode = 'unknown_type' | 'version_mismatch' | 'bad_request';
