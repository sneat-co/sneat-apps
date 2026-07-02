import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import {
  APP_INFO,
  ErrorLogger,
  LOGGER_FACTORY,
  NgModulePreloaderService,
  TopMenuService,
} from '@sneat/core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of, throwError } from 'rxjs';

import { DataStorageGithubPageComponent } from './data-storage-github-page.component';
import { OVDB_GITHUB_APP_SLUG } from './ovdb-github.config';
import { IOvdbGithubGrant, OvdbGithubService } from './ovdb-github.service';

describe('DataStorageGithubPageComponent', () => {
  let component: DataStorageGithubPageComponent;
  let fixture: ComponentFixture<DataStorageGithubPageComponent>;

  const grant: IOvdbGithubGrant = {
    installationID: 12345,
    repo: 'octocat/family-data',
    branch: 'main',
    status: 'active',
  };

  let getGithubGrant: ReturnType<typeof vi.fn>;
  let setGithubGrant: ReturnType<typeof vi.fn>;
  let revokeGithubGrant: ReturnType<typeof vi.fn>;
  let alertCreate: ReturnType<typeof vi.fn>;
  let logError: ReturnType<typeof vi.fn>;

  beforeEach(waitForAsync(async () => {
    getGithubGrant = vi.fn(() => of({ grant: null }));
    setGithubGrant = vi.fn(() => of({ grant }));
    revokeGithubGrant = vi.fn(() =>
      of({ grant: { ...grant, status: 'revoked' } }),
    );
    alertCreate = vi.fn(() => Promise.resolve({ present: vi.fn() }));
    logError = vi.fn();

    await TestBed.configureTestingModule({
      imports: [DataStorageGithubPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'DataStorageGithubPageComponent' },
        {
          provide: OvdbGithubService,
          useValue: { getGithubGrant, setGithubGrant, revokeGithubGrant },
        },
        { provide: OVDB_GITHUB_APP_SLUG, useValue: 'sneat-dev' },
        { provide: AlertController, useValue: { create: alertCreate } },
        {
          provide: SneatUserService,
          useValue: {
            // Non-null state: the component reads state.record?.spaces.
            userState: of({ record: { spaces: {} } }),
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
        { provide: APP_INFO, useValue: { appId: 'test', appTitle: 'Test' } },
        { provide: LOGGER_FACTORY, useValue: { getLogger: () => console } },
        {
          provide: ErrorLogger,
          useValue: { logError, logErrorHandler: () => vi.fn() },
        },
        {
          provide: SpaceNavService,
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
        {
          provide: NgModulePreloaderService,
          useValue: { preload: vi.fn(), markAsPreloaded: vi.fn() },
        },
        {
          provide: SpaceService,
          useValue: { watchSpace: vi.fn(() => of(null)) },
        },
        { provide: NavController, useValue: {} },
        { provide: TopMenuService, useValue: {} },
        {
          provide: SpaceComponentBaseParams,
          useValue: {
            errorLogger: { logError, logErrorHandler: () => vi.fn() },
            loggerFactory: { getLogger: () => console },
            userService: {
              userState: of({ record: { spaces: {} } }),
              userChanged: of(undefined),
              currentUserID: undefined,
            },
            spaceNavService: { navigateForwardToSpacePage: vi.fn() },
            preloader: { preload: vi.fn(), markAsPreloaded: vi.fn() },
          },
        },
      ],
    })
      .overrideComponent(DataStorageGithubPageComponent, {
        set: {
          imports: [],
          providers: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DataStorageGithubPageComponent);
    component = fixture.componentInstance;
  }));

  // Puts a space into context (mirrors the discover-movies spec pattern).
  const withSpace = () =>
    component['$spaceRef'].set({ id: 'space1', type: 'family' });

  it('should create in the loading state', () => {
    expect(component).toBeTruthy();
    expect(component['$loadState']()).toBe('loading');
  });

  it('builds the install URL from the configured app slug', () => {
    expect(component['$installUrl']()).toBe(
      'https://github.com/apps/sneat-dev/installations/new',
    );
  });

  describe('loadGrant()', () => {
    it('shows the empty (no-grant) state when the backend has no grant', () => {
      withSpace();
      component['loadGrant']();
      expect(getGithubGrant).toHaveBeenCalledWith('space1');
      expect(component['$loadState']()).toBe('loaded');
      expect(component['$grant']()).toBeNull();
    });

    it('loads and prefills the form when a grant exists', () => {
      getGithubGrant.mockReturnValueOnce(of({ grant }));
      withSpace();
      component['loadGrant']();
      expect(component['$loadState']()).toBe('loaded');
      expect(component['$grant']()).toEqual(grant);
      expect(component['$installationID']()).toBe('12345');
      expect(component['$repo']()).toBe('octocat/family-data');
      expect(component['$branch']()).toBe('main');
    });

    it('enters a distinct error state (not empty) with a retry on failure', () => {
      getGithubGrant.mockReturnValueOnce(throwError(() => new Error('boom')));
      withSpace();
      component['loadGrant']();
      expect(component['$loadState']()).toBe('error');
      expect(component['$loadError']()).toBeTruthy();
      expect(component['$grant']()).toBeNull();
      expect(logError).toHaveBeenCalled();
    });

    it('retryLoad re-fetches the grant', () => {
      getGithubGrant.mockReturnValueOnce(throwError(() => new Error('boom')));
      withSpace();
      component['loadGrant']();
      component['retryLoad']();
      expect(getGithubGrant).toHaveBeenCalledTimes(2);
    });
  });

  describe('saveGrant()', () => {
    beforeEach(() => {
      withSpace();
      component['$installationID'].set('12345');
      component['$repo'].set('octocat/family-data');
      component['$branch'].set('main');
    });

    it('does nothing when the user is not an admin', () => {
      component['$isAdmin'].set(false);
      component['saveGrant']();
      expect(setGithubGrant).not.toHaveBeenCalled();
    });

    it('does nothing for an invalid repo', () => {
      component['$isAdmin'].set(true);
      component['$repo'].set('not-a-repo');
      component['saveGrant']();
      expect(setGithubGrant).not.toHaveBeenCalled();
    });

    it('posts the grant with a parsed installationID for an admin', () => {
      component['$isAdmin'].set(true);
      component['saveGrant']();
      expect(setGithubGrant).toHaveBeenCalledWith({
        spaceID: 'space1',
        installationID: 12345,
        repo: 'octocat/family-data',
        branch: 'main',
      });
      expect(component['$grant']()).toEqual(grant);
      expect(component['$isSaving']()).toBe(false);
    });

    it('surfaces a save error without losing the form', () => {
      setGithubGrant.mockReturnValueOnce(throwError(() => new Error('boom')));
      component['$isAdmin'].set(true);
      component['saveGrant']();
      expect(component['$saveError']()).toBeTruthy();
      expect(component['$isSaving']()).toBe(false);
      expect(logError).toHaveBeenCalled();
    });
  });

  describe('revoke', () => {
    it('confirmRevoke opens a confirm alert when a grant exists', async () => {
      component['$isAdmin'].set(true);
      component['$grant'].set(grant);
      await component['confirmRevoke']();
      expect(alertCreate).toHaveBeenCalled();
    });

    it('confirmRevoke does nothing without admin rights', async () => {
      component['$isAdmin'].set(false);
      component['$grant'].set(grant);
      await component['confirmRevoke']();
      expect(alertCreate).not.toHaveBeenCalled();
    });

    it('revokeGrant posts the spaceID and updates the grant', () => {
      withSpace();
      component['$isAdmin'].set(true);
      component['$grant'].set(grant);
      component['revokeGrant']();
      expect(revokeGithubGrant).toHaveBeenCalledWith({ spaceID: 'space1' });
      expect(component['$grant']()?.status).toBe('revoked');
      expect(component['$isRevoking']()).toBe(false);
    });
  });

  describe('statusColor()', () => {
    it('maps grant statuses to Ionic colors', () => {
      expect(component['statusColor']('active')).toBe('success');
      expect(component['statusColor']('broken')).toBe('warning');
      expect(component['statusColor']('revoked')).toBe('medium');
    });
  });
});
