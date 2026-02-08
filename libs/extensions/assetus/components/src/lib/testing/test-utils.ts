import { Provider } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ClassName, SelectorService } from '@sneat/ui';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { AnalyticsService, APP_INFO, LOGGER_FACTORY } from '@sneat/core';
import { ErrorLogger } from '@sneat/core';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { AssetService } from '../services';
import { CountrySelectorService } from '@sneat/components';

export const mockAssetService = {
	updateAsset: vi.fn(() => of({})),
	watchAssetByID: vi.fn(() => of({})),
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
		CountrySelectorService,
		SpaceComponentBaseParams,
	];
}
