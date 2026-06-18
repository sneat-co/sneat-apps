import { ExtensionManifest } from './models';
import { httpsOriginOf } from './origin';

/** The well-known path an extension serves its manifest at. */
export const MANIFEST_WELL_KNOWN_PATH = '/.well-known/sneat-extension.json';

export interface ManifestValidationOk {
  readonly ok: true;
  readonly manifest: ExtensionManifest;
}

export interface ManifestValidationError {
  readonly ok: false;
  /** User-visible error message describing why the add was refused. */
  readonly error: string;
}

export type ManifestValidationResult =
  | ManifestValidationOk
  | ManifestValidationError;

// Pragmatic single-pass email syntax check (one `@`, a dot in the domain, no
// whitespace). Structural only - not an RFC-5322 parser.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

/**
 * Structurally validate a parsed manifest against the origin it was fetched
 * from. Does NOT check scope support (owned by Consent & Scopes).
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:manifest-invalid-rejected
 * Verifies: extension-host-and-bridge#ac:manifest-format-and-origin-checks
 *
 * @param raw the parsed JSON value of the manifest body
 * @param fetchOrigin the `https` origin the manifest was fetched from
 */
export function validateManifest(
  raw: unknown,
  fetchOrigin: string,
): ManifestValidationResult {
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, error: 'Manifest is not a JSON object.' };
  }
  const m = raw as Record<string, unknown>;

  if (typeof m['name'] !== 'string' || m['name'].length === 0) {
    return { ok: false, error: 'Manifest "name" must be a non-empty string.' };
  }

  const author = m['author'];
  if (typeof author !== 'object' || author === null) {
    return { ok: false, error: 'Manifest "author" must be an object.' };
  }
  const a = author as Record<string, unknown>;
  if (typeof a['name'] !== 'string' || a['name'].length === 0) {
    return {
      ok: false,
      error: 'Manifest "author.name" must be a non-empty string.',
    };
  }
  if (typeof a['email'] !== 'string' || !EMAIL_RE.test(a['email'])) {
    return {
      ok: false,
      error: 'Manifest "author.email" must be a valid email address.',
    };
  }

  const icon = m['icon'];
  if (typeof icon !== 'string' || httpsOriginOf(icon) === undefined) {
    return {
      ok: false,
      error: 'Manifest "icon" must be an https URL.',
    };
  }

  if (!isStringArray(m['scopes'])) {
    return {
      ok: false,
      error: 'Manifest "scopes" must be an array of strings.',
    };
  }

  if (typeof m['origin'] !== 'string') {
    return {
      ok: false,
      error: 'Manifest "origin" must be a string.',
    };
  }
  const declaredOrigin = httpsOriginOf(m['origin']);
  if (declaredOrigin === undefined) {
    return {
      ok: false,
      error: 'Manifest "origin" must be an https origin.',
    };
  }
  if (declaredOrigin !== fetchOrigin) {
    return {
      ok: false,
      error: `Manifest origin "${declaredOrigin}" does not match the origin it was fetched from "${fetchOrigin}".`,
    };
  }

  const manifest: ExtensionManifest = {
    name: m['name'],
    author: { name: a['name'], email: a['email'] },
    icon,
    scopes: m['scopes'],
    origin: declaredOrigin,
  };
  return { ok: true, manifest };
}
