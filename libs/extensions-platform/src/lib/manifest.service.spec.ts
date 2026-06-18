import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ManifestService } from './manifest.service';

const ORIGIN = 'https://listus.app';

function validBody(over: Record<string, unknown> = {}): unknown {
  return {
    name: 'Listus',
    author: { name: 'Jane', email: 'jane@listus.app' },
    icon: 'https://listus.app/icon.png',
    scopes: ['lists:read'],
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

describe('ManifestService.fetchAndValidate', () => {
  let service: ManifestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManifestService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches the manifest from the well-known path and validates it', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(okResponse(validBody()));

    const result = await service.fetchAndValidate(
      'https://listus.app/some/page',
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://listus.app/.well-known/sneat-extension.json',
      expect.objectContaining({ credentials: 'omit' }),
    );
    expect(result.ok).toBe(true);
  });

  it('refuses a non-https URL without fetching', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    const result = await service.fetchAndValidate('http://listus.app');
    expect(result.ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('refuses when the manifest is unreachable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network'));
    const result = await service.fetchAndValidate(ORIGIN);
    expect(result.ok).toBe(false);
  });

  it('refuses when the manifest is missing (non-2xx)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);
    const result = await service.fetchAndValidate(ORIGIN);
    expect(result.ok).toBe(false);
  });

  it('refuses when the manifest is not valid JSON', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error('bad json');
      },
    } as unknown as Response);
    const result = await service.fetchAndValidate(ORIGIN);
    expect(result.ok).toBe(false);
  });

  it('refuses when validation fails (origin mismatch)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      okResponse(validBody({ origin: 'https://evil.app' })),
    );
    const result = await service.fetchAndValidate(ORIGIN);
    expect(result.ok).toBe(false);
  });
});
