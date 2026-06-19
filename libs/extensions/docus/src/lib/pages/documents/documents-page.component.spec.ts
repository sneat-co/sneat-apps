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
import { AssetService } from '@sneat/extension-assetus';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';

import { DocumentsPageComponent } from './documents-page.component';

describe('CommuneDocumentsPage', () => {
  let component: DocumentsPageComponent;
  let fixture: ComponentFixture<DocumentsPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'DocumentsPageComponent' },
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
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
        {
          provide: NgModulePreloaderService,
          useValue: { preload: vi.fn() },
        },
        { provide: SpaceService, useValue: {} },
        { provide: NavController, useValue: {} },
        {
          provide: AssetService,
          useValue: { watchAssets: vi.fn(() => of([])) },
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
              navigateForwardToSpacePage: vi.fn(() => Promise.resolve(true)),
            },
            preloader: { preload: vi.fn() },
          },
        },
      ],
    })
      .overrideComponent(DocumentsPageComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DocumentsPageComponent);
    component = fixture.componentInstance;
  }));

  const c = () => component as unknown as Record<string, any>;
  const setSpace = (id: string) =>
    c()['setSpaceRef'] ? c()['setSpaceRef']({ id }) : (c()['space'] = { id });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loadDocuments filters watched assets to the document category and wraps them', () => {
    const assets = [
      { id: 'a1', dbo: { category: 'document', name: 'Passport' } },
      { id: 'a2', dbo: { category: 'vehicle', name: 'Car' } },
      { id: 'a3', dbo: { category: 'document', name: 'Visa' } },
    ];
    const svc = TestBed.inject(AssetService) as unknown as {
      watchAssets: ReturnType<typeof vi.fn>;
    };
    svc.watchAssets = vi.fn(() => of(assets));
    setSpace('space1');

    component.loadDocuments();

    expect(svc.watchAssets).toHaveBeenCalledWith('space1');
    expect(component.documents.map((d) => d.id)).toEqual(['a1', 'a3']);
    expect(component.documents[0].space.id).toBe('space1');
    expect(component.documents[0].dbo?.name).toBe('Passport');
  });

  it('loadDocuments does nothing without a space id', () => {
    const svc = TestBed.inject(AssetService) as unknown as {
      watchAssets: ReturnType<typeof vi.fn>;
    };
    svc.watchAssets = vi.fn(() => of([]));
    setSpace('');
    component.loadDocuments();
    expect(svc.watchAssets).not.toHaveBeenCalled();
  });

  it('goDoc navigates to the document page', () => {
    setSpace('space1');
    const doc = { id: 'd1', space: { id: 'space1' } } as never;
    component.goDoc(doc);
    expect(
      c()['spaceParams'].spaceNavService.navigateForwardToSpacePage,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'space1' }),
      'document/d1',
      { state: { doc } },
    );
  });

  it('goNewDoc navigates to the new-document page with the doc type state', () => {
    setSpace('space1');
    component.goNewDoc('passport');
    expect(
      c()['spaceParams'].spaceNavService.navigateForwardToSpacePage,
    ).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'space1' }),
      'new-document',
      { state: { docType: 'passport' } },
    );
  });

  it('applyFilter lowercases and stores the filter', () => {
    component.applyFilter('Passport');
    expect(c()['$filter']()).toBe('passport');
  });
});
