import fs from 'fs';
import { execSync } from 'child_process';

const files = execSync('find libs -name "*.spec.ts"')
	.toString()
	.trim()
	.split('\n');

files.forEach((file) => {
	let content = fs.readFileSync(file, 'utf8');
	let changed = false;

	// Remove extra comma before imports
	const newContent = content.replace(/\{(\s*),\s*imports:/g, '{$1imports:');
	if (newContent !== content) {
		content = newContent;
		changed = true;
	}

	// Also handle case where declarations was removed leaving a trailing comma before imports
	// already handled by the regex above partially, but let's be more general
	const generalFix = content.replace(/,\s*\}/g, '}').replace(/\[\s*,/g, '[');
	if (generalFix !== content) {
		content = generalFix;
		changed = true;
	}

	if (changed) {
		fs.writeFileSync(file, content);
		console.log(`Fixed ${file}`);
	}
});
