import { TestBed } from '@angular/core/testing';
import {
  PrivateTokenStoreService,
  canceledByUser,
} from './private-token-store.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';

describe('PrivateTokenStoreService', () => {
  let service: PrivateTokenStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrivateTokenStoreService],
    });
    service = TestBed.inject(PrivateTokenStoreService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return token from localStorage if available', async () => {
    const domain = 'test.com';
    const projectId = 'proj123';
    const token = 'stored-token-123';

    localStorage.setItem(`private/tokens/${domain}/${projectId}`, token);

    const result = await firstValueFrom(
      service.getPrivateToken(domain, projectId),
    );
    expect(result).toBe(token);
  });

  it('should prompt user for token if not in localStorage', async () => {
    const domain = 'test.com';
    const projectId = 'proj456';
    const token = 'new-token-456';

    // Mock the global prompt function
    globalThis.prompt = vi.fn().mockReturnValue(token);

    const promise = firstValueFrom(service.getPrivateToken(domain, projectId));

    await new Promise((resolve) => setTimeout(resolve, 10));

    const result = await promise;
    expect(result).toBe(token);
    expect(localStorage.getItem(`private/tokens/${domain}/${projectId}`)).toBe(
      token,
    );

    // Cleanup
    delete (globalThis as { prompt?: unknown }).prompt;
  });

  it('should error with canceledByUser if user cancels prompt', async () => {
    const domain = 'test.com';
    const projectId = 'proj789';

    // Mock the global prompt function
    globalThis.prompt = vi.fn().mockReturnValue(null);

    const promise = firstValueFrom(service.getPrivateToken(domain, projectId));

    await new Promise((resolve) => setTimeout(resolve, 10));

    await expect(promise).rejects.toBe(canceledByUser);

    // Cleanup
    delete (globalThis as { prompt?: unknown }).prompt;
  });
});
