import { Provider } from '@angular/core';
import {
	ContactService,
	ContactusSpaceService,
} from '@sneat/contactus-services';
import { SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ClassName } from '@sneat/ui';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import {
	AnalyticsService,
	APP_INFO,
	LOGGER_FACTORY,
	NgModulePreloaderService,
} from '@sneat/core';
import { ErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';

export const mockContactService = {
	watchContactById: vi.fn(() => of({})),
	removeSpaceMember: vi.fn(() => of({})),
	watchSpaceItemByIdWithSpaceRef: vi.fn(() => of({})),
};

export const mockContactusSpaceService = {
	watchContactBriefs: vi.fn(() => of([])),
};

export const mockSneatUserService = {
	user$: of({}),
};

export const mockSneatApiService = {
	post: vi.fn(() => of({})),
	get: vi.fn(() => of({})),
	put: vi.fn(() => of({})),
	delete: vi.fn(() => of({})),
};

export function provideContactusMocks(): Provider[] {
	return [
		{ provide: ClassName, useValue: 'TestComponent' },
		{ provide: ContactService, useValue: mockContactService },
		{ provide: ContactusSpaceService, useValue: mockContactusSpaceService },
		{ provide: SneatUserService, useValue: mockSneatUserService },
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
			useValue: { appId: 'contactus', appTitle: 'ContactUs' },
		},
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
		{
			provide: Firestore,
			useValue: {
				type: 'Firestore',
				toJSON: () => ({}),
			},
		},
		SpaceComponentBaseParams,
	];
}
