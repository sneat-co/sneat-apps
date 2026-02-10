#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, sep } from 'path';
import { execSync } from 'child_process';

/**
 * Lists projects with the largest number of uncovered lines in descending order.
 * 
 * Usage:
 *   node scripts/list-uncovered-lines.mjs
 *   node scripts/list-uncovered-lines.mjs --run-tests  # Run tests with coverage first
 */

const COVERAGE_DIR = 'coverage';
const RUN_TESTS = process.argv.includes('--run-tests');

/**
 * Get all project names from the workspace
 */
function getProjects() {
	try {
		const output = execSync('npx nx show projects --json', {
			encoding: 'utf-8',
			stdio: ['pipe', 'pipe', 'pipe'],
		});
		return JSON.parse(output);
	} catch (error) {
		// Fallback: scan coverage directory for projects
		console.warn('⚠️  Unable to run nx command, scanning coverage directory...');
		return getProjectsFromCoverage();
	}
}

/**
 * Get projects that have a test target
 */
function getProjectsWithTests() {
	try {
		const output = execSync('npx nx show projects --withTarget test --json', {
			encoding: 'utf-8',
			stdio: ['pipe', 'pipe', 'pipe'],
		});
		return JSON.parse(output);
	} catch (error) {
		// Fallback: assume all projects have tests
		return getProjects();
	}
}

/**
 * Get projects by scanning coverage directory (fallback)
 */
function getProjectsFromCoverage() {
	const projects = [];
	
	if (!existsSync(COVERAGE_DIR)) {
		return [];
	}
	
	function scanDir(dir, prefix = '') {
		const entries = readdirSync(dir);
		for (const entry of entries) {
			const fullPath = join(dir, entry);
			const stat = statSync(fullPath);
			
			if (stat.isDirectory()) {
				const projectPath = prefix ? `${prefix}/${entry}` : entry;
				
				// Check if this directory has coverage files
				const hasCoverageFiles = readdirSync(fullPath).some(
					file => file.includes('coverage')
				);
				
				if (hasCoverageFiles) {
					projects.push(projectPath);
				} else {
					// Recurse into subdirectories
					scanDir(fullPath, projectPath);
				}
			}
		}
	}
	
	scanDir(COVERAGE_DIR);
	return projects;
}

/**
 * Run tests with coverage for all projects
 * Note: --skip-nx-cache is used to ensure coverage files are regenerated
 */
function runTestsWithCoverage() {
	console.log('Running tests with coverage for all projects...\n');
	try {
		execSync('pnpm nx run-many --target=test --all --coverage.enabled=true --skip-nx-cache', {
			stdio: 'inherit',
			encoding: 'utf-8',
		});
	} catch (error) {
		console.error('Some tests may have failed, but continuing with coverage analysis...\n');
	}
}

/**
 * Parse coverage-final.json to count uncovered lines
 */
function parseUncoveredLines(coverageFile) {
	try {
		const data = JSON.parse(readFileSync(coverageFile, 'utf-8'));
		let totalLines = 0;
		let coveredLines = 0;

		for (const filePath in data) {
			const fileData = data[filePath];
			
			// Use statement map to count lines
			if (fileData.statementMap) {
				const statements = fileData.statementMap;
				const executedStatements = fileData.s || {};
				
				for (const stmtId in statements) {
					const stmt = statements[stmtId];
					// Count lines (from start to end line)
					// Only count if we have valid start and end line numbers
					if (stmt.start && stmt.start.line) {
						const endLine = stmt.end && stmt.end.line ? stmt.end.line : stmt.start.line;
						const lineCount = endLine - stmt.start.line + 1;
						totalLines += lineCount;
						
						// If statement was executed at least once, count as covered
						if (executedStatements[stmtId] > 0) {
							coveredLines += lineCount;
						}
					}
				}
			}
		}

		return {
			totalLines,
			coveredLines,
			uncoveredLines: totalLines - coveredLines,
		};
	} catch (error) {
		return null;
	}
}

/**
 * Parse JSON summary format (alternative format)
 */
