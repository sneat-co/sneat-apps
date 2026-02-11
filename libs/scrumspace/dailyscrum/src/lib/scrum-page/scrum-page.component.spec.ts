import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { ErrorLogger, AnalyticsService } from '@sneat/core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SpaceService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { TimerFactory } from '@sneat/ext-meeting';
import { ScrumService } from '../services/scrum.service';

import { ScrumPageComponent } from './scrum-page.component';

describe('ScrumPage', () => {
  let component: ScrumPageComponent;
  let fixture: ComponentFixture<ScrumPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrumPageComponent, IonicModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: { get: () => null } },
            queryParamMap: of({ get: () => null }),
            paramMap: of({ get: () => null }),
          },
        },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        { provide: AnalyticsService, useValue: { logEvent: () => undefined } },
        { provide: ClassName, useValue: 'ScrumPageComponent' },
        {
          provide: NavController,
          useValue: { navigateRoot: vi.fn(), navigateForward: vi.fn() },
        },
        { provide: SpaceService, useValue: { watchSpace: vi.fn() } },
        { provide: ScrumService, useValue: {} },
        { provide: Location, useValue: { path: () => '' } },
        { provide: TimerFactory, useValue: { getTimer: vi.fn() } },
        {
          provide: SpaceComponentBaseParams,
          useValue: {
            errorLogger: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
            loggerFactory: { getLogger: () => console },
            userService: {
              userState: of(null),
              userChanged: of(undefined),
              currentUserID: undefined,
            },
            spaceNavService: { navigateForwardToSpacePage: vi.fn() },
            preloader: { preload: vi.fn() },
          },
        },
      ],
    })
      .overrideComponent(ScrumPageComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ScrumPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
