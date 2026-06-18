import { Injectable, inject } from '@angular/core';
import { PortLike } from './bridge-host';
import { ProtectedDataGateway } from './protected-data-gateway.service';
import { RpcDispatcher } from './rpc-dispatcher';
import { TokenHandoffService } from './token-handoff.service';
import { isTrustedOrigin } from './trusted-origin-allowlist';

/** What an extension bridge needs at handler-attachment time. */
export interface BridgeAttachContext {
  /** The origin F1 verified during its handshake. */
  readonly verifiedOrigin: string;
  /** Extension id = origin `host[:port]`. */
  readonly extId: string;
  /** Resolves the signed-in user at call time (so session changes are observed). */
  readonly resolveUserId: () => string;
  /** The retained host port for pushing the token to a trusted iframe. */
  readonly port: PortLike;
  /** F1's RPC dispatcher the gateway handler would be registered on. */
  readonly dispatcher: RpcDispatcher;
}

/** Which path an extension's bridge was attached to. */
export type AttachKind = 'trusted-token' | 'untrusted-gateway';

/**
 * The bypass enforcement point: the SINGLE place that decides, per verified
 * origin, whether an extension's bridge uses the trusted token handoff or the
 * untrusted Protected-Data Gateway — never both.
 *
 * - TRUSTED origin: the gateway request handler is NOT registered on this
 *   iframe's port (full bypass of the per-scope consent/gateway enforcement);
 *   the token handoff (with refresh) is used instead.
 * - UNTRUSTED origin: the gateway handler IS registered and the token handoff
 *   is never started — every protected-data request is scope-enforced.
 *
 * Keying off the same {@link isTrustedOrigin} allowlist guarantees a trusted
 * extension is never subject to gateway checks and an untrusted one never gets
 * a token.
 *
 * specscore: https://specscore.md/features/trusted-first-party-extensions
 * Verifies: trusted-first-party-extensions#ac:trusted-skips-consent-and-gateway
 */
@Injectable({ providedIn: 'root' })
export class TrustedBridgeAttachService {
  private readonly gateway = inject(ProtectedDataGateway);
  private readonly handoff = inject(TokenHandoffService);

  /**
   * Attach the bridge for one extension to exactly one path based on its
   * verified origin. Returns which path was chosen.
   */
  async attach(ctx: BridgeAttachContext): Promise<AttachKind> {
    if (isTrustedOrigin(ctx.verifiedOrigin)) {
      // Trusted: bypass the gateway entirely; hand off (and refresh) the token.
      await this.handoff.start(ctx.port, ctx.verifiedOrigin);
      return 'trusted-token';
    }
    // Untrusted: register the scope-enforced gateway handler; no token handoff.
    this.gateway.registerOn(ctx.dispatcher, ctx.extId, ctx.resolveUserId);
    return 'untrusted-gateway';
  }
}
