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

if (!global.fetch) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).fetch = () => Promise.resolve();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).Request = class {};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).Response = class {};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(global as any).Headers = class {};
}
