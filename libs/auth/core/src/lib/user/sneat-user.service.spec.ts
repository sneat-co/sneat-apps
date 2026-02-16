import { TestBed } from '@angular/core/testing';
import {
  Firestore as AngularFirestore,
  CollectionReference,
} from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger } from '@sneat/core';
import {
  SneatAuthStateService,
  ISneatAuthState,
} from '../sneat-auth-state-service';
import { UserRecordService } from './user-record.service';
import { SneatUserService } from './sneat-user.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, Subject, firstValueFrom } from 'rxjs';

// Mock firestore functions
vi.mock('@angular/fire/firestore', async () => {
  const actual = await vi.importActual('@angular/fire/firestore');
  return {
    ...actual,
    collection: vi
      .fn()
      .mockReturnValue({ id: 'users' } as unknown as CollectionReference),
    doc: vi.fn(),
    onSnapshot: vi.fn(),
  };
});

describe('SneatUserService', () => {
  let service: SneatUserService;
  let authStateSubject: Subject<ISneatAuthState>;
  let sneatApiServiceMock: { post: ReturnType<typeof vi.fn> };
  let userRecordServiceMock: { initUserRecord: ReturnType<typeof vi.fn> };
  let firestoreMock: Record<string, unknown>;

  beforeEach(() => {
    authStateSubject = new Subject<ISneatAuthState>();

    sneatApiServiceMock = {
      post: vi.fn().mockReturnValue(of(void 0)),
    };

    userRecordServiceMock = {
      initUserRecord: vi
        .fn()
        .mockReturnValue(of({ id: 'user123', title: 'Test User' })),
    };

    firestoreMock = {
      app: {},
      type: 'firestore',
    };

    TestBed.configureTestingModule({
      providers: [
        SneatUserService,
        {
          provide: AngularFirestore,
          useValue: firestoreMock,
        },
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn().mockReturnValue(() => undefined),
          },
        },
        {
          provide: SneatAuthStateService,
          useValue: {
            authState: authStateSubject.asObservable(),
          },
        },
        {
          provide: SneatApiService,
          useValue: sneatApiServiceMock,
        },
        {
          provide: UserRecordService,
          useValue: userRecordServiceMock,
        },
      ],
    });

    service = TestBed.inject(SneatUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have currentUserID as undefined initially', () => {
    expect(service.currentUserID).toBeUndefined();
  });

  it('should call setUserCountry with correct parameters', async () => {
    const countryID = 'US';
    await firstValueFrom(service.setUserCountry(countryID));
    expect(sneatApiServiceMock.post).toHaveBeenCalledWith(
      'users/set_user_country',
      { countryID },
    );
  });

  it('should update currentUserID when user signs in', () => {
    const authState: ISneatAuthState = {
      status: 'authenticated',
      user: {
        uid: 'test-uid-123',
        email: 'test@example.com',
        emailVerified: true,
        displayName: 'Test User',
        providerId: 'google.com',
        isAnonymous: false,
        providerData: [],
        photoURL: null,
        phoneNumber: null,
      },
    };

    service.onUserSignedIn(authState);

    expect(service.currentUserID).toBe('test-uid-123');
  });

  it('should not change currentUserID if uid is the same', () => {
    const authState: ISneatAuthState = {
      status: 'authenticated',
      user: {
        uid: 'test-uid-123',
        email: 'test@example.com',
        emailVerified: true,
        displayName: 'Test User',
        providerId: 'google.com',
        isAnonymous: false,
        providerData: [],
        photoURL: null,
        phoneNumber: null,
      },
    };

    service.onUserSignedIn(authState);
    const firstUserID = service.currentUserID;

    service.onUserSignedIn(authState); // Second call with same uid

    expect(service.currentUserID).toBe(firstUserID);
    expect(service.currentUserID).toBe('test-uid-123');
  });
});
