import '@analogjs/vitest-angular/setup-zone';




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
