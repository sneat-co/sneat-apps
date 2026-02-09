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
} from '@sneat/core';
import {
	AssetService,
	AssetusSpaceService,
} from '@sneat/ext-assetus-components';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';

import { AssetsPageComponent } from './assets-page.component';

describe('AssetsPage', () => {
	let component: AssetsPageComponent;
	let fixture: ComponentFixture<AssetsPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [AssetsPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: ClassName, useValue: 'AssetsPageComponent' },
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
					useValue: { preload: vi.fn() },
				},
				{ provide: SpaceService, useValue: {} },
				{ provide: NavController, useValue: {} },
				{
					provide: AlertController,
					useValue: { create: vi.fn() },
				},
				{
					provide: AssetService,
					useValue: {
						watchSpaceAssets: vi.fn(() => of([])),
						createAsset: vi.fn(() => of(null)),
						watchAssetByID: vi.fn(() => of(null)),
					},
				},
				{
					provide: AssetusSpaceService,
					useValue: {
						watchAssetBriefs: vi.fn(() => of([])),
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
			.overrideComponent(AssetsPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(AssetsPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
