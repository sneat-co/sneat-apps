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
		],
	});
} catch (e) {
	// ignore
}

if (typeof window !== 'undefined') {
	(window as any).CSS = {
		supports: () => false,
	};
	if (!window.document.adoptedStyleSheets) {
		(window.document as any).adoptedStyleSheets = [];
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
