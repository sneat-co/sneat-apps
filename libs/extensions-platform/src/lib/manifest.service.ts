import { Injectable } from '@angular/core';
import {
  ManifestValidationResult,
  MANIFEST_WELL_KNOWN_PATH,
  validateManifest,
} from './manifest-validation';
import { httpsOriginOf } from './origin';

/**
 * Fetches and structurally validates an extension manifest from
 * `/.well-known/sneat-extension.json` on the given `https` URL's origin.
 *
 * Any failure (non-https URL, unreachable/unparseable manifest, missing/wrong
 * field, origin mismatch) returns a user-visible error and records nothing.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:manifest-invalid-rejected
 * Verifies: extension-host-and-bridge#ac:manifest-format-and-origin-checks
 */
@Injectable({ providedIn: 'root' })
export class ManifestService {
  /**
   * Fetch + validate the manifest for the extension at `url`.
   * @param url the `https` URL the user entered.
   */
  async fetchAndValidate(url: string): Promise<ManifestValidationResult> {
    const origin = httpsOriginOf(url);
    if (!origin) {
      return { ok: false, error: 'Extension URL must be an https URL.' };
    }

    const manifestUrl = origin + MANIFEST_WELL_KNOWN_PATH;
    let response: Response;
    try {
      response = await fetch(manifestUrl, {
        // Never attach Sneat's cookies/credentials to a third-party origin.
        credentials: 'omit',
      });
    } catch {
      return {
        ok: false,
        error: `Could not fetch the manifest at ${manifestUrl}.`,
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        error: `Manifest not found at ${manifestUrl} (HTTP ${response.status}).`,
      };
    }

    let raw: unknown;
    try {
      raw = await response.json();
    } catch {
      return {
        ok: false,
        error: 'Manifest is not valid JSON.',
      };
    }

    return validateManifest(raw, origin);
  }
}
