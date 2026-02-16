import { TestBed } from '@angular/core/testing';
import { LoginRequiredServiceService } from './login-required-service.service';
import { SneatAuthStateService } from './sneat-auth-state-service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LoginRequiredServiceService', () => {
  let authStateMock: { authState: ReturnType<typeof of> };

  beforeEach(() => {
    authStateMock = {
      authState: of({
        status: 'authenticated',
        user: { uid: 'test-uid', email: 'test@example.com' },
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        LoginRequiredServiceService,
        {
          provide: SneatAuthStateService,
          useValue: authStateMock,
        },
      ],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(LoginRequiredServiceService);
    expect(service).toBeTruthy();
  });

  it('should subscribe to auth state changes', () => {
    const subscribeSpy = vi.spyOn(authStateMock.authState, 'subscribe');
    TestBed.inject(LoginRequiredServiceService);
    expect(subscribeSpy).toHaveBeenCalled();
  });
});
