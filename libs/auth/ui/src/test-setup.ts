(global as any).Uint8Array = Buffer.from('').constructor.prototype.constructor;

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
