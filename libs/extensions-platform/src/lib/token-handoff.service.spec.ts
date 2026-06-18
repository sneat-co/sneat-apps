import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PortLike } from './bridge-host';
import {
  FirebaseIdToken,
  TRUSTED_TOKEN_MESSAGE,
  TRUSTED_TOKEN_SOURCE,
  TokenHandoffService,
  TrustedTokenSource,
} from './token-handoff.service';

const TRUSTED = 'https://listus.app';
const UNTRUSTED = 'https://acme.example';

function fakePort(record: unknown[]): PortLike {
  return {
    postMessage: (m) => record.push(m),
    start: vi.fn(),
    onmessage: null,
    close: vi.fn(),
  };
}

function setup(source: TrustedTokenSource): TokenHandoffService {
  TestBed.configureTestingModule({
    providers: [{ provide: TRUSTED_TOKEN_SOURCE, useValue: source }],
  });
  return TestBed.inject(TokenHandoffService);
}

describe('TokenHandoffService', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // AC: trusted-receives-token-untrusted-does-not
  it('hands the token to a trusted iframe', async () => {
    const token: FirebaseIdToken = {
      token: 'id-token-1',
      expiresAt: Date.now() + 3_600_000,
    };
    const service = setup({ getIdToken: async () => token });
    const inbox: unknown[] = [];

    const started = await service.start(fakePort(inbox), TRUSTED);

    expect(started).toBe(true);
    expect(inbox).toContainEqual({
      type: TRUSTED_TOKEN_MESSAGE,
      token: 'id-token-1',
      expiresAt: token.expiresAt,
    });
  });

  // AC: trusted-receives-token-untrusted-does-not
  it('hands NO token to an untrusted iframe and starts no refresh', async () => {
    const getIdToken = vi.fn();
    const service = setup({ getIdToken });
    const inbox: unknown[] = [];

    const started = await service.start(fakePort(inbox), UNTRUSTED);

    expect(started).toBe(false);
    expect(inbox).toEqual([]);
    expect(getIdToken).not.toHaveBeenCalled();
  });

  // AC: token-only-to-verified-origin
  it('sends nothing to a non-allowlisted verified origin', async () => {
    const service = setup({
      getIdToken: async () => ({ token: 't', expiresAt: Date.now() + 1000 }),
    });
    const inbox: unknown[] = [];
    await service.start(fakePort(inbox), 'https://evil.listus.app');
    expect(inbox).toEqual([]);
  });

  // AC: token-refreshed-before-expiry
  it('pushes a refreshed token to the same trusted port before expiry', async () => {
    let n = 0;
    const getIdToken = vi.fn(
      async (force: boolean): Promise<FirebaseIdToken> => {
        n += 1;
        return {
          token: `id-token-${n}`,
          expiresAt: Date.now() + 3_600_000,
          // record the force flag indirectly through token naming above
          ...(force ? {} : {}),
        };
      },
    );
    const service = setup({ getIdToken });
    const inbox: unknown[] = [];
    const port = fakePort(inbox);

    await service.start(port, TRUSTED);
    expect(inbox).toHaveLength(1);

    // Advance to just past the scheduled refresh (expiry - 5 min margin).
    await vi.advanceTimersByTimeAsync(3_600_000 - 5 * 60 * 1000 + 1);
    await Promise.resolve();

    expect(inbox).toHaveLength(2);
    expect(inbox[1]).toMatchObject({
      type: TRUSTED_TOKEN_MESSAGE,
      token: 'id-token-2',
    });
    // Refresh forced a fresh token from Firebase.
    expect(getIdToken).toHaveBeenLastCalledWith(true);
  });

  it('stop cancels a pending refresh', async () => {
    const getIdToken = vi.fn(async () => ({
      token: 't',
      expiresAt: Date.now() + 3_600_000,
    }));
    const service = setup({ getIdToken });
    const inbox: unknown[] = [];
    const port = fakePort(inbox);

    await service.start(port, TRUSTED);
    service.stop(port);
    await vi.advanceTimersByTimeAsync(3_600_000);

    expect(getIdToken).toHaveBeenCalledTimes(1);
  });
});
