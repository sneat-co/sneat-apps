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
import { CalendariusSpaceService } from '@sneat/extensions-calendarius-shared';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of, Subject } from 'rxjs';
import { BudgetPageComponent } from './budget-page.component';

describe('BudgetPageComponent', () => {
  let component: BudgetPageComponent;
  let fixture: ComponentFixture<BudgetPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'BudgetPageComponent' },
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
              navigateForwardToSpacePage: vi.fn(() => Promise.resolve(true)),
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
        {
          provide: CalendariusSpaceService,
          useValue: { watchSpaceModuleRecord: vi.fn() },
        },
      ],
    })
      .overrideComponent(BudgetPageComponent, {
        set: {
          imports: [],
          providers: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BudgetPageComponent);
    component = fixture.componentInstance;
  }));

  // Helper to reach protected/private members without widening the component API.
  const c = () => component as unknown as Record<string, any>;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('liabilities mode', () => {
    it('defaults to expenses', () => {
      expect(c()['$liabilitiesMode']()).toBe('expenses');
    });

    it('liabilitiesModeChanged updates the mode from the event', () => {
      const ev = { detail: { value: 'incomes' } } as unknown as Event;
      c()['liabilitiesModeChanged'](ev);
      expect(c()['$liabilitiesMode']()).toBe('incomes');
    });

    it('$showIncomes / $showExpenses follow the mode', () => {
      c()['$liabilitiesMode'].set('incomes');
      expect(c()['$showIncomes']()).toBe(true);
      expect(c()['$showExpenses']()).toBe(false);

      c()['$liabilitiesMode'].set('expenses');
      expect(c()['$showIncomes']()).toBe(false);
      expect(c()['$showExpenses']()).toBe(true);

      c()['$liabilitiesMode'].set('balance');
      expect(c()['$showIncomes']()).toBe(true);
      expect(c()['$showExpenses']()).toBe(true);
    });
  });

  describe('totals helpers', () => {
    it('totals getter returns undefined', () => {
      expect(component.totals).toBeUndefined();
    });

    it('calcTotal is a no-op without asset groups', () => {
      c()['assetGroups'] = undefined;
      expect(() => component.calcTotal()).not.toThrow();
    });

    it('calcTotal returns without throwing when asset groups exist', () => {
      c()['assetGroups'] = [];
      expect(() => component.calcTotal()).not.toThrow();
    });

    it('memberBalance returns 0', () => {
      expect(component.memberBalance()).toBe(0);
    });
  });

  // `space` is a read-only getter on SpaceBaseComponent backed by the $spaceRef
  // signal; set the ref to control what `this.space` returns.
  const setSpace = (id: string) => c()['setSpaceRef']({ id });

  describe('navigation', () => {
    it('goAssetGroup navigates to the asset group page', () => {
      setSpace('space1');
      const assetGroup = {
        id: 'g1',
        context: { id: 'g1' },
      } as unknown as import('@sneat/extension-assetus').AssetGroup;
      component.goAssetGroup(assetGroup);
      const nav = c()['spaceParams'].spaceNavService.navigateForwardToSpacePage;
      expect(nav).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'space1' }),
        'assets-group/g1',
        { state: { assetGroup: assetGroup.context } },
      );
    });

    it('goNew navigates to the new-liability page', () => {
      setSpace('space1');
      component.goNew();
      const nav = c()['spaceParams'].spaceNavService.navigateForwardToSpacePage;
      expect(nav).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'space1' }),
        'new-liability',
      );
    });
  });

  describe('onSpaceIdChanged', () => {
    it('returns early when the space has no id', () => {
      setSpace('');
      expect(() => c()['onSpaceIdChanged']()).not.toThrow();
    });

    it('subscribes to the calendarius record and stores the dbo', () => {
      const dbo = { type: 'calendarius' };
      const svc = c()['calendariusSpaceService'];
      svc.watchSpaceModuleRecord = vi.fn(() => of({ dbo }));
      setSpace('space1');
      c()['onSpaceIdChanged']();
      expect(svc.watchSpaceModuleRecord).toHaveBeenCalledWith('space1');
      expect(c()['$calendariusSpaceDbo']()).toBe(dbo);
    });
  });
});
