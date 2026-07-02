// Pure helpers for the OVDB GitHub data-storage settings page, split out so the
// validation + admin-role logic can be unit-tested without the Angular/Ionic
// component harness (mirrors discover-movies.utils.ts).

// "owner/name" — the two GitHub path segments, each a normal repo/owner slug
// (letters, digits, dot, dash, underscore). No leading/trailing slash, no extra
// segments.
const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export function isValidRepo(repo: string): boolean {
  return REPO_RE.test(repo.trim());
}

// Parses the installation ID the user copied from the post-install URL
// (.../installations/<id>). Returns a positive integer or undefined when the
// input is blank, non-numeric, or <= 0.
export function parseInstallationID(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!/^\d+$/.test(trimmed)) {
    return undefined;
  }
  const n = Number(trimmed);
  return Number.isSafeInteger(n) && n > 0 ? n : undefined;
}

// Admin gate: this repo has no pre-existing space-admin UI gate, so we derive it
// from the current user's roles in the space (IUserSpaceBrief.roles). The space
// creator and any explicit "admin" role may manage storage. Backend enforces
// the real check (space-admin-only); this only gates the UI affordances.
export function isSpaceAdmin(roles: readonly string[] | undefined): boolean {
  return !!roles && (roles.includes('admin') || roles.includes('creator'));
}
