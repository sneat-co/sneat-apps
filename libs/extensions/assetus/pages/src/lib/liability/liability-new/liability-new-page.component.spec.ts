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
import { of } from 'rxjs';

import { LiabilityNewPageComponent } from './liability-new-page.component';

describe('LiabilityNewPage', () => {
	let component: LiabilityNewPageComponent;
	let fixture: ComponentFixture<LiabilityNewPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [LiabilityNewPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: ClassName, useValue: 'LiabilityNewPageComponent' },
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
			.overrideComponent(LiabilityNewPageComponent, {
				set: {
					imports: [],
					template: '',
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					providers: [],
				},
			})
			.compileComponents();

		fixture = TestBed.createComponent(LiabilityNewPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
