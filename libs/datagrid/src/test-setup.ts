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

if (typeof window !== 'undefined') {
	if (!window.performance) {
		(window as any).performance = {
			now: () => Date.now(),
			mark: () => {},
			measure: () => {},
			getEntriesByName: () => [],
		};
	}
	if (!window.matchMedia) {
		Object.defineProperty(window, 'matchMedia', {
			writable: true,
			value: (query: string) => ({
				matches: false,
				media: query,
				onchange: null,
				addListener: () => {},
				removeListener: () => {},
				addEventListener: () => {},
				removeEventListener: () => {},
				dispatchEvent: () => false,
			}),
		});
	}

	// Stencil/Ionic requirements
	if (!(window as any).CSS) {
		(window as any).CSS = {
			supports: () => false,
		};
	}

	if (!window.customElements) {
		(window as any).customElements = {
			define: () => {},
			get: () => {},
			whenDefined: () => Promise.resolve(),
			upgrade: () => {},
		};
	}

	// More robust window mock
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
}


if (typeof window !== 'undefined') {
  if (!(window as any).document) {
      (window as any).document = {
          adoptedStyleSheets: [],
      };
  }
  if (!window.document.adoptedStyleSheets) {
    (window.document as any).adoptedStyleSheets = [];
  }

  // Mock Object.getOwnPropertyDescriptor(win.document.adoptedStyleSheets, "length")
  // to avoid TypeError in Stencil: https://github.com/ionic-team/stencil/issues/5323
  const originalGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  Object.getOwnPropertyDescriptor = function(obj, prop) {
      if (obj && obj === (window.document as any).adoptedStyleSheets && prop === 'length') {
          return {
              writable: true,
              enumerable: true,
              configurable: true,
              value: (obj as any).length
          };
      }
      return originalGetOwnPropertyDescriptor.apply(this, arguments as any);
  };
}

import { TestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

try {
  TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
  );
} catch (e) {
  // ignore if already initialized
}
