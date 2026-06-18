import { InjectionToken, Injectable, inject } from '@angular/core';
import { PortLike } from './bridge-host';
import { isTrustedOrigin } from './trusted-origin-allowlist';

/**
 * The signed-in user's current Firebase ID token together with its expiry.
 * `expiresAt` is epoch milliseconds; Firebase ID tokens live ~1 hour.
 */
export interface FirebaseIdToken {
  readonly token: string;
  /** Epoch ms at which the token expires. */
  readonly expiresAt: number;
}

/**
 * Source of the signed-in user's own Firebase ID token. The app binds this to
 * the Firebase Auth SDK (`getIdToken` / `getIdTokenResult`); tests provide a
 * stub. `forceRefresh` requests a freshly-minted token from Firebase before the
 * cached one expires.
 */
export interface TrustedTokenSource {
  getIdToken(forceRefresh: boolean): Promise<FirebaseIdToken>;
}

/** DI token for {@link TrustedTokenSource}, following the CONSENT_PERSISTENCE pattern. */
export const TRUSTED_TOKEN_SOURCE = new InjectionToken<TrustedTokenSource>(
  'TRUSTED_TOKEN_SOURCE',
);

/** Message type carrying a (refreshed) token to a trusted iframe over the bridge. */
export const TRUSTED_TOKEN_MESSAGE = 'sneat-ext-trusted-token' as const;

/** The token-handoff message pushed over the retained host port. */
export interface TrustedTokenMessage {
  readonly type: typeof TRUSTED_TOKEN_MESSAGE;
  readonly token: string;
  readonly expiresAt: number;
}

/**
 * How long before a token's expiry the next refresh fires. A small margin so
 * the trusted extension never holds a token that has already expired.
 */
const REFRESH_MARGIN_MS = 5 * 60 * 1000;

/**
 * Origin-verified, one-way handoff of the signed-in user's own Firebase ID
 * token to a TRUSTED first-party iframe over F1's already-established bridge,
 * with proactive refresh before the ~1-hour expiry.
 *
 * The token is handed off ONLY when the browser-verified origin (the origin F1
 * verified during its handshake) is on the trusted allowlist. An untrusted /
 * non-allowlisted verified origin receives NO token and must use the gateway —
 * `start` is a no-op for it and no refresh is ever scheduled. Because the token
 * is always the signed-in user's own, even a locally-spoofed trusted origin
 * only ever yields the spoofer their own token (no cross-user escalation).
 *
 * specscore: https://specscore.md/features/trusted-first-party-extensions
 * Verifies: trusted-first-party-extensions#ac:trusted-receives-token-untrusted-does-not
 * Verifies: trusted-first-party-extensions#ac:token-only-to-verified-origin
 * Verifies: trusted-first-party-extensions#ac:token-refreshed-before-expiry
 */
@Injectable({ providedIn: 'root' })
export class TokenHandoffService {
  private readonly tokenSource = inject(TRUSTED_TOKEN_SOURCE);

  private readonly handles = new Map<PortLike, ReturnType<typeof setTimeout>>();

  /** True when `origin` is eligible for a token handoff. */
  isEligible(origin: string): boolean {
    return isTrustedOrigin(origin);
  }

  /**
   * Begin the token handoff to a trusted iframe over its retained host `port`.
   * `verifiedOrigin` is the origin F1 verified during the handshake. When it is
   * not trusted this is a no-op: no token is sent and no refresh is scheduled.
   *
   * Otherwise the current token is pushed immediately and a refresh is scheduled
   * to fire before expiry; each refreshed token is sent over the SAME port (the
   * same already-verified trusted origin) so the extension keeps working without
   * a full reload.
   */
  async start(port: PortLike, verifiedOrigin: string): Promise<boolean> {
    if (!this.isEligible(verifiedOrigin)) {
      return false;
    }
    await this.sendFreshToken(port, false);
    return true;
  }

  /** Stop refreshing and forget the port (e.g. on bridge teardown / removal). */
  stop(port: PortLike): void {
    const handle = this.handles.get(port);
    if (handle !== undefined) {
      clearTimeout(handle);
      this.handles.delete(port);
    }
  }

  private async sendFreshToken(
    port: PortLike,
    forceRefresh: boolean,
  ): Promise<void> {
    const idToken = await this.tokenSource.getIdToken(forceRefresh);
    const message: TrustedTokenMessage = {
      type: TRUSTED_TOKEN_MESSAGE,
      token: idToken.token,
      expiresAt: idToken.expiresAt,
    };
    port.postMessage(message);
    this.scheduleRefresh(port, idToken.expiresAt);
  }

  private scheduleRefresh(port: PortLike, expiresAt: number): void {
    this.stop(port);
    const delay = Math.max(0, expiresAt - Date.now() - REFRESH_MARGIN_MS);
    const handle = setTimeout(() => {
      void this.sendFreshToken(port, true);
    }, delay);
    this.handles.set(port, handle);
  }
}
