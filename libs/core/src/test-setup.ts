import '@analogjs/vitest-angular/setup-zone';
import { TestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting(),
);

(global as any).fetch = vi.fn().mockImplementation(() =>
	Promise.resolve({
		json: () => Promise.resolve({}),
		ok: true,
	}),
);
(global as any).Response = vi.fn();
(global as any).Headers = vi.fn();
(global as any).Request = vi.fn();

if (!global.CSS) {
	(global as any).CSS = {
		supports: () => false,
	};
}

if (!global.matchMedia) {
	(global as any).matchMedia = vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(), // deprecated
		removeListener: vi.fn(), // deprecated
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	}));
}

if (global.document && !global.document.documentElement.style) {
	(global.document.documentElement as any).style = {};
}
