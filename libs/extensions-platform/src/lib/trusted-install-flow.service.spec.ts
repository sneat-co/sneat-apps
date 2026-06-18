import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  CONSENT_DIALOG_PRESENTER,
  ConsentDialogPresenter,
} from './consent-flow.service';
import { ExtensionRegistry } from './extension-registry.service';
import { FrameSrcAllowlistService } from './frame-src-allowlist.service';
import {
  FULL_ACCESS_DISCLOSURE_PRESENTER,
  FullAccessDisclosurePresenter,
  TrustedInstallFlowService,
} from './trusted-install-flow.service';

const TRUSTED_ORIGIN = 'https://listus.app';
const UNTRUSTED_ORIGIN = 'https://acme.example';

function manifestFor(origin: string): unknown {
  return {
    name: 'Ext',
    author: { name: 'Jane', email: 'jane@example.com' },
    icon: `${origin}/icon.png`,
    scopes: ['contacts:read'],
    origin,
  };
}

function okResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as unknown as Response;
}

interface Harness {
  service: TrustedInstallFlowService;
  registry: ExtensionRegistry;
  allowlist: FrameSrcAllowlistService;
  disclose: FullAccessDisclosurePresenter & {
    present: ReturnType<typeof vi.fn>;
  };
  consentDialog: ConsentDialogPresenter & { present: ReturnType<typeof vi.fn> };
}

function setup(disclosureAccepts: boolean): Harness {
  const disclose = { present: vi.fn(async () => disclosureAccepts) };
  const consentDialog = {
    present: vi.fn(async () => ({ decisions: [] })),
  };
  TestBed.configureTestingModule({
    providers: [
      { provide: FULL_ACCESS_DISCLOSURE_PRESENTER, useValue: disclose },
      { provide: CONSENT_DIALOG_PRESENTER, useValue: consentDialog },
    ],
  });
  return {
    service: TestBed.inject(TrustedInstallFlowService),
    registry: TestBed.inject(ExtensionRegistry),
    allowlist: TestBed.inject(FrameSrcAllowlistService),
    disclose,
    consentDialog,
  };
}

describe('TrustedInstallFlowService', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    document.getElementById('sneat-ext-frame-src-csp')?.remove();
  });

  afterEach(() => vi.restoreAllMocks());

  // AC: install-shows-full-access-disclosure
  it('trusted accept: shows disclosure (not consent dialog) and installs', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      okResponse(manifestFor(TRUSTED_ORIGIN)),
    );
    const h = setup(true);

    const outcome = await h.service.install(TRUSTED_ORIGIN, {
      userId: 'u1',
      extensionName: 'Listus',
    });

    expect(h.disclose.present).toHaveBeenCalledWith({
      extensionName: 'Listus',
      origin: TRUSTED_ORIGIN,
    });
    expect(h.consentDialog.present).not.toHaveBeenCalled();
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.trusted).toBe(true);
      expect(outcome.result.ok).toBe(true);
    }
    expect(h.registry.has('listus.app')).toBe(true);
    expect(h.allowlist.isAllowed(TRUSTED_ORIGIN)).toBe(true);
  });

  // AC: declined-disclosure-aborts-install
  it('trusted decline: aborts with nothing recorded, allowlisted, or fetched', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const h = setup(false);

    const outcome = await h.service.install(TRUSTED_ORIGIN, {
      userId: 'u1',
      extensionName: 'Listus',
    });

    expect(outcome.ok).toBe(false);
    expect(h.registry.has('listus.app')).toBe(false);
    expect(h.allowlist.isAllowed(TRUSTED_ORIGIN)).toBe(false);
    // Decline happens before registration, so no manifest is even fetched.
    expect(fetchMock).not.toHaveBeenCalled();
  });

  // AC: install-shows-full-access-disclosure (untrusted routing)
  it('untrusted: routes to per-scope consent and never shows the disclosure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      okResponse(manifestFor(UNTRUSTED_ORIGIN)),
    );
    const h = setup(true);

    const outcome = await h.service.install(UNTRUSTED_ORIGIN, {
      userId: 'u1',
      extensionName: 'Acme',
    });

    expect(h.disclose.present).not.toHaveBeenCalled();
    expect(h.consentDialog.present).toHaveBeenCalledTimes(1);
    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.trusted).toBe(false);
    }
    expect(h.registry.has('acme.example')).toBe(true);
  });
});
