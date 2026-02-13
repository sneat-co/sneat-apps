import { TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { AnalyticsService, ErrorLogger } from '@sneat/core';
import { SneatAuthStateService, AuthStatuses } from './sneat-auth-state-service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { firstValueFrom } from 'rxjs';

describe('SneatAuthStateService', () => {
  let service: SneatAuthStateService;
  let authMock: any;
  let onIdTokenChangedCallback: any;
  let onAuthStateChangedCallback: any;

  beforeEach(() => {
    authMock = {
      onIdTokenChanged: vi.fn().mockImplementation((obs) => {
        onIdTokenChangedCallback = obs;
      }),
      onAuthStateChanged: vi.fn().mockImplementation((obs) => {
        onAuthStateChangedCallback = obs;
      }),
      signOut: vi.fn().mockResolvedValue(undefined),
    };

    TestBed.configureTestingModule({
      providers: [
        SneatAuthStateService,
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: AnalyticsService,
          useValue: {
            identify: vi.fn(),
            logEvent: vi.fn(),
          },
        },
        {
          provide: Auth,
          useValue: authMock,
        },
      ],
    });
    service = TestBed.inject(SneatAuthStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update auth status when onAuthStateChanged triggers', async () => {
    const fbUser = {
      uid: 'u1',
      isAnonymous: false,
      emailVerified: true,
      email: 'test@example.com',
      providerId: 'password',
      providerData: [],
    };

    onAuthStateChangedCallback.next(fbUser);

    const status = await firstValueFrom(service.authStatus);
    expect(status).toBe(AuthStatuses.authenticated);
    
    const user = await firstValueFrom(service.authUser);
    expect(user?.uid).toBe('u1');
  });

  it('should call fbAuth.signOut when signOut is called', async () => {
    await service.signOut();
    expect(authMock.signOut).toHaveBeenCalled();
  });
});
