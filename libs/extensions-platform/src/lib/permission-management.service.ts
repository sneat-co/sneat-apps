import { Injectable, inject } from '@angular/core';
import { ConsentStore } from './consent-store.service';
import { ExtensionRegistrationService } from './extension-registration.service';
import { ExtensionRegistry } from './extension-registry.service';
import { IS_TRUSTED_ORIGIN } from './is-trusted-origin';
import { ScopeId, getScopeDescriptor } from './scope-catalog';

/** A single granted scope shown for an extension, with its catalog label. */
export interface GrantedScopeView {
  readonly id: ScopeId;
  readonly label: string;
}

/**
 * Per-extension display model for the permission-management screen. Joins the
 * registry's identity (name, icon, origin), the consent store's currently
 * granted scopes (with catalog labels), and the trusted-origin discriminator.
 */
export interface ExtensionPermissionView {
  /** Extension id = origin `host[:port]`. */
  readonly id: string;
  readonly name: string;
  readonly icon: string;
  readonly origin: string;
  /**
   * Whether this origin is trusted (full account access). A trusted extension
   * shows the full-access badge instead of a scope list.
   */
  readonly isTrusted: boolean;
  /**
   * Currently granted scopes for an untrusted extension, in catalog order.
   * Empty for a trusted extension (it has no per-scope grants).
   */
  readonly grantedScopes: readonly GrantedScopeView[];
}

/**
 * Read-model + actions for the permission-management UI. It holds no consent
 * logic of its own: it reads installed extensions from F1's
 * {@link ExtensionRegistry} and their currently-granted scopes from F2's
 * {@link ConsentStore}, joins catalog labels and the trusted-origin
 * discriminator, and delegates its two mutations (revoke a scope, remove an
 * extension) to the consent store and the host's deregistration. Removal touches
 * only Sneat-side state and never the extension's own external backend.
 *
 * specscore: https://specscore.md/features/extension-permission-management-ui
 * Verifies: extension-permission-management-ui#ac:list-shows-installed-extensions
 * Verifies: extension-permission-management-ui#ac:shows-currently-granted-scopes
 * Verifies: extension-permission-management-ui#ac:trusted-extension-shows-full-access-badge
 * Verifies: extension-permission-management-ui#ac:revoke-single-scope
 * Verifies: extension-permission-management-ui#ac:remove-extension-fully
 * Verifies: extension-permission-management-ui#ac:remove-does-not-touch-external-data
 */
@Injectable({ providedIn: 'root' })
export class PermissionManagementService {
  private readonly registry = inject(ExtensionRegistry);
  private readonly consent = inject(ConsentStore);
  private readonly registration = inject(ExtensionRegistrationService);
  private readonly isTrustedOrigin = inject(IS_TRUSTED_ORIGIN);

  /**
   * The display model for every extension the signed-in user has installed, in
   * registry order. An empty array means the user has no installed extensions
   * (the screen shows an empty state, not an error).
   */
  list(userId: string): ExtensionPermissionView[] {
    return this.registry.list().map((reg) => {
      const isTrusted = this.isTrustedOrigin(reg.origin);
      return {
        id: reg.id,
        name: reg.manifest.name,
        icon: reg.manifest.icon,
        origin: reg.origin,
        isTrusted,
        grantedScopes: isTrusted ? [] : this.grantedScopesOf(userId, reg.id),
      };
    });
  }

  /** The single extension's display model, or `undefined` when not installed. */
  get(userId: string, extId: string): ExtensionPermissionView | undefined {
    return this.list(userId).find((v) => v.id === extId);
  }

  /**
   * Revoke a single granted scope: delegates to F2's immediate revoke so the
   * scope is no longer granted and a subsequent gateway call for it is denied.
   */
  revokeScope(userId: string, extId: string, scope: ScopeId): void {
    this.consent.revoke(userId, extId, scope);
  }

  /**
   * Remove (uninstall) an extension entirely: revoke all its scopes (F2) and
   * deregister it via the host (F1) — deletes the registration record and drops
   * the origin from the `frame-src` allowlist so it can no longer be embedded.
   * Touches only Sneat-side state; issues no call against the extension's own
   * external backend.
   */
  remove(userId: string, extId: string): void {
    this.consent.revokeAll(userId, extId);
    this.registration.deregister(extId);
  }

  private grantedScopesOf(userId: string, extId: string): GrantedScopeView[] {
    return this.consent.listGranted(userId, extId).map((id) => ({
      id,
      label: getScopeDescriptor(id)?.label ?? id,
    }));
  }
}
