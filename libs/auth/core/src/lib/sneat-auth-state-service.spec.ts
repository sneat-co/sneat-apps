import { TestBed } from '@angular/core/testing';
import { Auth, UserCredential } from '@angular/fire/auth';
import { AnalyticsService, ErrorLogger } from '@sneat/core';
import {
  SneatAuthStateService,
  AuthStatuses,
} from './sneat-auth-state-service';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { firstValueFrom, Observer } from 'rxjs';
import { User } from '@angular/fire/auth';

// Mock Capacitor
vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn().mockReturnValue(false),
  },
}));

// Mock Firebase Authentication
vi.mock('@capacitor-firebase/authentication', () => ({
  FirebaseAuthentication: {
    signInWithGoogle: vi.fn(),
    signInWithApple: vi.fn(),
    signInWithFacebook: vi.fn(),
    signInWithMicrosoft: vi.fn(),
  },
}));

// Mock firebase/auth with proper constructor mocks
vi.mock('firebase/auth', () => {
  class MockGoogleAuthProvider {}
  class MockOAuthProvider {
    credential = vi.fn();
  }
  class MockGithubAuthProvider {
    addScope = vi.fn();
  }
  class MockFacebookAuthProvider {
    addScope = vi.fn();
  }

  return {
    GoogleAuthProvider: MockGoogleAuthProvider,
    OAuthProvider: MockOAuthProvider,
    GithubAuthProvider: MockGithubAuthProvider,
    FacebookAuthProvider: MockFacebookAuthProvider,
    signInWithEmailLink: vi.fn().mockResolvedValue({ user: { uid: 'test' } }),
    signInWithCustomToken: vi.fn().mockResolvedValue({ user: { uid: 'test' } }),
    signInWithPopup: vi.fn().mockResolvedValue({ user: { uid: 'test' } }),
    linkWithPopup: vi.fn().mockResolvedValue({ user: { uid: 'test' } }),
    unlink: vi.fn().mockResolvedValue({ uid: 'test', providerData: [] }),
    signInWithCredential: vi.fn().mockResolvedValue({ user: { uid: 'test' } }),
    getAuth: vi.fn().mockReturnValue({}),
  };
});

