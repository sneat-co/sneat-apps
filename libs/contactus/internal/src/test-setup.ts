import '@analogjs/vitest-angular/setup-zone';
import { TestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { ErrorLogger } from '@sneat/logging';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

import {
	ContactService,
	ContactusSpaceService,
} from '@sneat/contactus-services';
import {
	LOGGER_FACTORY,
	APP_INFO,
	NgModulePreloaderService,
} from '@sneat/core';
import { SpaceService, SpaceNavService } from '@sneat/space-services';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SneatUserService } from '@sneat/auth-core';
import { ActivatedRoute } from '@angular/router';

// Initialize the Angular testing environment
try {
	TestBed.initTestEnvironment(
		BrowserDynamicTestingModule,
		platformBrowserDynamicTesting(),
	);
} catch (e) {
	// ignore
}

// Global test providers
try {
	TestBed.configureTestingModule({
		providers: [
			{
				provide: ErrorLogger,
				useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
			},
			{ provide: Firestore, useValue: {} },
			{
				provide: Auth,
				useValue: {
					onIdTokenChanged: () => ({
						subscribe: () => ({ unsubscribe: () => {} }),
					}),
				},
			},
			{
				provide: AngularFirestore,
				useValue: {
					collection: () => ({ valueChanges: () => of([]) }),
					doc: () => ({ valueChanges: () => of(null) }),
				},
			},
			{ provide: AngularFireAuth, useValue: { authState: of(null) } },
			{
				provide: ContactService,
				useValue: {
					watchContactById: () => of({}),
				},
			},
			{
				provide: ContactusSpaceService,
				useValue: {
					watchContactBriefs: () => of([]),
				},
			},
			{
				provide: SpaceService,
				useValue: {
					watchSpaceById: () => of({}),
				},
			},
			{ provide: SpaceNavService, useValue: {} },
			{
				provide: SneatUserService,
				useValue: {
					user$: of(null),
				},
			},
			{ provide: SpaceComponentBaseParams, useClass: SpaceComponentBaseParams },
			{ provide: LOGGER_FACTORY, useValue: { getLogger: () => console } },
			{ provide: APP_INFO, useValue: {} },
			{ provide: NgModulePreloaderService, useValue: {} },
			{
				provide: ActivatedRoute,
				useValue: {
					paramMap: of({ get: () => null }),
					queryParamMap: of({ get: () => null }),
				},
			},
		],
	});
} catch (e) {
	// ignore
}

if (typeof window !== 'undefined') {
	if (!(window as any).location) {
		(window as any).location = {
			href: 'http://localhost',
			pathname: '/',
			search: '',
			hash: '',
			host: 'localhost',
			hostname: 'localhost',
			origin: 'http://localhost',
			port: '',
			protocol: 'http:',
			assign: () => {},
			replace: () => {},
			reload: () => {},
		};
	}

	if (!window.matchMedia) {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: vi.fn(), // deprecated
				removeListener: vi.fn(), // deprecated
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});
	}

	if (!window.performance) {
		(window as any).performance = {
			mark: vi.fn(),
			measure: vi.fn(),
			clearMarks: vi.fn(),
			clearMeasures: vi.fn(),
			now: vi.fn(() => Date.now()),
			getEntriesByName: vi.fn(() => []),
			getEntriesByType: vi.fn(() => []),
		};
	}
}

// Global mocks for fetch if not available
if (!global.fetch) {
	(global as any).fetch = vi.fn().mockImplementation(() =>
		Promise.resolve({
			json: () => Promise.resolve({}),
			ok: true,
		}),
	);
	(global as any).Request = class {};
	(global as any).Response = class {};
	(global as any).Headers = class {};
}
