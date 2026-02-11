import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService, SneatUserService } from '@sneat/auth-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
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
import { NEVER, of } from 'rxjs';
import { CalendarDayService } from '../../services/calendar-day.service';
import { CalendariumSpaceService } from '../../services/calendarium-space.service';
import { HappeningService } from '../../services/happening.service';
import { CalendarFilterService } from '../calendar-filter.service';
import { CalendarStateService } from './calendar-state.service';
import { CalendarComponent } from './calendar.component';

vi.mock('@angular/fire/firestore');

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
      providers: [
        { provide: ClassName, useValue: 'CalendarComponent' },
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
        { provide: HappeningService, useValue: {} },
        {
          provide: CalendarDayService,
          useValue: { watchSpaceDay: vi.fn(() => NEVER) },
        },
        {
          provide: CalendariumSpaceService,
          useValue: { watchSpaceModuleRecord: vi.fn(() => NEVER) },
        },
        {
          provide: ContactusSpaceService,
          useValue: {
            watchSpaceModuleRecord: vi.fn(() => of({ id: 'test', dbo: null })),
          },
        },
        CalendarFilterService,
        CalendarStateService,
        SpaceComponentBaseParams,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(CalendarComponent, {
        set: {
          imports: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          template: '',
          providers: [],
        },
      })
      .compileComponents();
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
