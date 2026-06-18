import { InjectionToken, Injectable, inject } from '@angular/core';
import { ConsentDecision } from './consent-dialog.component';
import { ConsentStore } from './consent-store.service';
import { ScopeDescriptor, ScopeId, filterCatalogScopes } from './scope-catalog';

/**
 * The install-time and incremental per-scope consent flow for UNTRUSTED
 * extensions. It takes the extension's raw requested scopes, keeps only catalog
 * members (semantic filter), presents the granular consent dialog, and persists
 * the user's per-scope decisions to the authoritative {@link ConsentStore} —
 * recording granted scopes as granted and not recording declined scopes as
 * granted.
 *
 * This flow owns ONLY the untrusted per-scope path. The trusted/untrusted fork
 * (Trusted plan) decides whether to call here; this flow never inspects the
 * trusted allowlist. The extension is still registered by the Host & Bridge
 * add-by-URL flow even when the user declines every scope — an all-declined
 * consent simply records no grants.
 *
 * specscore: https://specscore.md/features/extension-consent-and-scopes
 * Verifies: extension-consent-and-scopes#ac:granular-grant-and-decline
 * Verifies: extension-consent-and-scopes#ac:incremental-consent-on-new-scope
 */

/**
 * Presents the consent dialog for a set of catalog scopes and resolves with the
 * user's per-scope decisions. The app implements this by rendering
 * {@link ConsentDialogComponent} (e.g. in a modal); tests provide a stub.
 */
export interface ConsentDialogPresenter {
  present(request: ConsentPromptRequest): Promise<ConsentDecision>;
}

/** What the presenter needs to render the dialog. */
export interface ConsentPromptRequest {
  readonly extensionName: string;
  readonly origin: string;
  readonly scopes: readonly ScopeDescriptor[];
}

/** DI token for the consent-dialog presenter. */
export const CONSENT_DIALOG_PRESENTER =
  new InjectionToken<ConsentDialogPresenter>('CONSENT_DIALOG_PRESENTER');

/** Context identifying the extension a consent flow is about. */
export interface ConsentFlowContext {
  readonly userId: string;
  /** Extension id = origin `host[:port]`. */
  readonly extId: string;
  readonly extensionName: string;
  readonly origin: string;
  /** Raw scopes requested in the extension's manifest (unfiltered). */
  readonly requestedScopes: readonly string[];
}

@Injectable({ providedIn: 'root' })
export class ConsentFlowService {
  private readonly store = inject(ConsentStore);
  private readonly presenter = inject(CONSENT_DIALOG_PRESENTER);

  /**
   * Install-time consent for an untrusted extension: filter the requested
   * scopes to the catalog, prompt for ALL of them, and persist the decisions.
   * Returns the scopes that ended up granted. When no catalog scope is
   * requested, no dialog is shown and nothing is granted.
   */
  async runInstallConsent(context: ConsentFlowContext): Promise<ScopeId[]> {
    const scopes = filterCatalogScopes(context.requestedScopes);
    return this.promptAndPersist(context, scopes);
  }

  /**
   * Incremental re-consent on load of an already-installed extension: prompt
   * ONLY for catalog scopes the user has not yet decided, leaving
   * previously-granted (and previously-declined) scopes untouched and un-asked.
   * A newly-requested scope becomes granted only if the user grants it here.
   * Returns the scopes newly granted in this prompt. No dialog is shown when
   * there is nothing new to decide.
   */
  async runIncrementalConsent(context: ConsentFlowContext): Promise<ScopeId[]> {
    const decided = this.store.decidedScopes(context.userId, context.extId);
    const undecided = filterCatalogScopes(context.requestedScopes).filter(
      (s) => !decided.has(s.id),
    );
    if (undecided.length === 0) {
      return [];
    }
    return this.promptAndPersist(context, undecided);
  }

  private async promptAndPersist(
    context: ConsentFlowContext,
    scopes: readonly ScopeDescriptor[],
  ): Promise<ScopeId[]> {
    if (scopes.length === 0) {
      return [];
    }
    const decision = await this.presenter.present({
      extensionName: context.extensionName,
      origin: context.origin,
      scopes,
    });

    const grantedNow: ScopeId[] = [];
    for (const d of decision.decisions) {
      if (d.granted) {
        this.store.recordGrant(context.userId, context.extId, d.scope);
        grantedNow.push(d.scope);
      } else {
        this.store.recordDecline(context.userId, context.extId, d.scope);
      }
    }
    return grantedNow;
  }
}
