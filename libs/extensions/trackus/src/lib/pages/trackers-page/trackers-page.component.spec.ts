import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular/standalone';
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
import { Firestore } from '@angular/fire/firestore';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';

import { TrackersPageComponent } from './trackers-page.component';

describe('TrackusPageComponent', () => {
	let component: TrackersPageComponent;
	let fixture: ComponentFixture<TrackersPageComponent>;

	beforeEach(waitForAsync(async () => {
		await TestBed.configureTestingModule({
			imports: [TrackersPageComponent],
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			providers: [
				{ provide: ClassName, useValue: 'TrackersPageComponent' },
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
					provide: Firestore,
					useValue: { type: 'Firestore', toJSON: () => ({}) },
				},
				SpaceComponentBaseParams,
			],
		})
			.overrideComponent(TrackersPageComponent, {
				set: { imports: [], providers: [] },
			})
			.compileComponents();

		fixture = TestBed.createComponent(TrackersPageComponent);
		component = fixture.componentInstance;
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
