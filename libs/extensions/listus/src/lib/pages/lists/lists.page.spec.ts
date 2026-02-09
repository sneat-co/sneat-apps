import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController, PopoverController } from '@ionic/angular/standalone';
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
import { of } from 'rxjs';
import { ListusComponentBaseParams } from '../../listus-component-base-params';
import { IListusAppStateService } from '../../services';

import { ListsPageComponent } from './lists-page.component';

describe('ListsPage', () => {
	let component: ListsPageComponent;
	let fixture: ComponentFixture<ListsPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [ListsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: ClassName, useValue: 'ListsPageComponent' },
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
					provide: SpaceNavService,
					useValue: { navigateForwardToSpacePage: vi.fn() },
				},
				{
					provide: NgModulePreloaderService,
					useValue: { preload: vi.fn(), markAsPreloaded: vi.fn() },
				},
				{ provide: SpaceService, useValue: {} },
				{ provide: NavController, useValue: {} },
				{
					provide: PopoverController,
					useValue: { create: vi.fn() },
				},
				{
					provide: IListusAppStateService,
					useValue: {
						changed: of({}),
						setGroupCollapsed: vi.fn(),
						setShowWatched: vi.fn(),
					},
				},
				{
					provide: ListusComponentBaseParams,
					useValue: {
						spaceParams: {
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
							preloader: {
								preload: vi.fn(),
								markAsPreloaded: vi.fn(),
							},
						},
						listService: {
							deleteList: vi.fn(),
						},
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
						preloader: {
							preload: vi.fn(),
							markAsPreloaded: vi.fn(),
						},
					},
				},
			],
		})
			.overrideComponent(ListsPageComponent, {
				set: {
					imports: [],
					providers: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(ListsPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
