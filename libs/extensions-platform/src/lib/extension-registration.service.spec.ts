import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ExtensionRegistrationService } from './extension-registration.service';
import { ExtensionRegistry } from './extension-registry.service';
import { FrameSrcAllowlistService } from './frame-src-allowlist.service';

const ORIGIN = 'https://listus.app';

function validBody(over: Record<string, unknown> = {}): unknown {
  return {
    name: 'Listus',
    author: { name: 'Jane', email: 'jane@listus.app' },
    icon: 'https://listus.app/icon.png',
    scopes: ['lists:read', 'contacts:read'],
    origin: ORIGIN,
    ...over,
  };
}

function okResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    json: async () => body,
  } as unknown as Response;
}

describe('ExtensionRegistrationService', () => {
  let service: ExtensionRegistrationService;
  let registry: ExtensionRegistry;
  let allowlist: FrameSrcAllowlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtensionRegistrationService);
    registry = TestBed.inject(ExtensionRegistry);
    allowlist = TestBed.inject(FrameSrcAllowlistService);
    document.getElementById('sneat-ext-frame-src-csp')?.remove();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('records the extension and allowlists its origin on a valid add', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse(validBody()));

    const result = await service.add('https://listus.app/welcome');

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.registration.id).toBe('listus.app');
      expect(result.registration.scopes).toEqual([
        'lists:read',
        'contacts:read',
      ]);
    }
    expect(registry.has('listus.app')).toBe(true);
    expect(allowlist.isAllowed(ORIGIN)).toBe(true);
  });

  it('records and allowlists NOTHING when validation fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      okResponse(
        validBody({ author: { name: 'Jane', email: 'not-an-email' } }),
      ),
    );

    const result = await service.add(ORIGIN);

    expect(result.ok).toBe(false);
    expect(registry.list()).toEqual([]);
    expect(allowlist.isAllowed(ORIGIN)).toBe(false);
  });

  it('refuses a non-https URL up front', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const result = await service.add('http://listus.app');
    expect(result.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(registry.list()).toEqual([]);
  });

  it('deregistration deletes the record and drops the origin from the allowlist', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(okResponse(validBody()));
    await service.add(ORIGIN);
    expect(allowlist.isAllowed(ORIGIN)).toBe(true);

    expect(service.deregister('listus.app')).toBe(true);

    expect(registry.has('listus.app')).toBe(false);
    expect(allowlist.isAllowed(ORIGIN)).toBe(false);
    // A subsequent embed attempt is CSP-blocked because the origin is gone.
    expect(allowlist.frameSrcDirective()).not.toContain(ORIGIN);
  });

  it('deregistering an unknown id is a no-op', () => {
    expect(service.deregister('ghost.app')).toBe(false);
  });
});
