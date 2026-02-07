if (typeof window !== 'undefined') {
	if (!window.document) {
		(window as any).document = {
			adoptedStyleSheets: [],
		};
	}
	if (!window.document.adoptedStyleSheets) {
		(window.document as any).adoptedStyleSheets = [];
	}

	// Mock Object.getOwnPropertyDescriptor(win.document.adoptedStyleSheets, "length")
	const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	Object.getOwnPropertyDescriptor = function (obj, prop) {
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
		return originalGetOwnPropertyDescriptor.apply(this, arguments as any);
	};
}

import '@analogjs/vitest-angular/setup-zone';

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

import { TestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting(),
);
