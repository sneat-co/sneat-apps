#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';

/**
 * Generate a comprehensive test coverage report with metrics and visualizations.
 * 
 * Usage:
 *   node scripts/generate-coverage-report.mjs
 *   node scripts/generate-coverage-report.mjs --run-tests  # Run tests with coverage first
 *   node scripts/generate-coverage-report.mjs --top 15     # Show top 15 projects (default: 10)
 */

const COVERAGE_DIR = 'coverage';
const OUTPUT_FILE = 'docs/test-coverage.md';
const RUN_TESTS = process.argv.includes('--run-tests');
const TOP_N = parseInt(process.argv.find(arg => arg.startsWith('--top'))?.split('=')[1]) || 
              parseInt(process.argv[process.argv.indexOf('--top') + 1]) || 
              10;

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
	} catch {
		console.warn('⚠️  Unable to run nx command, scanning coverage directory...');
		return getProjectsFromCoverage();
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
 */
function runTestsWithCoverage() {
	console.log('Running tests with coverage for all projects...\n');
	try {
		execSync('pnpm nx run-many --target=test --all --coverage.enabled=true --skip-nx-cache', {
			stdio: 'inherit',
			encoding: 'utf-8',
		});
	} catch {
		console.error('Some tests may have failed, but continuing with coverage analysis...\n');
	}
}

/**
 * Parse coverage-final.json to extract comprehensive metrics
 */
function parseDetailedCoverage(coverageFile) {
	try {
		const data = JSON.parse(readFileSync(coverageFile, 'utf-8'));
		let totalLines = 0;
		let coveredLines = 0;
		let totalFunctions = 0;
		let coveredFunctions = 0;
		let totalBranches = 0;
		let coveredBranches = 0;
		let totalStatements = 0;
		let coveredStatements = 0;

		for (const filePath in data) {
			const fileData = data[filePath];
			
			// Lines (using statement map)
			if (fileData.statementMap) {
				const statements = fileData.statementMap;
				const executedStatements = fileData.s || {};
				
				for (const stmtId in statements) {
					totalStatements++;
					if (executedStatements[stmtId] > 0) {
						coveredStatements++;
					}
					
					const stmt = statements[stmtId];
					if (stmt.start && stmt.start.line) {
						const endLine = stmt.end && stmt.end.line ? stmt.end.line : stmt.start.line;
						const lineCount = endLine - stmt.start.line + 1;
						totalLines += lineCount;
						
						if (executedStatements[stmtId] > 0) {
							coveredLines += lineCount;
						}
					}
				}
			}
			
			// Functions
			if (fileData.fnMap) {
				const functions = fileData.fnMap;
				const executedFunctions = fileData.f || {};
				
				for (const fnId in functions) {
					totalFunctions++;
					if (executedFunctions[fnId] > 0) {
						coveredFunctions++;
					}
				}
			}
			
			// Branches
			if (fileData.branchMap) {
				const branches = fileData.branchMap;
				const executedBranches = fileData.b || {};
				
				for (const branchId in branches) {
					const branch = branches[branchId];
					const branchLocations = branch.locations || [];
					
					for (let i = 0; i < branchLocations.length; i++) {
						totalBranches++;
						if (executedBranches[branchId] && executedBranches[branchId][i] > 0) {
							coveredBranches++;
						}
					}
				}
			}
		}

		return {
			lines: {
				total: totalLines,
				covered: coveredLines,
				uncovered: totalLines - coveredLines,
				pct: totalLines > 0 ? (coveredLines / totalLines * 100) : 100,
			},
			functions: {
				total: totalFunctions,
				covered: coveredFunctions,
				uncovered: totalFunctions - coveredFunctions,
				pct: totalFunctions > 0 ? (coveredFunctions / totalFunctions * 100) : 100,
			},
			branches: {
				total: totalBranches,
				covered: coveredBranches,
				uncovered: totalBranches - coveredBranches,
				pct: totalBranches > 0 ? (coveredBranches / totalBranches * 100) : 100,
			},
			statements: {
				total: totalStatements,
				covered: coveredStatements,
				uncovered: totalStatements - coveredStatements,
				pct: totalStatements > 0 ? (coveredStatements / totalStatements * 100) : 100,
			},
		};
	} catch (error) {
		return null;
	}
}

/**
 * Parse JSON summary format
 */
function parseJsonSummary(summaryFile) {
	try {
		const data = JSON.parse(readFileSync(summaryFile, 'utf-8'));
		
		if (data.total) {
			return {
				lines: {
					total: data.total.lines?.total || 0,
					covered: data.total.lines?.covered || 0,
					uncovered: (data.total.lines?.total || 0) - (data.total.lines?.covered || 0),
					pct: data.total.lines?.pct || 0,
				},
				functions: {
					total: data.total.functions?.total || 0,
					covered: data.total.functions?.covered || 0,
					uncovered: (data.total.functions?.total || 0) - (data.total.functions?.covered || 0),
					pct: data.total.functions?.pct || 0,
				},
				branches: {
					total: data.total.branches?.total || 0,
					covered: data.total.branches?.covered || 0,
					uncovered: (data.total.branches?.total || 0) - (data.total.branches?.covered || 0),
					pct: data.total.branches?.pct || 0,
				},
				statements: {
					total: data.total.statements?.total || 0,
					covered: data.total.statements?.covered || 0,
					uncovered: (data.total.statements?.total || 0) - (data.total.statements?.covered || 0),
					pct: data.total.statements?.pct || 0,
				},
			};
		}
		
		return null;
	} catch {
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
	const results = [];

	console.log(`\nAnalyzing coverage for ${projects.length} projects...\n`);

	for (const project of projects) {
		const coverageFile = findCoverageData(project);
		
		if (!coverageFile) {
			continue;
		}

		let metrics = null;
		
		if (coverageFile.includes('coverage-final.json')) {
			metrics = parseDetailedCoverage(coverageFile);
		} else if (coverageFile.includes('coverage-summary.json')) {
			metrics = parseJsonSummary(coverageFile);
		}

		if (metrics) {
			results.push({
				project,
				...metrics,
			});
		}
	}

	return results;
}

/**
 * Calculate overall metrics
 */
function calculateOverallMetrics(results) {
	const overall = {
		lines: { total: 0, covered: 0, uncovered: 0, pct: 0 },
		functions: { total: 0, covered: 0, uncovered: 0, pct: 0 },
		branches: { total: 0, covered: 0, uncovered: 0, pct: 0 },
		statements: { total: 0, covered: 0, uncovered: 0, pct: 0 },
	};

	for (const result of results) {
		overall.lines.total += result.lines.total;
		overall.lines.covered += result.lines.covered;
		overall.lines.uncovered += result.lines.uncovered;
		
		overall.functions.total += result.functions.total;
		overall.functions.covered += result.functions.covered;
		overall.functions.uncovered += result.functions.uncovered;
		
		overall.branches.total += result.branches.total;
		overall.branches.covered += result.branches.covered;
		overall.branches.uncovered += result.branches.uncovered;
		
		overall.statements.total += result.statements.total;
		overall.statements.covered += result.statements.covered;
		overall.statements.uncovered += result.statements.uncovered;
	}

	overall.lines.pct = overall.lines.total > 0 ? (overall.lines.covered / overall.lines.total * 100) : 100;
	overall.functions.pct = overall.functions.total > 0 ? (overall.functions.covered / overall.functions.total * 100) : 100;
	overall.branches.pct = overall.branches.total > 0 ? (overall.branches.covered / overall.branches.total * 100) : 100;
	overall.statements.pct = overall.statements.total > 0 ? (overall.statements.covered / overall.statements.total * 100) : 100;

	return overall;
}

/**
 * Generate mermaid bar chart
 */
function generateMermaidChart(data, title, valueKey) {
	const lines = [
		'```mermaid',
		'%%{init: {\'theme\':\'base\', \'themeVariables\': { \'primaryColor\':\'#ff6b6b\'}}}%%',
		'graph TD',
		`    subgraph "${title}"`,
	];

	data.forEach((item, index) => {
		const value = item[valueKey].uncovered;
		const pct = item[valueKey].pct.toFixed(1);
		const bars = '▓'.repeat(Math.ceil(value / 100));
		lines.push(`        P${index}["${index + 1}. ${item.project}<br/>${value} uncovered<br/>${pct}% coverage"] --> |${bars}| V${index}[ ]`);
	});

	lines.push('    end');
	lines.push('    style V0 fill:none,stroke:none');
	for (let i = 1; i < data.length; i++) {
		lines.push(`    style V${i} fill:none,stroke:none`);
	}
	lines.push('```');

	return lines.join('\n');
}

/**
 * Generate markdown table
 */
function generateTable(data, valueKey) {
	const lines = [
		'| Rank | Project | Uncovered | Total | Coverage % |',
		'|------|---------|-----------|-------|------------|',
	];

	data.forEach((item, index) => {
		const metric = item[valueKey];
		lines.push(
			`| ${index + 1} | ${item.project} | ${metric.uncovered} | ${metric.total} | ${metric.pct.toFixed(2)}% |`
		);
	});

	return lines.join('\n');
}

/**
 * Generate the markdown report
 */
function generateMarkdownReport(results, overall) {
	const now = new Date().toISOString().split('T')[0];
	
	// Sort projects
	const byLines = [...results].sort((a, b) => b.lines.uncovered - a.lines.uncovered).slice(0, TOP_N);
	const byFunctions = [...results].sort((a, b) => b.functions.uncovered - a.functions.uncovered).slice(0, TOP_N);
	const byBranches = [...results].sort((a, b) => b.branches.uncovered - a.branches.uncovered).slice(0, TOP_N);

	const lines = [
		'# Test Coverage Report',
		'',
		'> **Note:** This document is auto-generated. To regenerate it, use the AI skill `generate-test-coverage-report` or run:',
		'> ```bash',
		'> node scripts/generate-coverage-report.mjs',
		'> ```',
		'',
		`**Last Updated:** ${now}`,
		'',
		'## Overall Test Coverage Metrics',
		'',
		'### Summary',
		'',
		'| Metric | Total | Covered | Uncovered | Coverage % |',
		'|--------|-------|---------|-----------|------------|',
		`| **Lines** | ${overall.lines.total} | ${overall.lines.covered} | ${overall.lines.uncovered} | ${overall.lines.pct.toFixed(2)}% |`,
		`| **Functions** | ${overall.functions.total} | ${overall.functions.covered} | ${overall.functions.uncovered} | ${overall.functions.pct.toFixed(2)}% |`,
		`| **Branches** | ${overall.branches.total} | ${overall.branches.covered} | ${overall.branches.uncovered} | ${overall.branches.pct.toFixed(2)}% |`,
		`| **Statements** | ${overall.statements.total} | ${overall.statements.covered} | ${overall.statements.uncovered} | ${overall.statements.pct.toFixed(2)}% |`,
		'',
		'### Coverage Visualization',
		'',
		'```mermaid',
		'%%{init: {\'theme\':\'base\', \'themeVariables\': { \'primaryColor\':\'#1f77b4\', \'primaryTextColor\':\'#fff\'}}}%%',
		'pie title Overall Coverage Distribution',
		`    "Lines Covered (${overall.lines.pct.toFixed(1)}%)" : ${overall.lines.covered}`,
		`    "Lines Uncovered" : ${overall.lines.uncovered}`,
		'```',
		'',
		`## Top ${TOP_N} Projects by Uncovered Lines`,
		'',
		generateTable(byLines, 'lines'),
		'',
		'### Visualization',
		'',
		generateMermaidChart(byLines, `Top ${TOP_N} by Uncovered Lines`, 'lines'),
		'',
		`## Top ${TOP_N} Projects by Uncovered Functions`,
		'',
		generateTable(byFunctions, 'functions'),
		'',
		'### Visualization',
		'',
		generateMermaidChart(byFunctions, `Top ${TOP_N} by Uncovered Functions`, 'functions'),
		'',
		`## Top ${TOP_N} Projects by Uncovered Branches`,
		'',
		generateTable(byBranches, 'branches'),
		'',
		'### Visualization',
		'',
		generateMermaidChart(byBranches, `Top ${TOP_N} by Uncovered Branches`, 'branches'),
		'',
		'## How to Improve Coverage',
		'',
		'1. **Run coverage analysis:**',
		'   ```bash',
		'   pnpm nx test <project-name> --coverage.enabled=true',
		'   ```',
		'',
		'2. **View detailed HTML reports:**',
		'   ```bash',
		'   open coverage/<project-path>/index.html',
		'   ```',
		'',
		'3. **Focus on high-impact areas:** Projects with the most uncovered lines/functions/branches',
		'',
		'4. **Write tests for critical paths:** Authentication, data persistence, business logic',
		'',
		'5. **Use test templates:** See [Testing Guide](TESTING.md) and [templates/](../templates/)',
		'',
		'## Related Documentation',
		'',
		'- [Coverage Configuration](COVERAGE-CONFIGURATION.md)',
		'- [Testing Guide](TESTING.md)',
		'- [Testing Examples](TESTING-EXAMPLES.md)',
		'- [Test Coverage Plan](../TEST_COVERAGE_PLAN.md)',
		'',
	];

	return lines.join('\n');
}

/**
 * Main function
 */
function main() {
	console.log('🔍 Test Coverage Report Generator\n');

	if (RUN_TESTS) {
		runTestsWithCoverage();
	}

	const results = analyzeCoverage();

	if (results.length === 0) {
		console.log('\n❌ No coverage data found.');
		console.log('Run with --run-tests to generate coverage data first:');
		console.log('  node scripts/generate-coverage-report.mjs --run-tests\n');
		return;
	}

	console.log(`✅ Found coverage data for ${results.length} projects\n`);

	const overall = calculateOverallMetrics(results);
	const report = generateMarkdownReport(results, overall);

	writeFileSync(OUTPUT_FILE, report, 'utf-8');

	console.log(`📄 Report generated: ${OUTPUT_FILE}`);
	console.log('\n📊 Overall Coverage:');
	console.log(`   Lines:      ${overall.lines.pct.toFixed(2)}%`);
	console.log(`   Functions:  ${overall.functions.pct.toFixed(2)}%`);
	console.log(`   Branches:   ${overall.branches.pct.toFixed(2)}%`);
	console.log(`   Statements: ${overall.statements.pct.toFixed(2)}%\n`);
}

main();
