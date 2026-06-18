import { Injectable, inject } from '@angular/core';
import { ConsentStore } from './consent-store.service';
import {
  CONTACT_PICKER,
  GATEWAY_DATA_SOURCE,
  RawContact,
} from './gateway-data-source';
import {
  BasicContactDto,
  ContactWithDetailsDto,
  GATEWAY_METHODS,
  GatewayMethodName,
  getGatewayMethod,
  isGatewayMethod,
} from './gateway-methods';
import { RpcDispatcher, RpcHandler } from './rpc-dispatcher';

/**
 * The parent-side, scope-enforced read gateway. It answers an untrusted
 * extension's data requests arriving over F1's origin-verified bridge:
 *
 * - it dispatches a request to one of the four whitelisted methods, rejecting
 *   any non-whitelisted method name with an error and no data;
 * - for a scope-gated method it RE-READS F2's consent store on every call and
 *   denies when the required scope is not currently granted (never granted,
 *   declined, or revoked) — revocation is observed because nothing is cached;
 * - `contacts.pick` is user-mediated and requires no scope;
 * - it executes against the existing Sneat data services using the signed-in
 *   user's own session and returns only sanitized DTOs — never a token,
 *   credential, or service handle.
 *
 * specscore: https://specscore.md/features/protected-data-gateway
 * Verifies: protected-data-gateway#ac:granted-scope-returns-data
 * Verifies: protected-data-gateway#ac:ungranted-scope-denied
 * Verifies: protected-data-gateway#ac:revoked-scope-denied-on-next-call
 * Verifies: protected-data-gateway#ac:unknown-method-rejected
 * Verifies: protected-data-gateway#ac:no-credential-reaches-iframe
 * Verifies: protected-data-gateway#ac:results-limited-to-scope
 * Verifies: protected-data-gateway#ac:contact-picker-permissionless
 * Verifies: protected-data-gateway#ac:contacts-details-field-gated
 */

/** Identifies the call: which extension (origin-verified) and which user. */
export interface GatewayCallContext {
  /** The signed-in user's id. */
  readonly userId: string;
  /** Extension id = origin `host[:port]`, resolved by F1's bridge. */
  readonly extId: string;
}

/**
 * Thrown when a method call is denied. The dispatcher maps it to an RPC error
 * response carrying no data. The message never includes any user data.
 */
export class GatewayDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GatewayDeniedError';
  }
}

@Injectable({ providedIn: 'root' })
export class ProtectedDataGateway {
  private readonly consent = inject(ConsentStore);
  private readonly dataSource = inject(GATEWAY_DATA_SOURCE);
  private readonly picker = inject(CONTACT_PICKER);

  /**
   * Execute a whitelisted gateway method for `(user, extension)`. Rejects
   * (throws) when the method is not whitelisted or its required scope is not
   * currently granted. Returns only sanitized DTOs.
   */
  async handle(method: string, ctx: GatewayCallContext): Promise<unknown> {
    if (!isGatewayMethod(method)) {
      throw new GatewayDeniedError(`Unknown gateway method "${method}".`);
    }
    this.enforce(method, ctx);
    return this.execute(method, ctx);
  }

  /**
   * Build an {@link RpcHandler} bound to a single extension, ready to register
   * on F1's {@link RpcDispatcher}. `resolveUserId` supplies the signed-in user
   * at call time so a session change is always observed.
   */
  handlerFor(extId: string, resolveUserId: () => string): RpcHandler {
    return (_payload, request) =>
      this.handle(request.type, { userId: resolveUserId(), extId });
  }

  /**
   * Register this gateway's whitelisted methods on `dispatcher` for one
   * extension. Returns the dispatcher for chaining. Non-whitelisted method
   * names are not registered, so the dispatcher rejects them.
   */
  registerOn(
    dispatcher: RpcDispatcher,
    extId: string,
    resolveUserId: () => string,
  ): RpcDispatcher {
    const handler = this.handlerFor(extId, resolveUserId);
    for (const spec of GATEWAY_METHODS) {
      dispatcher.register(spec.name, handler);
    }
    return dispatcher;
  }

  /**
   * Scope-enforcement core: re-reads the consent store on every scope-gated
   * call. User-mediated methods are exempt. Throws {@link GatewayDeniedError}
   * when the required scope is not currently granted.
   */
  private enforce(method: GatewayMethodName, ctx: GatewayCallContext): void {
    const spec = getGatewayMethod(method);
    if (!spec || spec.gate.kind === 'user-mediated') {
      return;
    }
    if (!this.consent.isGranted(ctx.userId, ctx.extId, spec.gate.scope)) {
      throw new GatewayDeniedError(
        `Scope "${spec.gate.scope}" is not granted for "${method}".`,
      );
    }
  }

  private async execute(
    method: GatewayMethodName,
    ctx: GatewayCallContext,
  ): Promise<unknown> {
    switch (method) {
      case 'profile.get':
        return this.dataSource.getProfile(ctx.userId);
      case 'contactDetails.get':
        return this.dataSource.getOwnContactDetails(ctx.userId);
      case 'contacts.pick':
        return this.pickContact(ctx);
      case 'contacts.list':
        return this.listContacts(ctx);
    }
  }

  /** User-mediated: return only the one contact the user picked. */
  private async pickContact(
    ctx: GatewayCallContext,
  ): Promise<BasicContactDto | undefined> {
    const picked = await this.picker.pickOne(ctx.userId);
    if (!picked) {
      throw new GatewayDeniedError('No contact was selected.');
    }
    return toBasicContact(picked);
  }

  /**
   * Enumerate contacts as basic fields, then field-gate detail fields behind a
   * second consent-store lookup for `contacts_details:read`.
   */
  private async listContacts(
    ctx: GatewayCallContext,
  ): Promise<ContactWithDetailsDto[]> {
    const contacts = await this.dataSource.listContacts(ctx.userId);
    const includeDetails = this.consent.isGranted(
      ctx.userId,
      ctx.extId,
      'contacts_details:read',
    );
    return contacts.map((c) =>
      includeDetails ? toContactWithDetails(c) : toBasicContact(c),
    );
  }
}

/** Map a raw contact to the basic-only DTO, dropping detail fields. */
function toBasicContact(c: BasicContactDto): BasicContactDto {
  return { id: c.id, names: c.names, roles: c.roles };
}

/** Map a raw contact to the with-details DTO, including only detail fields. */
function toContactWithDetails(c: RawContact): ContactWithDetailsDto {
  return {
    id: c.id,
    names: c.names,
    roles: c.roles,
    ...(c.email !== undefined ? { email: c.email } : {}),
    ...(c.phone !== undefined ? { phone: c.phone } : {}),
  };
}
