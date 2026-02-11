import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import {
  APP_INFO,
  ErrorLogger,
  LOGGER_FACTORY,
  NgModulePreloaderService,
} from '@sneat/core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of, Subject } from 'rxjs';
import { NewTrackerPageComponent } from './new-tracker-page.component';

describe('NewTrackerPageComponent', () => {
  let component: NewTrackerPageComponent;
  let fixture: ComponentFixture<NewTrackerPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NewTrackerPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'NewTrackerPageComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: NavController,
          useValue: { navigateForward: vi.fn() },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: new Subject(),
            queryParamMap: new Subject(),
            snapshot: {
              paramMap: { get: () => null },
              queryParamMap: { get: () => null },
            },
          },
        },
        {
          provide: SpaceService,
          useValue: { onSpaceUpdated: new Subject() },
        },
        {
          provide: SpaceNavService,
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
        {
          provide: SneatUserService,
          useValue: { userState: of({ record: undefined }) },
        },
        {
          provide: SpaceComponentBaseParams,
          useValue: {
            errorLogger: {
              logError: vi.fn(),
              logErrorHandler: () => vi.fn(),
            },
            loggerFactory: { getLogger: () => console },
            userService: {
              userState: of({ record: undefined }),
            },
            spaceNavService: {
              navigateForwardToSpacePage: vi.fn(),
            },
            preloader: {
              preload: vi.fn(),
              markAsPreloaded: vi.fn(),
            },
          },
        },
        {
          provide: APP_INFO,
          useValue: { appId: 'test', appTitle: 'Test' },
        },
        {
          provide: LOGGER_FACTORY,
          useValue: { getLogger: () => console },
        },
        {
          provide: NgModulePreloaderService,
          useValue: { preload: vi.fn() },
        },
      ],
    })
      .overrideComponent(NewTrackerPageComponent, {
        set: {
          imports: [],
          providers: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NewTrackerPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
