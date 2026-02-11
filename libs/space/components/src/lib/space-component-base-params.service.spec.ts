import { TestBed } from '@angular/core/testing';
import { SneatUserService } from '@sneat/auth-core';
import {
  APP_INFO,
  ErrorLogger,
  LOGGER_FACTORY,
  NgModulePreloaderService,
} from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { SpaceComponentBaseParams } from './space-component-base-params.service';

describe('SpaceComponentBaseParams', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpaceComponentBaseParams,
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        { provide: LOGGER_FACTORY, useValue: { getLogger: () => console } },
        {
          provide: APP_INFO,
          useValue: { appId: 'test', appTitle: 'Test' },
        },
        {
          provide: SneatUserService,
          useValue: { userState: { subscribe: vi.fn() } },
        },
        {
          provide: SpaceNavService,
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
        { provide: NgModulePreloaderService, useValue: { preload: vi.fn() } },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(SpaceComponentBaseParams)).toBeTruthy();
  });
});
