#!/usr/bin/env node

/**
 * Helper script to generate extension module tests using templates
 * 
 * Usage:
 *   node scripts/generate-extension-test.mjs service AssetusService assetus shared services
 *   node scripts/generate-extension-test.mjs component AssetListComponent assetus components asset-list
 *   node scripts/generate-extension-test.mjs sanity assetus shared
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

function toKebabCase(str) {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.replace(/[\s_]+/g, '-')
		.toLowerCase();
}

function generateTest(type, ...args) {
	let templateFile, targetPath, fileName, replacements;

	if (type === 'sanity') {
		const [extension, subLib] = args;
		templateFile = 'extension-sanity.spec.ts.template';
		targetPath = join(rootDir, 'libs', 'extensions', extension, subLib, 'src', 'lib');
		fileName = 'sanity.spec.ts';
		replacements = {
			'{{extension-name}}': extension,
			'{{sub-lib}}': subLib,
		};
	} else if (type === 'service') {
		const [name, extension, subLib, path] = args;
		const kebabName = toKebabCase(name);
		templateFile = 'extension-service.spec.ts.template';
		targetPath = join(rootDir, 'libs', 'extensions', extension, subLib, 'src', 'lib', path || '');
		fileName = `${kebabName}.spec.ts`;
		replacements = {
			'{{ServiceName}}': name,
			'{{service-name}}': kebabName,
		};
	} else if (type === 'component') {
		const [name, extension, subLib, path] = args;
		const kebabName = toKebabCase(name);
		templateFile = 'extension-component.spec.ts.template';
		targetPath = join(rootDir, 'libs', 'extensions', extension, subLib, 'src', 'lib', path || '');
		fileName = `${kebabName}.component.spec.ts`;
		replacements = {
			'{{ComponentName}}': name,
			'{{component-name}}': kebabName,
		};
	} else {
		console.error('Invalid test type. Use: service, component, or sanity');
		process.exit(1);
	}

	// Read template
	const templatePath = join(rootDir, 'templates', templateFile);
	let content = readFileSync(templatePath, 'utf-8');

	// Replace placeholders
	for (const [key, value] of Object.entries(replacements)) {
		content = content.replace(new RegExp(key, 'g'), value);
	}

	// Ensure target directory exists
	mkdirSync(targetPath, { recursive: true });

	// Write file
	const outputPath = join(targetPath, fileName);
	writeFileSync(outputPath, content);

	console.log(`✅ Generated ${type} test: ${outputPath}`);
}

// Parse command line arguments
const [,, type, ...args] = process.argv;

if (!type) {
	console.log(`
Usage:
  Service test:    node scripts/generate-extension-test.mjs service ServiceName extension subLib [path]
  Component test:  node scripts/generate-extension-test.mjs component ComponentName extension subLib [path]
  Sanity test:     node scripts/generate-extension-test.mjs sanity extension subLib

Examples:
  node scripts/generate-extension-test.mjs service AssetusService assetus shared services
  node scripts/generate-extension-test.mjs component AssetListComponent assetus components asset-list
  node scripts/generate-extension-test.mjs sanity assetus shared
	`);
	process.exit(1);
}

generateTest(type, ...args);
