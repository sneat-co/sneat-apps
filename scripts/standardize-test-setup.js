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

const standardizedContent = `import { setupTestEnvironment } from '@sneat/core';

setupTestEnvironment();
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
