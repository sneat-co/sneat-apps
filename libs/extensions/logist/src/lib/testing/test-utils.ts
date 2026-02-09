import { Provider } from '@angular/core';
import { SneatAuthStateService, SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ClassName } from '@sneat/ui';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import {
	AnalyticsService,
	APP_INFO,
	LOGGER_FACTORY,
	NgModulePreloaderService,
	ErrorLogger,
} from '@sneat/core';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { NavController } from '@ionic/angular/standalone';

export function provideLogistMocks(): Provider[] {
	return [
		{
			provide: ClassName,
			useValue: 'TestComponent',
		},
		{
			provide: ErrorLogger,
			useValue: {
				logError: vi.fn(),
				logErrorHandler: () => vi.fn(),
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
		{
			provide: APP_INFO,
			useValue: { appId: 'logist', appTitle: 'Logist' },
		},
		{
			provide: LOGGER_FACTORY,
			useValue: { getLogger: () => console },
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
		{
			provide: SpaceService,
			useValue: {},
		},
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
		{
			provide: NavController,
			useValue: {},
		},
		{
			provide: Firestore,
			useValue: { type: 'Firestore', toJSON: () => ({}) },
		},
		{
			provide: SneatApiService,
			useValue: {
				post: vi.fn(() => of({})),
				get: vi.fn(() => of({})),
			},
		},
		SpaceComponentBaseParams,
	];
}
