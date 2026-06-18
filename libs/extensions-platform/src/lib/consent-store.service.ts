import { InjectionToken, Injectable, inject } from '@angular/core';
import { ScopeId, isCatalogScope } from './scope-catalog';

/**
 * The authoritative per-`(user, extension, scope)` consent record.
 *
 * Decisions are persisted under the signed-in user's OWN data space, one
 * document per `(user, extension)` keyed by `extId` (origin `host[:port]`),
 * carrying a `grants` map of `scopeId -> { state, decidedAt }`. Absence of an
 * entry means not-decided. This store is the single source of truth the
 * Protected-Data Gateway and Permission-Management-UI consume; any scope that is
 * not currently `granted` — never decided, declined, or revoked — is reported as
 * not granted, so a consumer denies access.
 *
 * specscore: https://specscore.md/features/extension-consent-and-scopes
 * Verifies: extension-consent-and-scopes#ac:grants-isolated-per-user-and-extension
 * Verifies: extension-consent-and-scopes#ac:revoke-takes-effect-immediately
 * Verifies: extension-consent-and-scopes#ac:ungranted-scope-treated-as-denied
 */

/** The decided state of a single scope. Absence of an entry = not decided. */
export type ConsentState = 'granted' | 'declined';

/** A single recorded scope decision. */
export interface ConsentGrant {
  readonly state: ConsentState;
  /** Epoch milliseconds when the decision was last recorded. */
  readonly decidedAt: number;
}

/** The persisted document for one `(user, extension)` pair. */
export interface ConsentRecord {
  readonly userId: string;
  /** Extension id = origin `host[:port]`. */
  readonly extId: string;
  /** Per-scope decisions. A scope absent from this map is not-decided. */
  readonly grants: Readonly<Record<string, ConsentGrant>>;
}

/**
 * Persistence backend for consent records, abstracted so the store can live
 * under the user's Firestore data space in the app while tests use the
 * in-memory default. A real backend persists one doc per `(userId, extId)`
 * under the user's own space.
 */
export interface ConsentPersistence {
  read(userId: string, extId: string): ConsentRecord | undefined;
  write(record: ConsentRecord): void;
}

/** DI token for the consent persistence backend. */
export const CONSENT_PERSISTENCE = new InjectionToken<ConsentPersistence>(
  'CONSENT_PERSISTENCE',
  {
    providedIn: 'root',
    factory: () => new InMemoryConsentPersistence(),
  },
);

/**
 * Default synchronous in-memory persistence. Keyed strictly by
 * `${userId}${extId}` so records never leak across users or extensions.
 * The app overrides {@link CONSENT_PERSISTENCE} with a Firestore-backed adapter.
 */
export class InMemoryConsentPersistence implements ConsentPersistence {
  private readonly docs = new Map<string, ConsentRecord>();

  private key(userId: string, extId: string): string {
    return `${userId}${extId}`;
  }

  read(userId: string, extId: string): ConsentRecord | undefined {
    return this.docs.get(this.key(userId, extId));
  }

  write(record: ConsentRecord): void {
    this.docs.set(this.key(record.userId, record.extId), record);
  }
}

@Injectable({ providedIn: 'root' })
export class ConsentStore {
  private readonly persistence = inject(CONSENT_PERSISTENCE);

  /** Record `scope` as granted for `(userId, extId)`. */
  recordGrant(userId: string, extId: string, scope: ScopeId): void {
    this.setState(userId, extId, scope, 'granted');
  }

  /** Record `scope` as declined for `(userId, extId)`. */
  recordDecline(userId: string, extId: string, scope: ScopeId): void {
    this.setState(userId, extId, scope, 'declined');
  }

  /**
   * Synchronous authoritative query: true ONLY when the scope is currently
   * granted for this exact `(user, extension)`. A never-decided, declined, or
   * revoked scope returns false. A scope outside the catalog is never granted.
   */
  isGranted(userId: string, extId: string, scope: string): boolean {
    if (!isCatalogScope(scope)) {
      return false;
    }
    const record = this.persistence.read(userId, extId);
    return record?.grants[scope]?.state === 'granted';
  }

  /** All currently-granted scopes for `(userId, extId)`. */
  listGranted(userId: string, extId: string): ScopeId[] {
    const record = this.persistence.read(userId, extId);
    if (!record) {
      return [];
    }
    return Object.entries(record.grants)
      .filter(([id, g]) => g.state === 'granted' && isCatalogScope(id))
      .map(([id]) => id as ScopeId);
  }

  /**
   * The set of scopes that already have a decision (granted OR declined) for
   * `(userId, extId)`. Used by incremental re-consent to compute the
   * not-yet-decided subset.
   */
  decidedScopes(userId: string, extId: string): Set<ScopeId> {
    const record = this.persistence.read(userId, extId);
    const decided = new Set<ScopeId>();
    if (record) {
      for (const id of Object.keys(record.grants)) {
        if (isCatalogScope(id)) {
          decided.add(id);
        }
      }
    }
    return decided;
  }

  /**
   * Revoke a single scope: it becomes not-granted immediately. Implemented as a
   * decline so the decision is remembered and a subsequent `isGranted` reports
   * false at once, without the extension reloading.
   */
  revoke(userId: string, extId: string, scope: ScopeId): void {
    if (this.persistence.read(userId, extId)?.grants[scope] === undefined) {
      return;
    }
    this.setState(userId, extId, scope, 'declined');
  }

  /** Revoke every scope of an extension at once. */
  revokeAll(userId: string, extId: string): void {
    const record = this.persistence.read(userId, extId);
    if (!record) {
      return;
    }
    for (const id of Object.keys(record.grants)) {
      if (isCatalogScope(id)) {
        this.setState(userId, extId, id, 'declined');
      }
    }
  }

  private setState(
    userId: string,
    extId: string,
    scope: ScopeId,
    state: ConsentState,
  ): void {
    const existing = this.persistence.read(userId, extId);
    const grants: Record<string, ConsentGrant> = {
      ...(existing?.grants ?? {}),
    };
    grants[scope] = { state, decidedAt: Date.now() };
    this.persistence.write({ userId, extId, grants });
  }
}
