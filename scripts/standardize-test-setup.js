const fs = require('fs');
const path = require('path');

const testSetupFiles = [
	'libs/datagrid/src/test-setup.ts',
	'libs/dto/src/test-setup.ts',
	'libs/ui/src/test-setup.ts',
	'libs/core/src/test-setup.ts',
	'libs/app/src/test-setup.ts',
	'libs/auth/ui/src/test-setup.ts',
	'libs/auth/core/src/test-setup.ts',
	'libs/auth/models/src/test-setup.ts',
	'libs/datetime/src/test-setup.ts',
	'libs/timer/src/test-setup.ts',
	'libs/wizard/src/test-setup.ts',
	'libs/user/src/test-setup.ts',
	'libs/scrumspace/scrummodels/src/test-setup.ts',
	'libs/scrumspace/retrospectives/src/test-setup.ts',
	'libs/scrumspace/dailyscrum/src/test-setup.ts',
	'libs/extensions/docus/src/test-setup.ts',
	'libs/extensions/logist/src/test-setup.ts',
	'libs/extensions/debtus/internal/src/test-setup.ts',
	'libs/extensions/debtus/shared/src/test-setup.ts',
	'libs/extensions/listus/src/test-setup.ts',
	'libs/extensions/trackus/src/test-setup.ts',
	'libs/extensions/schedulus/core/src/test-setup.ts',
	'libs/extensions/schedulus/shared/src/test-setup.ts',
	'libs/extensions/schedulus/main/src/test-setup.ts',
	'libs/extensions/budgetus/src/test-setup.ts',
	'libs/extensions/assetus/core/src/test-setup.ts',
	'libs/extensions/assetus/components/src/test-setup.ts',
	'libs/extensions/assetus/pages/src/test-setup.ts',
	'libs/components/src/test-setup.ts',
	'libs/meeting/src/test-setup.ts',
	'libs/contactus/core/src/test-setup.ts',
	'libs/contactus/internal/src/test-setup.ts',
	'libs/contactus/shared/src/test-setup.ts',
	'libs/contactus/services/src/test-setup.ts',
	'libs/api/src/test-setup.ts',
	'libs/communes/ui/src/test-setup.ts',
	'libs/space/models/src/test-setup.ts',
	'libs/space/components/src/test-setup.ts',
	'libs/space/pages/src/test-setup.ts',
	'libs/space/services/src/test-setup.ts',
	'libs/datatug/main/src/test-setup.ts',
	'libs/datatug/main/src/lib/services/repo/src/test-setup.ts',
	'libs/datatug/main/src/lib/editor/test-setup.ts',
	'libs/data/src/test-setup.ts',
	'libs/logging/src/test-setup.ts',
	'libs/grid/src/test-setup.ts',
];

const standardizedContent = `import '@analogjs/vitest-angular/setup-zone';
import { TestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Global mocks for jsdom environment
if (typeof window !== 'undefined') {
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
      value: vi.fn().mockImplementation(query => ({
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
      clearMeasures: vi.fn(),
      now: vi.fn(() => Date.now()),
      getEntriesByName: vi.fn(() => []),
      getEntriesByType: vi.fn(() => []),
    };
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
`;

testSetupFiles.forEach((file) => {
	const fullPath = path.resolve(process.cwd(), file);
	if (fs.existsSync(fullPath)) {
		console.log('Updating ' + file + '...');
		fs.writeFileSync(fullPath, standardizedContent);
	} else {
		console.warn('File not found: ' + file);
	}
});
