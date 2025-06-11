#!/usr/bin/env node

/**
 * Helper script to run Jest tests with coverage and display a summary
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const coverageSummaryPath = join(process.cwd(), 'coverage', 'coverage-summary.json');

try {
  // Run Jest with coverage
  console.log('Running tests with coverage...');
  execSync('NODE_OPTIONS=--experimental-vm-modules npx jest --coverage --config=jest.config.js', { stdio: 'inherit' });
  
  // Check if coverage summary exists
  if (existsSync(coverageSummaryPath)) {
    const coverageData = JSON.parse(readFileSync(coverageSummaryPath, 'utf8'));
    
    console.log('\n📊 COVERAGE SUMMARY:');
    console.log('-------------------');
    
    const total = coverageData.total;
    
    console.log(`Statements : ${total.statements.pct}%`);
    console.log(`Branches   : ${total.branches.pct}%`);
    console.log(`Functions  : ${total.functions.pct}%`);
    console.log(`Lines      : ${total.lines.pct}%`);
    
    // Check if coverage meets the threshold (60%)
    const threshold = 60;
    const allPass = 
      total.statements.pct >= threshold &&
      total.branches.pct >= threshold &&
      total.functions.pct >= threshold &&
      total.lines.pct >= threshold;
    
    if (allPass) {
      console.log('\n✅ All coverage thresholds passed!');
    } else {
      console.log('\n⚠️ Some coverage thresholds not met. Minimum required: 60%');
    }
  } else {
    console.log('Coverage report not found.');
  }
} catch (error) {
  console.error('Error running tests:', error.message);
  process.exit(1);
} 