function parseJsonSummary(summaryFile) {
	try {
		const data = JSON.parse(readFileSync(summaryFile, 'utf-8'));
		
		// v8 coverage summary format
		if (data.total && data.total.lines) {
			const lines = data.total.lines;
			return {
				totalLines: lines.total || 0,
				coveredLines: lines.covered || 0,
				uncoveredLines: (lines.total || 0) - (lines.covered || 0),
			};
		}
		
		return null;
	} catch (error) {
		return null;
	}
}

/**
 * Find coverage files for a project
 */
function findCoverageData(projectPath) {
	const possiblePaths = [
		join(COVERAGE_DIR, projectPath, 'coverage-final.json'),
		join(COVERAGE_DIR, projectPath, 'coverage-summary.json'),
	];

	for (const path of possiblePaths) {
		if (existsSync(path)) {
			return path;
		}
	}
	
	return null;
}

/**
 * Analyze coverage for all projects
 */
function analyzeCoverage() {
	const projects = getProjects();
	const projectsWithTests = new Set(getProjectsWithTests());
	const results = [];

	console.log(`\nAnalyzing coverage for ${projects.length} projects...\n`);

	for (const project of projects) {
		// Skip projects without tests
		if (!projectsWithTests.has(project)) {
			continue;
		}

		// Try to find coverage data
		const coverageFile = findCoverageData(project);
		
		if (!coverageFile) {
			// Check if coverage directory exists at all
			const projectCoverageDir = join(COVERAGE_DIR, project);
			if (existsSync(projectCoverageDir)) {
				console.warn(`⚠️  No coverage data found for project: ${project}`);
			}
			continue;
		}

		let stats = null;
		
		// Try parsing as coverage-final.json
		if (coverageFile.includes('coverage-final.json')) {
			stats = parseUncoveredLines(coverageFile);
		}
		// Try parsing as coverage-summary.json
		else if (coverageFile.includes('coverage-summary.json')) {
			stats = parseJsonSummary(coverageFile);
		}

		if (stats && stats.totalLines > 0) {
			results.push({
				project,
				...stats,
				coveragePercent: ((stats.coveredLines / stats.totalLines) * 100).toFixed(2),
			});
		}
	}

	return results;
}

/**
 * Display results
 */
function displayResults(results) {
	if (results.length === 0) {
		console.log('\n❌ No coverage data found.');
		console.log('Run with --run-tests to generate coverage data first:');
		console.log('  node scripts/list-uncovered-lines.mjs --run-tests\n');
		return;
	}

	// Sort by uncovered lines (descending)
	results.sort((a, b) => b.uncoveredLines - a.uncoveredLines);

	console.log('\n📊 Projects with Most Uncovered Lines (Descending Order)\n');
	console.log('═'.repeat(80));
	console.log(
		'Rank'.padEnd(6) +
		'Project'.padEnd(35) +
		'Uncovered'.padStart(12) +
		'Total'.padStart(10) +
		'Coverage'.padStart(12)
	);
	console.log('─'.repeat(80));

	results.forEach((result, index) => {
		const rank = `${index + 1}.`;
		const coverage = `${result.coveragePercent}%`;
		
		console.log(
			rank.padEnd(6) +
			result.project.padEnd(35) +
			result.uncoveredLines.toString().padStart(12) +
			result.totalLines.toString().padStart(10) +
			coverage.padStart(12)
		);
	});

	console.log('═'.repeat(80));
	console.log(`\nTotal projects analyzed: ${results.length}\n`);

	// Summary statistics
	const totalUncovered = results.reduce((sum, r) => sum + r.uncoveredLines, 0);
	const totalLines = results.reduce((sum, r) => sum + r.totalLines, 0);
	
	if (totalLines > 0) {
		const overallCoverage = ((totalLines - totalUncovered) / totalLines * 100).toFixed(2);
		console.log(`Total uncovered lines: ${totalUncovered}`);
		console.log(`Total lines: ${totalLines}`);
		console.log(`Overall coverage: ${overallCoverage}%\n`);
	} else {
		console.log(`Total uncovered lines: 0`);
		console.log(`Total lines: 0\n`);
	}
}

/**
 * Main function
 */
function main() {
	console.log('🔍 Uncovered Lines Analysis\n');

	if (RUN_TESTS) {
		runTestsWithCoverage();
	}

	const results = analyzeCoverage();
	displayResults(results);
}

// Run the script
main();
