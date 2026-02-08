import '@analogjs/vitest-angular/setup-zone';
import { TestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

export function setupAngularTestingEnvironment() {
	try {
		TestBed.initTestEnvironment(
			BrowserDynamicTestingModule,
			platformBrowserDynamicTesting(),
		);
	} catch (e) {
		// ignore
	}
}

export function setupGlobalMocks() {
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
				getEntriesByName: vi.fn(() => []),
				getEntriesByType: vi.fn(() => []),
				now: vi.fn(() => Date.now()),
			};
		}

		if (!(window as any).CSSStyleSheet) {
			(window as any).CSSStyleSheet = class {
				replaceSync() {}
				replace() {
					return Promise.resolve();
				}
			};
		}

		if ((window as any).CSSStyleSheet) {
			(window as any).CSSStyleSheet.prototype.replaceSync = function () {};
			(window as any).CSSStyleSheet.prototype.replace = function () {
				return Promise.resolve();
			};
		}

		// Mock Object.getOwnPropertyDescriptor(win.document.adoptedStyleSheets, "length")
		// to avoid TypeError in Stencil: https://github.com/ionic-team/stencil/issues/5323
		const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
		Object.getOwnPropertyDescriptor = function (obj, prop) {
			if (obj === undefined || obj === null) {
				return undefined;
			}
			try {
				if (
					obj === (window.document as any).adoptedStyleSheets &&
					prop === 'length'
				) {
					return {
						writable: true,
						enumerable: true,
						configurable: true,
						value: (obj as any).length,
					};
				}
			} catch (e) {
				// ignore
			}
			try {
				return originalGetOwnPropertyDescriptor(obj, prop);
			} catch (e) {
				return undefined;
			}
		};

		if (!(window as any).CSS) {
			(window as any).CSS = {
				supports: () => false,
			};
		}

		if (!(window as any).CSSParser) {
			(window as any).CSSParser = class {
				parseFromString() {
					return {
						cssRules: [],
					};
				}
			};
		}

		const mockCollection = vi.fn().mockImplementation((...args) => {
			const path = args
				.map((arg) => (typeof arg === 'string' ? arg : arg?.path || 'ref'))
				.join('/');
			return {
				type: 'collection',
				path,
				toJSON: () => ({ path }),
			};
		});

		const mockDoc = vi.fn().mockImplementation((...args) => {
			const path = args
				.map((arg) => (typeof arg === 'string' ? arg : arg?.path || 'ref'))
				.join('/');
			return {
				type: 'document',
				path,
				toJSON: () => ({ path }),
			};
		});

		(window as any).collection = mockCollection;
		(window as any).doc = mockDoc;
		(global as any).collection = mockCollection;
		(global as any).doc = mockDoc;

		const MockMutationObserver = class {
			observe() {}
			disconnect() {}
			takeRecords() {
				return [];
			}
		};
		(window as any).MutationObserver = MockMutationObserver;
		(global as any).MutationObserver = MockMutationObserver;

		const MockIntersectionObserver = class {
			observe() {}
			unobserve() {}
			disconnect() {}
			takeRecords() {
				return [];
			}
		};
		(window as any).IntersectionObserver = MockIntersectionObserver;
		(global as any).IntersectionObserver = MockIntersectionObserver;
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
}

export function setupBaseTestEnvironment() {
	setupAngularTestingEnvironment();
	setupGlobalMocks();
}
