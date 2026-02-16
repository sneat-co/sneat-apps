import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService, SneatUserService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { SpaceServiceModule } from './space-service.module';
import { SpaceService } from './space.service';

describe('SpaceServiceModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SpaceServiceModule],
      providers: [
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: Firestore,
          useValue: { type: 'Firestore', toJSON: () => ({}) },
        },
        {
          provide: SneatUserService,
          useValue: { userState: of({ record: undefined }) },
        },
        {
          provide: SneatApiService,
          useValue: { post: vi.fn(), get: vi.fn() },
        },
        {
          provide: SneatAuthStateService,
          useValue: {
            authStatus: of('notAuthenticated'),
            authState: of({ status: 'notAuthenticated' }),
          },
        },
      ],
    });
  });

  it('should provide SpaceService', () => {
    const service = TestBed.inject(SpaceService);
    expect(service).toBeTruthy();
  });
});
