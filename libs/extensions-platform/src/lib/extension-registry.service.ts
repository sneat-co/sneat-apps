import { Injectable } from '@angular/core';
import { ExtensionRegistration } from './models';

/**
 * Records third-party extension registrations keyed by id = origin `host[:port]`.
 *
 * This is a Sneat-side local store of registration metadata (URL, manifest,
 * requested scopes). It holds no extension credential and talks to no backend.
 *
 * specscore: https://specscore.md/features/extension-host-and-bridge
 * Verifies: extension-host-and-bridge#ac:manifest-add-success
 */
@Injectable({ providedIn: 'root' })
export class ExtensionRegistry {
  private readonly store = new Map<string, ExtensionRegistration>();

  /** Record a registration, overwriting any existing record with the same id. */
  create(registration: ExtensionRegistration): ExtensionRegistration {
    this.store.set(registration.id, registration);
    return registration;
  }

  /** Read a single registration by id, or `undefined` when absent. */
  get(id: string): ExtensionRegistration | undefined {
    return this.store.get(id);
  }

  /** True when a registration with the given id exists. */
  has(id: string): boolean {
    return this.store.has(id);
  }

  /** List all current registrations. */
  list(): readonly ExtensionRegistration[] {
    return [...this.store.values()];
  }

  /** Delete a registration by id; returns true when a record was removed. */
  delete(id: string): boolean {
    return this.store.delete(id);
  }
}
