import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { PopoverController, NavController } from '@ionic/angular/standalone';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService, SneatUserService } from '@sneat/auth-core';
import {
  ErrorLogger,
  APP_INFO,
  LOGGER_FACTORY,
  AnalyticsService,
  NgModulePreloaderService,
} from '@sneat/core';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';
import { CalendarStateService } from '../../calendar-state.service';
import { CalendarDayTabComponent } from './calendar-day-tab.component';

vi.mock('@angular/fire/firestore');

describe('CalendarDayTabComponent', () => {
  let component: CalendarDayTabComponent;
  let fixture: ComponentFixture<CalendarDayTabComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDayTabComponent],
      providers: [
        { provide: ClassName, useValue: 'CalendarDayTabComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => null }),
            queryParamMap: of({ get: () => null }),
            queryParams: of({}),
            params: of({}),
            snapshot: {
              paramMap: { get: () => null },
              queryParamMap: { get: () => null },
            },
          },
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
        { provide: PopoverController, useValue: { dismiss: vi.fn() } },
        CalendarStateService,
        SpaceComponentBaseParams,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(CalendarDayTabComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
      })
      .compileComponents();
    fixture = TestBed.createComponent(CalendarDayTabComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
    fixture.componentRef.setInput('$spaceDaysProvider', {});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
