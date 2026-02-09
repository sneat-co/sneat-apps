import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular/standalone';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService, SneatUserService } from '@sneat/auth-core';
import {
	ErrorLogger,
	APP_INFO,
	LOGGER_FACTORY,
	AnalyticsService,
	NgModulePreloaderService,
	RoutingState,
} from '@sneat/core';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';
import { HappeningService } from '../../services/happening.service';
import { HappeningFormComponent } from './happening-form.component';

vi.mock('@angular/fire/firestore');

describe('HappeningFormComponent', () => {
	let component: HappeningFormComponent;
	let fixture: ComponentFixture<HappeningFormComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [HappeningFormComponent],
			providers: [
				{ provide: ClassName, useValue: 'HappeningFormComponent' },
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
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
				{ provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
				{
					provide: SpaceNavService,
					useValue: {
						navigateForwardToSpacePage: vi.fn(),
						navigateBackToSpacePage: vi.fn(),
					},
				},
				{ provide: NgModulePreloaderService, useValue: { preload: vi.fn() } },
				{ provide: SpaceService, useValue: {} },
				{
					provide: SneatUserService,
					useValue: {
						user$: of({}),
						userState: of({}),
						userChanged: of(undefined),
						currentUserID: undefined,
					},
				},
				{
					provide: SneatAuthStateService,
					useValue: {
						authState: of({ status: 'notAuthenticated' }),
						authStatus: of('notAuthenticated'),
					},
				},
				{ provide: NavController, useValue: { pop: vi.fn() } },
				{ provide: Firestore, useValue: {} },
				{
					provide: SneatApiService,
					useValue: { post: vi.fn(() => of({})), get: vi.fn(() => of({})) },
				},
				{ provide: ModalController, useValue: { create: vi.fn() } },
				{ provide: RoutingState, useValue: { hasHistory: () => false } },
				SpaceComponentBaseParams,
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
		})
			.overrideComponent(HappeningFormComponent, {
				set: {
					imports: [],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
					template: '',
					providers: [{ provide: HappeningService, useValue: {} }],
				},
			})
			.compileComponents();
		fixture = TestBed.createComponent(HappeningFormComponent);
		component = fixture.componentInstance;
		fixture.componentRef.setInput('$space', { id: 'test-space' });
		fixture.componentRef.setInput('$happening', {
			id: '',
			space: { id: 'test-space' },
		});
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
