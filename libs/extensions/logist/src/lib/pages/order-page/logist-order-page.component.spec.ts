import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
	ModalController,
	NavController,
	PopoverController,
	ToastController,
} from '@ionic/angular/standalone';
import { SneatAuthStateService, SneatUserService } from '@sneat/auth-core';
import {
	AnalyticsService,
	APP_INFO,
	ErrorLogger,
	LOGGER_FACTORY,
	NgModulePreloaderService,
} from '@sneat/core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';
import { NewSegmentService } from '../../components/new-segment/new-segment.service';
import { NewShippingPointService } from '../../components/new-shipping-point/new-shipping-point.service';
import { LogistOrderService } from '../../services';

import { LogistOrderPageComponent } from './logist-order-page.component';

describe('FreightPageComponent', () => {
	let component: LogistOrderPageComponent;
	let fixture: ComponentFixture<LogistOrderPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [LogistOrderPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: ClassName, useValue: 'TestComponent' },
				{
					provide: SneatUserService,
					useValue: {
						userState: of({}),
						userChanged: of(undefined),
						currentUserID: undefined,
					},
				},
				{
					provide: ActivatedRoute,
					useValue: {
						paramMap: of({ get: () => null }),
						queryParamMap: of({ get: () => null }),
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
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{ provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
				{
					provide: SpaceNavService,
					useValue: { navigateForwardToSpacePage: vi.fn() },
				},
				{ provide: NgModulePreloaderService, useValue: { preload: vi.fn() } },
				{ provide: SpaceService, useValue: {} },
				{
					provide: SneatAuthStateService,
					useValue: {
						authState: of({ status: 'notAuthenticated' }),
						authStatus: of('notAuthenticated'),
					},
				},
				{ provide: NavController, useValue: {} },
				{
					provide: LogistOrderService,
					useValue: {
						watchOrderByID: vi.fn(() => of(undefined)),
						setOrderStatus: vi.fn(),
					},
				},
				{ provide: NewSegmentService, useValue: { goNewSegmentPage: vi.fn() } },
				{
					provide: NewShippingPointService,
					useValue: { openNewShippingPointDialog: vi.fn() },
				},
				{ provide: ModalController, useValue: { create: vi.fn() } },
				{ provide: PopoverController, useValue: { create: vi.fn() } },
				{ provide: ToastController, useValue: { create: vi.fn() } },
				SpaceComponentBaseParams,
			],
		})
			.overrideComponent(LogistOrderPageComponent, {
				set: { imports: [], providers: [] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(LogistOrderPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
