
// Simple script wrapper to run the TypeScript file
const { execSync } = require('child_process');
const path = require('path');

try {
  console.log('Checking for file path casing issues...');
  execSync('npx ts-node src/utils/checkFilePaths.ts', { stdio: 'inherit' });
  console.log('✓ File path check passed');
} catch (error) {
  console.error('✗ File path check failed');
  process.exit(1);
}
