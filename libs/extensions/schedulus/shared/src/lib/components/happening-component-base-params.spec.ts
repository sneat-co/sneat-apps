import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular/standalone';
import { SneatApiService } from '@sneat/api';
import {
  ErrorLogger,
  APP_INFO,
  LOGGER_FACTORY,
  AnalyticsService,
  NgModulePreloaderService,
} from '@sneat/core';
import { SneatUserService, SneatAuthStateService } from '@sneat/auth-core';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { NavController } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { CalendariumSpaceService } from '../services/calendarium-space.service';
import { HappeningService } from '../services/happening.service';
import { HappeningComponentBaseParams } from './happening-component-base-params';

vi.mock('@angular/fire/firestore');

describe('HappeningComponentBaseParams', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HappeningComponentBaseParams,
        SpaceComponentBaseParams,
        { provide: HappeningService, useValue: {} },
        { provide: CalendariumSpaceService, useValue: {} },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        { provide: APP_INFO, useValue: { appId: 'test', appTitle: 'Test' } },
        { provide: LOGGER_FACTORY, useValue: { getLogger: () => console } },
        { provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
        {
          provide: SpaceNavService,
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
        { provide: NgModulePreloaderService, useValue: { preload: vi.fn() } },
        { provide: SpaceService, useValue: {} },
        {
          provide: SneatUserService,
          useValue: {
            user$: of({}),
            userState: of({}),
            userChanged: of(undefined),
            currentUserID: undefined,
          },
        },
        {
          provide: SneatAuthStateService,
          useValue: {
            authState: of({ status: 'notAuthenticated' }),
            authStatus: of('notAuthenticated'),
          },
        },
        { provide: NavController, useValue: {} },
        { provide: Firestore, useValue: {} },
        {
          provide: SneatApiService,
          useValue: { post: vi.fn(() => of({})), get: vi.fn(() => of({})) },
        },
        { provide: ModalController, useValue: {} },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(HappeningComponentBaseParams)).toBeTruthy();
  });
});
