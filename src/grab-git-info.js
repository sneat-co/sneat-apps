const { gitDescribeSync } = require('git-describe');
const { writeFileSync } = require('fs');
const path = require('path');

const info = gitDescribeSync();
const infoJson = `export const gitHash = '${info.hash}'; /*\n${JSON.stringify(info, null, 2)} */`;

writeFileSync(path.join(__dirname, './libs/components/src/lib/app-version/git-version.ts'), infoJson);
