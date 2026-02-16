/* eslint-disable @typescript-eslint/no-explicit-any */
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
  } catch {
    // ignore
  }
}

export function setupGlobalMocks() {
  if (typeof window !== 'undefined') {
    // Wrap URL constructor to handle invalid bases gracefully (fixes Ionic/Stencil asset loading in tests)
    const OriginalURL = (window as any).URL;
    (window as any).URL = class extends OriginalURL {
      constructor(url: string, base?: string | URL) {
        try {
          super(url, base);
        } catch {
          // If the base is invalid, try with a default base
          try {
            super(url, 'http://localhost/');
          } catch {
            // If URL is completely invalid, fall back to localhost with the path
            // This handles cases where Ionic/Stencil tries to load assets in tests
            const fallbackUrl = url.startsWith('/') ? `http://localhost${url}` : 'http://localhost/';
            super(fallbackUrl);
          }
        }
      }
    };

    // Set document.baseURI to prevent Ionic/Stencil "Invalid URL" errors
    if ((window as any).document) {
      Object.defineProperty((window as any).document, 'baseURI', {
        get: () => 'http://localhost/',
        configurable: true,
      });

      // Ensure document.dir is defined to prevent Ionic's isRTL() from throwing
      // "Cannot read properties of undefined (reading 'toLowerCase')"
      if ((window as any).document.dir === undefined) {
        (window as any).document.dir = '';
      }
    }

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
        assign: () => {
          /* ignore */
        },
        replace: () => {
          /* ignore */
        },
        reload: () => {
          /* ignore */
        },
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
        replaceSync() {
          /* ignore */
        }
        replace() {
          return Promise.resolve();
        }
      };
    }

    if ((window as any).CSSStyleSheet) {
      (window as any).CSSStyleSheet.prototype.replaceSync = function () {
        /* ignore */
      };
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
      } catch {
        // ignore
      }
      try {
        return originalGetOwnPropertyDescriptor(obj, prop);
      } catch {
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
      observe() {
        /* ignore */
      }
      disconnect() {
        /* ignore */
      }
      takeRecords() {
        return [];
      }
    };
    (window as any).MutationObserver = MockMutationObserver;
    (global as any).MutationObserver = MockMutationObserver;

    const MockIntersectionObserver = class {
      observe() {
        /* ignore */
      }
      unobserve() {
        /* ignore */
      }
      disconnect() {
        /* ignore */
      }
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
    (global as any).Request = vi.fn();
    (global as any).Response = vi.fn();
    (global as any).Headers = vi.fn();
  }
}

export function setupBaseTestEnvironment() {
  setupAngularTestingEnvironment();
  setupGlobalMocks();
}
