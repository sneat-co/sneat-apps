import { InjectionToken, Injectable, inject } from '@angular/core';
import {
  AddExtensionResult,
  ExtensionRegistrationService,
} from './extension-registration.service';
import { ConsentFlowContext, ConsentFlowService } from './consent-flow.service';
import { httpsOriginOf } from './origin';
import { isTrustedOrigin } from './trusted-origin-allowlist';

/** What the presenter needs to render the one-time full-access disclosure. */
export interface FullAccessDisclosureRequest {
  readonly extensionName: string;
  readonly origin: string;
}

/**
 * Presents the one-time full-access install disclosure for a TRUSTED extension
 * and resolves with `true` (accept → install) or `false` (decline → abort).
 * The app renders this (e.g. in a modal); tests provide a stub.
 */
export interface FullAccessDisclosurePresenter {
  present(request: FullAccessDisclosureRequest): Promise<boolean>;
}

/** DI token for the full-access disclosure presenter. */
export const FULL_ACCESS_DISCLOSURE_PRESENTER =
  new InjectionToken<FullAccessDisclosurePresenter>(
    'FULL_ACCESS_DISCLOSURE_PRESENTER',
  );

/** Outcome of the trusted install fork. */
export type TrustedInstallResult =
  | {
      readonly ok: true;
      readonly trusted: boolean;
      readonly result: AddExtensionResult;
    }
  | { readonly ok: false; readonly declined: true };

/** Identity the untrusted consent path needs (signed-in user, extension name). */
export interface InstallContext {
  readonly userId: string;
  readonly extensionName: string;
}

/**
 * The install-time TRUSTED vs UNTRUSTED fork inserted into F1's add-by-URL flow.
 *
 * After F1's manifest validation succeeds and BEFORE the extension is recorded
 * and its origin appended to the `frame-src` allowlist, this branches on
 * {@link isTrustedOrigin}:
 *
 * - TRUSTED origin: shows the one-time full-access disclosure IN PLACE OF the
 *   per-scope consent dialog. The extension is registered (F1's record +
 *   allowlist step proceeds) only if the user accepts; on decline the install
 *   aborts with nothing recorded, nothing allowlisted, and no token ever handed
 *   off.
 * - UNTRUSTED origin: registers the extension, then routes to F2's per-scope
 *   install consent ({@link ConsentFlowService.runInstallConsent}). This flow
 *   never shows the per-scope dialog itself and never the disclosure for an
 *   untrusted origin.
 *
 * specscore: https://specscore.md/features/trusted-first-party-extensions
 * Verifies: trusted-first-party-extensions#ac:install-shows-full-access-disclosure
 * Verifies: trusted-first-party-extensions#ac:declined-disclosure-aborts-install
 */
@Injectable({ providedIn: 'root' })
export class TrustedInstallFlowService {
  private readonly registration = inject(ExtensionRegistrationService);
  private readonly consentFlow = inject(ConsentFlowService);
  private readonly disclosure = inject(FULL_ACCESS_DISCLOSURE_PRESENTER);

  /**
   * Run the install fork for the extension at `url`. The manifest is validated
   * first (inside the registration flow); only on validation success does the
   * trusted/untrusted branch run.
   */
  async install(
    url: string,
    ctx: InstallContext,
  ): Promise<TrustedInstallResult> {
    const origin = httpsOriginOf(url);

    if (origin && isTrustedOrigin(origin)) {
      // Trusted: show the full-access disclosure BEFORE recording/allowlisting.
      const accepted = await this.disclosure.present({
        extensionName: ctx.extensionName,
        origin,
      });
      if (!accepted) {
        // Decline: nothing recorded, nothing allowlisted, no token handed off.
        return { ok: false, declined: true };
      }
      const result = await this.registration.add(url);
      return { ok: true, trusted: true, result };
    }

    // Untrusted: register, then run F2's per-scope install consent.
    const result = await this.registration.add(url);
    if (result.ok) {
      const consentCtx: ConsentFlowContext = {
        userId: ctx.userId,
        extId: result.registration.id,
        extensionName: ctx.extensionName,
        origin: result.registration.origin,
        requestedScopes: result.registration.scopes,
      };
      await this.consentFlow.runInstallConsent(consentCtx);
    }
    return { ok: true, trusted: false, result };
  }
}
