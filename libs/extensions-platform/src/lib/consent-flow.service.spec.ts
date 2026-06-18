import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConsentDecision } from './consent-dialog.component';
import { ConsentStore } from './consent-store.service';
import {
  CONSENT_DIALOG_PRESENTER,
  ConsentFlowContext,
  ConsentFlowService,
  ConsentPromptRequest,
} from './consent-flow.service';
import { ScopeId } from './scope-catalog';

/** A scripted presenter that grants the given scopes and declines the rest. */
function presenterGranting(granted: ScopeId[]) {
  const grantedSet = new Set(granted);
  const calls: ConsentPromptRequest[] = [];
  const present = vi.fn(
    async (request: ConsentPromptRequest): Promise<ConsentDecision> => {
      calls.push(request);
      return {
        decisions: request.scopes.map((s) => ({
          scope: s.id,
          granted: grantedSet.has(s.id),
        })),
      };
    },
  );
  return { present, calls };
}

function context(over: Partial<ConsentFlowContext> = {}): ConsentFlowContext {
  return {
    userId: 'user',
    extId: 'listus.app',
    extensionName: 'Listus',
    origin: 'https://listus.app',
    requestedScopes: ['profile:read', 'contact_details:read', 'contacts:read'],
    ...over,
  };
}

function setup(presenter: { present: unknown }) {
  TestBed.configureTestingModule({
    providers: [{ provide: CONSENT_DIALOG_PRESENTER, useValue: presenter }],
  });
  return {
    flow: TestBed.inject(ConsentFlowService),
    store: TestBed.inject(ConsentStore),
  };
}

describe('ConsentFlowService — install-time consent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  // AC: granular-grant-and-decline
  it('records granted scopes as granted and does not grant declined ones', async () => {
    const presenter = presenterGranting(['profile:read', 'contacts:read']);
    const { flow, store } = setup(presenter);

    const grantedNow = await flow.runInstallConsent(context());

    expect(grantedNow.sort()).toEqual(['contacts:read', 'profile:read']);
    expect(store.isGranted('user', 'listus.app', 'profile:read')).toBe(true);
    expect(store.isGranted('user', 'listus.app', 'contacts:read')).toBe(true);
    expect(store.isGranted('user', 'listus.app', 'contact_details:read')).toBe(
      false,
    );
  });

  // AC: unknown-scope-rejected
  it('never offers or grants a scope outside the catalog', async () => {
    const presenter = presenterGranting(['profile:read']);
    const { flow, store } = setup(presenter);

    await flow.runInstallConsent(
      context({ requestedScopes: ['profile:read', 'files:write'] }),
    );

    expect(presenter.calls[0].scopes.map((s) => s.id)).toEqual([
      'profile:read',
    ]);
    expect(store.isGranted('user', 'listus.app', 'files:write')).toBe(false);
  });

  it('records nothing as granted when the user declines everything', async () => {
    const presenter = presenterGranting([]);
    const { flow, store } = setup(presenter);

    const grantedNow = await flow.runInstallConsent(context());

    expect(grantedNow).toEqual([]);
    expect(store.listGranted('user', 'listus.app')).toEqual([]);
  });

  it('shows no dialog and grants nothing when no catalog scope is requested', async () => {
    const presenter = presenterGranting([]);
    const { flow } = setup(presenter);

    const grantedNow = await flow.runInstallConsent(
      context({ requestedScopes: ['files:write'] }),
    );

    expect(grantedNow).toEqual([]);
    expect(presenter.present).not.toHaveBeenCalled();
  });
});

describe('ConsentFlowService — incremental re-consent', () => {
  beforeEach(() => TestBed.resetTestingModule());

  // AC: incremental-consent-on-new-scope
  it('prompts only for not-yet-decided scopes and leaves prior grants untouched', async () => {
    const presenter = presenterGranting(['contacts:read']);
    const { flow, store } = setup(presenter);
    store.recordGrant('user', 'listus.app', 'profile:read');

    const grantedNow = await flow.runIncrementalConsent(
      context({ requestedScopes: ['profile:read', 'contacts:read'] }),
    );

    expect(presenter.calls[0].scopes.map((s) => s.id)).toEqual([
      'contacts:read',
    ]);
    expect(grantedNow).toEqual(['contacts:read']);
    expect(store.isGranted('user', 'listus.app', 'profile:read')).toBe(true);
    expect(store.isGranted('user', 'listus.app', 'contacts:read')).toBe(true);
  });

  it('a newly-requested scope stays not-granted if the user declines it', async () => {
    const presenter = presenterGranting([]);
    const { flow, store } = setup(presenter);
    store.recordGrant('user', 'listus.app', 'profile:read');

    await flow.runIncrementalConsent(
      context({ requestedScopes: ['profile:read', 'contacts:read'] }),
    );

    expect(store.isGranted('user', 'listus.app', 'contacts:read')).toBe(false);
  });

  it('shows no dialog when every requested scope is already decided', async () => {
    const presenter = presenterGranting([]);
    const { flow, store } = setup(presenter);
    store.recordGrant('user', 'listus.app', 'profile:read');
    store.recordDecline('user', 'listus.app', 'contacts:read');

    const grantedNow = await flow.runIncrementalConsent(
      context({ requestedScopes: ['profile:read', 'contacts:read'] }),
    );

    expect(grantedNow).toEqual([]);
    expect(presenter.present).not.toHaveBeenCalled();
  });
});
