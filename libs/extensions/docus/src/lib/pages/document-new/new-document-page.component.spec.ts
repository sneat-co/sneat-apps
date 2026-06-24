import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import {
  AnalyticsService,
  APP_INFO,
  ErrorLogger,
  LOGGER_FACTORY,
  NgModulePreloaderService,
} from '@sneat/core';
import { ContactService } from '@sneat/extension-contactus-internal';
import { ASSET_SERVICE } from '@sneat/extension-assetus-contract';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';

import { NewDocumentPageComponent } from './new-document-page.component';

describe('DocumentNewPage', () => {
  let component: NewDocumentPageComponent;
  let fixture: ComponentFixture<NewDocumentPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDocumentPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'NewDocumentPageComponent' },
        {
          provide: SneatUserService,
          useValue: {
            userState: of(null),
            userChanged: of(undefined),
            currentUserID: undefined,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map()),
            queryParamMap: of(new Map()),
            queryParams: of({}),
            params: of({}),
            snapshot: {
              paramMap: { get: () => null },
              queryParamMap: { get: () => null },
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
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: () => vi.fn(),
          },
        },
        {
          provide: AnalyticsService,
          useValue: { logEvent: vi.fn() },
        },
        {
          provide: SpaceNavService,
          useValue: {
            navigateForwardToSpacePage: vi.fn(() => Promise.resolve(true)),
          },
        },
        {
          provide: NgModulePreloaderService,
          useValue: { preload: vi.fn() },
        },
        { provide: SpaceService, useValue: {} },
        { provide: NavController, useValue: {} },
        {
          provide: ContactService,
          useValue: { watchContactById: vi.fn(() => of(null)) },
        },
        {
          provide: ASSET_SERVICE,
          useValue: {
            createAsset: vi.fn(() => of(null)),
          },
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
              userState: of(null),
              userChanged: of(undefined),
              currentUserID: undefined,
            },
            spaceNavService: {
              navigateForwardToSpacePage: vi.fn(),
            },
            preloader: { preload: vi.fn() },
          },
        },
      ],
    })
      .overrideComponent(NewDocumentPageComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NewDocumentPageComponent);
    component = fixture.componentInstance;
  }));

  const c = () => component as unknown as Record<string, any>;
  const setSpace = (id: string) =>
    c()['setSpaceRef'] ? c()['setSpaceRef']({ id }) : (c()['space'] = { id });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onDocTypeChange loads the standard fields for the chosen type', () => {
    component.onDocTypeChange('passport');
    expect(c()['docFields'].number?.required).toBe(true);
  });

  it('isFormValid is false until a type is chosen', () => {
    c()['docType'] = undefined;
    expect(c()['isFormValid']).toBe(false);
  });

  it('isFormValid enforces a required number for passports', () => {
    c()['docType'] = 'passport';
    c()['docNumber'] = '';
    expect(c()['isFormValid']).toBe(false);
    c()['docNumber'] = 'X123';
    expect(c()['isFormValid']).toBe(true);
  });

  it('submit builds a flat document create request and navigates on success', () => {
    const created = { id: 'newDoc1', asset: { id: 'newDoc1' } };
    const svc = TestBed.inject(ASSET_SERVICE) as unknown as {
      createAsset: ReturnType<typeof vi.fn>;
    };
    svc.createAsset = vi.fn(() => of(created));
    setSpace('space1');
    c()['docTitle'] = 'My Passport';
    c()['docType'] = 'passport';
    c()['docNumber'] = 'X123';
    c()['contact'] = { id: 'contact1' };

    c()['submit']();

    expect(svc.createAsset).toHaveBeenCalledWith(
      expect.objectContaining({
        spaceID: 'space1',
        name: 'My Passport',
        category: 'document',
        condition: 'good',
        status: 'draft',
        type: 'passport',
        extraType: 'document',
        memberIDs: ['contact1'],
        extra: expect.objectContaining({ number: 'X123' }),
      }),
    );
    expect(
      c()['spaceNavService'].navigateForwardToSpacePage,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'space1' }),
      'document/newDoc1',
    );
  });
});
