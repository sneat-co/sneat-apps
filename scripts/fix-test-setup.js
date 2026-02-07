const fs = require('fs');
const path = require('path');

const files = [
	'libs/datagrid/src/test-setup.ts',
	'libs/dto/src/test-setup.ts',
	'libs/ui/src/test-setup.ts',
	'libs/app/src/test-setup.ts',
	'libs/auth/models/src/test-setup.ts',
	'libs/datetime/src/test-setup.ts',
	'libs/timer/src/test-setup.ts',
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
	'libs/components/src/test-setup.ts',
	'libs/meeting/src/test-setup.ts',
	'libs/contactus/core/src/test-setup.ts',
	'libs/contactus/internal/src/test-setup.ts',
	'libs/contactus/services/src/test-setup.ts',
	'libs/communes/ui/src/test-setup.ts',
	'libs/space/models/src/test-setup.ts',
	'libs/space/components/src/test-setup.ts',
	'libs/space/services/src/test-setup.ts',
	'libs/datatug/main/src/test-setup.ts',
	'libs/datatug/main/src/lib/services/repo/src/test-setup.ts',
	'libs/datatug/main/src/lib/editor/test-setup.ts',
	'libs/data/src/test-setup.ts',
	'libs/logging/src/test-setup.ts',
	'libs/grid/src/test-setup.ts',
];

const boilerplate = `
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
`;

files.forEach((file) => {
	if (fs.existsSync(file)) {
		let content = fs.readFileSync(file, 'utf8');
		if (!content.includes('adoptedStyleSheets')) {
			// Remove previous boilerplate if it was added but incomplete
			if (content.includes('TestBed.initTestEnvironment')) {
				content = content.split(
					"import { TestBed } from '@angular/core/testing';",
				)[0];
			}
			content += boilerplate;
			fs.writeFileSync(file, content);
			console.log(`Updated ${file}`);
		}
	} else {
		console.warn(`File not found: ${file}`);
	}
});
