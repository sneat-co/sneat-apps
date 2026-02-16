import { TestBed } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import { SneatAuthStateService } from './sneat-auth-state-service';
import { TelegramAuthService } from './telegram-auth.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';

describe('TelegramAuthService', () => {
  let service: TelegramAuthService;
  let sneatApiServiceMock: { postAsAnonymous: ReturnType<typeof vi.fn> };
  let authStateServiceMock: { signInWithToken: ReturnType<typeof vi.fn> };
  let errorLoggerMock: { logErrorHandler: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    sneatApiServiceMock = {
      postAsAnonymous: vi.fn(),
    };

    authStateServiceMock = {
      signInWithToken: vi.fn().mockResolvedValue({}),
    };

    errorLoggerMock = {
      logErrorHandler: vi.fn().mockReturnValue((err: unknown) => {
        console.error(err);
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        TelegramAuthService,
        {
          provide: ErrorLogger,
          useValue: errorLoggerMock,
        },
        {
          provide: SneatAuthStateService,
          useValue: authStateServiceMock,
        },
        {
          provide: SneatApiService,
          useValue: sneatApiServiceMock,
        },
      ],
    });
    service = TestBed.inject(TelegramAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not authenticate if Telegram WebApp is not available', () => {
    delete (window as unknown as { Telegram?: unknown }).Telegram;

    service.authenticateIfTelegramWebApp();

    expect(sneatApiServiceMock.postAsAnonymous).not.toHaveBeenCalled();
  });

  it('should not authenticate if Telegram WebApp initData is missing', () => {
    (
      window as unknown as { Telegram: { WebApp: { initData?: unknown } } }
    ).Telegram = {
      WebApp: {},
    };

    service.authenticateIfTelegramWebApp();

    expect(sneatApiServiceMock.postAsAnonymous).not.toHaveBeenCalled();
  });

  it('should authenticate with Telegram WebApp', () => {
    const mockInitData = 'test-init-data';
    const mockToken = 'firebase-token-123';
    const mockReady = vi.fn();

    (
      window as unknown as {
        Telegram: { WebApp: { initData: string; ready: () => void } };
      }
    ).Telegram = {
      WebApp: {
        initData: mockInitData,
        ready: mockReady,
      },
    };

    sneatApiServiceMock.postAsAnonymous.mockReturnValue(
      of({ token: mockToken }),
    );

    service.authenticateIfTelegramWebApp();

    expect(sneatApiServiceMock.postAsAnonymous).toHaveBeenCalledWith(
      'auth/login-from-telegram-miniapp',
      mockInitData,
    );
  });

  it('should call signInWithToken on successful API response', async () => {
    const mockInitData = 'test-init-data';
    const mockToken = 'firebase-token-123';
    const mockReady = vi.fn();

    (
      window as unknown as {
        Telegram: { WebApp: { initData: string; ready: () => void } };
      }
    ).Telegram = {
      WebApp: {
        initData: mockInitData,
        ready: mockReady,
      },
    };

    sneatApiServiceMock.postAsAnonymous.mockReturnValue(
      of({ token: mockToken }),
    );

    service.authenticateIfTelegramWebApp();

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(authStateServiceMock.signInWithToken).toHaveBeenCalledWith(
      mockToken,
    );
    expect(mockReady).toHaveBeenCalled();
  });

  it('should handle API error gracefully', () => {
    const mockInitData = 'test-init-data';

    (
      window as unknown as { Telegram: { WebApp: { initData: string } } }
    ).Telegram = {
      WebApp: {
        initData: mockInitData,
      },
    };

    sneatApiServiceMock.postAsAnonymous.mockReturnValue(
      throwError(() => new Error('API Error')),
    );

    service.authenticateIfTelegramWebApp();

    expect(sneatApiServiceMock.postAsAnonymous).toHaveBeenCalled();
    expect(errorLoggerMock.logErrorHandler).toHaveBeenCalledWith(
      'Failed to get Firebase auth token issued using telegram web-app credentials',
    );
  });

  it('should handle signInWithToken error gracefully', async () => {
    const mockInitData = 'test-init-data';
    const mockToken = 'firebase-token-123';

    (
      window as unknown as {
        Telegram: { WebApp: { initData: string; ready: () => void } };
      }
    ).Telegram = {
      WebApp: {
        initData: mockInitData,
        ready: vi.fn(),
      },
    };

    sneatApiServiceMock.postAsAnonymous.mockReturnValue(
      of({ token: mockToken }),
    );

    authStateServiceMock.signInWithToken.mockRejectedValue(
      new Error('Sign in error'),
    );

    service.authenticateIfTelegramWebApp();

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(errorLoggerMock.logErrorHandler).toHaveBeenCalledWith(
      'Failed to sign-in to Firebase auth with a token issued for telegram web-app credentials',
    );
  });
});
