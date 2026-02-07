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
