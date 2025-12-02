#!/usr/bin/env tsx

/**
 * Merge Coverage Script
 *
 * This script merges coverage reports from all workspaces in the monorepo
 * into a single unified coverage report at the root level.
 *
 * Requirements:
 * - Each workspace must output coverage to <workspace>/coverage/
 * - Coverage must be in JSON format (coverage-final.json)
 *
 * Output:
 * - /coverage/coverage-final.json - Merged coverage data
 * - /coverage/lcov.info - LCOV format for CI tools
 * - /coverage/index.html - HTML report for viewing
 */

import fs from "fs";
import type { CoverageMap, CoverageMapData } from "istanbul-lib-coverage";
import { createCoverageMap } from "istanbul-lib-coverage";
import { createContext } from "istanbul-lib-report";
import reports from "istanbul-reports";
import path from "path";

// Configuration
const WORKSPACES = [
  "apps/frontend",
  "apps/backend-rest",
  "packages/ui",
] as const;

const ROOT_COVERAGE_DIR = path.join(process.cwd(), "coverage");
const COVERAGE_FILE = "coverage-final.json";

/**
 * Find all coverage files in the monorepo
 */
function findCoverageFiles(): string[] {
  const coverageFiles: string[] = [];

  for (const workspace of WORKSPACES) {
    const coverageFilePath = path.join(
      process.cwd(),
      workspace,
      "coverage",
      COVERAGE_FILE,
    );

    if (fs.existsSync(coverageFilePath)) {
      console.log(`✓ Found coverage: ${workspace}/coverage/${COVERAGE_FILE}`);
      coverageFiles.push(coverageFilePath);
    } else {
      console.warn(
        `⚠ No coverage found: ${workspace}/coverage/${COVERAGE_FILE}`,
      );
    }
  }

  if (coverageFiles.length === 0) {
    console.error("✗ No coverage files found. Make sure to run tests first.");
    process.exit(1);
  }

  return coverageFiles;
}

/**
 * Merge coverage data from multiple files
 */
function mergeCoverageData(coverageFiles: string[]): CoverageMap {
  const coverageMap = createCoverageMap({});

  for (const filePath of coverageFiles) {
    const coverageData = JSON.parse(
      fs.readFileSync(filePath, "utf8"),
    ) as CoverageMapData;
    coverageMap.merge(coverageData);
  }

  return coverageMap;
}

/**
 * Generate coverage reports
 */
function generateReports(coverageMap: CoverageMap): void {
  // Ensure output directory exists
  if (!fs.existsSync(ROOT_COVERAGE_DIR)) {
    fs.mkdirSync(ROOT_COVERAGE_DIR, { recursive: true });
  }

  const context = createContext({
    dir: ROOT_COVERAGE_DIR,
    coverageMap,
  });

  // Generate JSON report (merged coverage data)
  console.log("\n📊 Generating merged coverage reports...");

  const jsonReport = reports.create("json", {
    file: COVERAGE_FILE,
  });
  jsonReport.execute(context);
  console.log(`✓ JSON report: ${path.join(ROOT_COVERAGE_DIR, COVERAGE_FILE)}`);

  // Generate LCOV report (for CI tools like Codecov)
  const lcovReport = reports.create("lcov", {});
  lcovReport.execute(context);
  console.log(`✓ LCOV report: ${path.join(ROOT_COVERAGE_DIR, "lcov.info")}`);

  // Generate HTML report (for viewing in browser)
  const htmlReport = reports.create("html", {});
  htmlReport.execute(context);
  console.log(`✓ HTML report: ${path.join(ROOT_COVERAGE_DIR, "index.html")}`);

  // Generate text summary
  const textReport = reports.create("text-summary", {});
  textReport.execute(context);
}

/**
 * Main execution
 */
function main(): void {
  console.log("🔍 Merging coverage reports from all workspaces...\n");

  try {
    // Find all coverage files
    const coverageFiles = findCoverageFiles();
    console.log(`\n📦 Found ${coverageFiles.length} coverage file(s)\n`);

    // Merge coverage data
    const coverageMap = mergeCoverageData(coverageFiles);
    console.log("✓ Coverage data merged successfully\n");

    // Generate reports
    generateReports(coverageMap);

    console.log("\n✅ Coverage merge completed successfully!");
    console.log(
      `\n📂 View the HTML report: ${path.join(ROOT_COVERAGE_DIR, "index.html")}\n`,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";

    console.error("\n✗ Error merging coverage:", errorMessage);
    console.error(errorStack);
    process.exit(1);
  }
}

// Run the script
main();