describe('SneatAuthStateService', () => {
  let service: SneatAuthStateService;
  let authMock: {
    onIdTokenChanged: Mock;
    onAuthStateChanged: Mock;
    signOut: Mock;
    currentUser: User | null;
  };
  let onAuthStateChangedCallback: Observer<User | null>;
  let onIdTokenChangedCallback: Observer<User | null>;

  beforeEach(() => {
    authMock = {
      onIdTokenChanged: vi.fn().mockImplementation((obs) => {
        onIdTokenChangedCallback = obs;
      }),
      onAuthStateChanged: vi.fn().mockImplementation((obs) => {
        onAuthStateChangedCallback = obs;
      }),
      signOut: vi.fn().mockResolvedValue(undefined),
      currentUser: null,
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

    onAuthStateChangedCallback.next(fbUser as unknown as User);

    const status = await firstValueFrom(service.authStatus);
    expect(status).toBe(AuthStatuses.authenticated);

    const user = await firstValueFrom(service.authUser);
    expect(user?.uid).toBe('u1');
  });

  it('should call fbAuth.signOut when signOut is called', async () => {
    await service.signOut();
    expect(authMock.signOut).toHaveBeenCalled();
  });

  it('should handle null user in onAuthStateChanged', async () => {
    onAuthStateChangedCallback.next(null);

    const status = await firstValueFrom(service.authStatus);
    expect(status).toBe(AuthStatuses.notAuthenticated);

    const user = await firstValueFrom(service.authUser);
    expect(user).toBeNull();
  });

  it('should handle user with multiple providerData', async () => {
    const fbUser = {
      uid: 'u2',
      isAnonymous: false,
      emailVerified: true,
      email: 'multi@example.com',
      providerId: 'firebase',
      providerData: [
        { providerId: 'google.com', uid: 'g123' },
        { providerId: 'facebook.com', uid: 'f456' },
      ],
    };

    onAuthStateChangedCallback.next(fbUser as unknown as User);

    const user = await firstValueFrom(service.authUser);
    expect(user?.uid).toBe('u2');
    expect(user?.providerId).toBe('firebase');
  });

  it('should handle user with single providerData', async () => {
    const fbUser = {
      uid: 'u3',
      isAnonymous: false,
      emailVerified: true,
      email: 'single@example.com',
      providerId: 'firebase',
      providerData: [{ providerId: 'google.com', uid: 'g789' }],
    };

    onAuthStateChangedCallback.next(fbUser as unknown as User);

    const user = await firstValueFrom(service.authUser);
    expect(user?.providerId).toBe('google.com');
  });

  it('should handle onIdTokenChanged with authenticated user', async () => {
    const fbUser = {
      uid: 'u4',
      isAnonymous: false,
      emailVerified: true,
      email: 'token@example.com',
      providerId: 'google.com',
      providerData: [],
      getIdToken: vi.fn().mockResolvedValue('mock-token-123'),
    };

    // First set auth user
    onAuthStateChangedCallback.next(fbUser as unknown as User);

    // Then trigger token changed
    onIdTokenChangedCallback.next(fbUser as unknown as User);

    // Wait for async operations
    await new Promise((resolve) => setTimeout(resolve, 10));

    const state = await firstValueFrom(service.authState);
    expect(state.status).toBe(AuthStatuses.authenticated);
    expect(state.token).toBe('mock-token-123');
  });

  it('should handle error in getIdToken', async () => {
    const errorLogger = TestBed.inject(ErrorLogger);
    const fbUser = {
      uid: 'u5',
      isAnonymous: false,
      emailVerified: true,
      email: 'error@example.com',
      providerId: 'google.com',
      providerData: [],
      getIdToken: vi.fn().mockRejectedValue(new Error('Token error')),
    };

    onAuthStateChangedCallback.next(fbUser as unknown as User);
    onIdTokenChangedCallback.next(fbUser as unknown as User);

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(errorLogger.logError).toHaveBeenCalled();
  });

  it('should handle error in onAuthStateChanged', () => {
    const errorLogger = TestBed.inject(ErrorLogger);
    const error = new Error('Auth state error');

    onAuthStateChangedCallback.error(error);

    expect(errorLogger.logError).toHaveBeenCalledWith(
      error,
      'failed to retrieve Firebase auth user information',
    );
  });

  it('should handle error in onIdTokenChanged', () => {
    const errorLogger = TestBed.inject(ErrorLogger);
    const error = new Error('Token changed error');

    onIdTokenChangedCallback.error(error);

    expect(errorLogger.logError).toHaveBeenCalledWith(
      error,
      'failed in fbAuth.onIdTokenChanged',
    );
  });

  describe('signInWithToken', () => {
    it('should call signInWithCustomToken', async () => {
      const { signInWithCustomToken } = await import('firebase/auth');
      const mockCredential = { user: { uid: 'test' } } as UserCredential;
      (signInWithCustomToken as Mock).mockResolvedValue(mockCredential);

      const result = await service.signInWithToken('custom-token');

      expect(signInWithCustomToken).toHaveBeenCalledWith(
        authMock,
        'custom-token',
      );
      expect(result).toBe(mockCredential);
    });
  });

  describe('signInWithEmailLink', () => {
    it('should return observable that calls signInWithEmailLink', async () => {
      const { signInWithEmailLink } = await import('firebase/auth');

      const result = await firstValueFrom(
        service.signInWithEmailLink('test@example.com'),
      );

      expect(signInWithEmailLink).toHaveBeenCalled();
      expect(result.user.uid).toBe('test');
    });
  });

  describe('linkWith', () => {
    it('should reject if no current user', async () => {
      authMock.currentUser = null;

      await expect(service.linkWith('google.com')).rejects.toBe(
        'no current user',
      );
    });

    it('should link provider to current user', async () => {
      const { linkWithPopup } = await import('firebase/auth');
      const mockUser = { uid: 'current-user' } as User;
      authMock.currentUser = mockUser;

      const result = await service.linkWith('google.com');

      expect(linkWithPopup).toHaveBeenCalled();
      expect(result?.user.uid).toBe('test');
    });
  });

  describe('unlinkAuthProvider', () => {
    it('should reject if no current user', async () => {
      authMock.currentUser = null;

      await expect(service.unlinkAuthProvider('google.com')).rejects.toBe(
        'No user is currently signed in.',
      );
    });

    it('should unlink auth provider from current user', async () => {
      const { unlink } = await import('firebase/auth');
      const mockUser = {
        uid: 'current-user',
        isAnonymous: false,
        emailVerified: true,
        providerData: [],
      } as unknown as User;
      authMock.currentUser = mockUser;

      await service.unlinkAuthProvider('google.com');

      expect(unlink).toHaveBeenCalledWith(mockUser, 'google.com');
    });

    it('should handle unlink error', async () => {
      const { unlink } = await import('firebase/auth');
      const mockUser = { uid: 'current-user' } as User;
      authMock.currentUser = mockUser;
      const error = new Error('Unlink failed');
      (unlink as Mock).mockRejectedValueOnce(error);

      await expect(service.unlinkAuthProvider('google.com')).rejects.toMatch(
        /Failed to unlink google.com account/,
      );
    });
  });
});
