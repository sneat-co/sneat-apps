import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
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
import { of } from 'rxjs';

import { SpacePageComponent } from './space-page.component';

describe('SpacePage', () => {
	let component: SpacePageComponent;
	let fixture: ComponentFixture<SpacePageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [SpacePageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: ClassName, useValue: 'SpacePageComponent' },
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
				{
					provide: SpaceService,
					useValue: { watchSpace: vi.fn(() => of(null)) },
				},
				{ provide: NavController, useValue: {} },
				{
					provide: TopMenuService,
					useValue: {},
				},
				{
					provide: ContactusSpaceService,
					useValue: {
						watchSpaceModuleRecord: vi.fn(() => of(null)),
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
			.overrideComponent(SpacePageComponent, {
				set: {
					imports: [],
					providers: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(SpacePageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
