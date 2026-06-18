import { Injectable, inject } from '@angular/core';
import { ExtensionRegistry } from './extension-registry.service';
import { FrameSrcAllowlistService } from './frame-src-allowlist.service';
import { ManifestService } from './manifest.service';
import { ExtensionRegistration } from './models';
import { extensionIdOf, httpsOriginOf } from './origin';

export interface AddExtensionOk {
  readonly ok: true;
  readonly registration: ExtensionRegistration;
}

export interface AddExtensionError {
  readonly ok: false;
  /** User-visible error explaining why the add was refused. */
  readonly error: string;
}

export type AddExtensionResult = AddExtensionOk | AddExtensionError;

/**
 * The user-facing "add extension by https URL" flow. Runs manifest validation
 * and, ONLY on success, records the extension and appends its origin to the
 * `frame-src` allowlist. Nothing is recorded or allowlisted for a manifest that
 * fails validation. Deregistration reverses both effects.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:manifest-add-success
 * Verifies: extension-host-and-bridge#ac:deregistration-drops-allowlist
 */
@Injectable({ providedIn: 'root' })
export class ExtensionRegistrationService {
  private readonly manifests = inject(ManifestService);
  private readonly registry = inject(ExtensionRegistry);
  private readonly allowlist = inject(FrameSrcAllowlistService);

  /** Validate and, on success, register the extension at `url`. */
  async add(url: string): Promise<AddExtensionResult> {
    const origin = httpsOriginOf(url);
    const id = origin && extensionIdOf(origin);
    if (!origin || !id) {
      return { ok: false, error: 'Extension URL must be an https URL.' };
    }

    const result = await this.manifests.fetchAndValidate(url);
    if (!result.ok) {
      // Nothing recorded, nothing allowlisted.
      return { ok: false, error: result.error };
    }

    const registration: ExtensionRegistration = {
      id,
      origin,
      url,
      manifest: result.manifest,
      scopes: result.manifest.scopes,
    };
    this.registry.create(registration);
    this.allowlist.add(origin);
    return { ok: true, registration };
  }

  /**
   * Deregister an extension: delete its record and drop its origin from the
   * `frame-src` allowlist so the origin can no longer be framed. Touches only
   * Sneat-side state.
   */
  deregister(id: string): boolean {
    const registration = this.registry.get(id);
    if (!registration) {
      return false;
    }
    this.registry.delete(id);
    this.allowlist.remove(registration.origin);
    return true;
  }
}
