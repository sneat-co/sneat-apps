import { Provider } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ClassName, SelectorService } from '@sneat/ui';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import {
	AnalyticsService,
	APP_INFO,
	LOGGER_FACTORY,
	NgModulePreloaderService,
} from '@sneat/core';
import { ErrorLogger } from '@sneat/core';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import {
	NavController,
	ModalController,
	AlertController,
	PopoverController,
} from '@ionic/angular/standalone';
import { AssetService } from '../services';
import { CountrySelectorService } from '@sneat/components';

export const mockAssetService = {
	updateAsset: vi.fn(() => of({})),
	watchAssetByID: vi.fn(() => of({})),
	createAsset: vi.fn(() => of({})),
};

export const mockSneatApiService = {
	post: vi.fn(() => of({})),
	get: vi.fn(() => of({})),
	put: vi.fn(() => of({})),
	delete: vi.fn(() => of({})),
};

export function provideAssetusMocks(): Provider[] {
	return [
		{ provide: ClassName, useValue: 'TestComponent' },
		{ provide: AssetService, useValue: mockAssetService },
		{ provide: SneatApiService, useValue: mockSneatApiService },
		{
			provide: SneatUserService,
			useValue: {
				userState: of(null),
				userChanged: of(undefined),
				currentUserID: undefined,
			},
		},
		{
			provide: SpaceService,
			useValue: {
				watchSpace: vi.fn(() => of({})),
			},
		},
		{
			provide: SpaceNavService,
			useValue: { navigateForwardToSpacePage: vi.fn() },
		},
		{
			provide: NavController,
			useValue: { navigateForward: vi.fn(), navigateRoot: vi.fn() },
		},
		{ provide: NgModulePreloaderService, useValue: { preload: vi.fn() } },
		{
			provide: ActivatedRoute,
			useValue: {
				paramMap: of({ get: () => null }),
				queryParamMap: of({ get: () => null }),
				snapshot: {
					paramMap: { get: () => null },
					queryParamMap: { get: () => null },
				},
			},
		},
		{
			provide: APP_INFO,
			useValue: { appId: 'assetus', appTitle: 'AssetUs' },
		},
		{ provide: LOGGER_FACTORY, useValue: { getLogger: () => console } },
		{
			provide: ErrorLogger,
			useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
		},
		{ provide: AnalyticsService, useValue: { logEvent: vi.fn() } },
		{
			provide: Firestore,
			useValue: {
				type: 'Firestore',
				toJSON: () => ({}),
			},
		},
		{
			provide: SelectorService,
			useValue: {
				showSelector: vi.fn(),
			},
		},
		{
			provide: ModalController,
			useValue: {
				create: vi.fn(async () => ({
					present: vi.fn(),
					onDidDismiss: vi.fn(async () => ({})),
				})),
				dismiss: vi.fn(),
			},
		},
		{
			provide: AlertController,
			useValue: {
				create: vi.fn(async () => ({ present: vi.fn() })),
			},
		},
		{
			provide: PopoverController,
			useValue: {
				create: vi.fn(async () => ({
					present: vi.fn(),
					onDidDismiss: vi.fn(async () => ({})),
				})),
			},
		},
		{
			provide: CountrySelectorService,
			useValue: { selectSingleInModal: vi.fn() },
		},
		SpaceComponentBaseParams,
	];
}
