
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Setup Git hooks for TypeScript and ESLint checking
 */
export function setupGitHooks() {
  try {
    // Create the hooks directory if it doesn't exist
    const gitDir = path.join(process.cwd(), '.git');
    const hooksDir = path.join(gitDir, 'hooks');
    
    if (!fs.existsSync(gitDir)) {
      console.error('Error: .git directory not found. Initialize git repository first.');
      return false;
    }
    
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }
    
    // Create pre-commit hook content
    const preCommitContent = `#!/bin/sh
echo "🔍 Running pre-commit checks..."

# Run TypeScript type checking
echo "Checking TypeScript types..."
npx tsc --noEmit

# Store TypeScript check exit code
TSC_EXIT_CODE=$?

# Run ESLint
echo "Running ESLint..."
npx eslint --ext .ts,.tsx src/ --fix

# Store ESLint exit code
ESLINT_EXIT_CODE=$?

# Combine exit codes
if [ $TSC_EXIT_CODE -ne 0 ] || [ $ESLINT_EXIT_CODE -ne 0 ]; then
  echo "❌ Pre-commit checks failed. Fix errors before committing."
  exit 1
else
  echo "✅ Pre-commit checks passed!"
  exit 0
fi
`;
    
    // Write pre-commit hook
    const preCommitPath = path.join(hooksDir, 'pre-commit');
    fs.writeFileSync(preCommitPath, preCommitContent, { mode: 0o755 });
    
    console.log('✅ Git pre-commit hook set up successfully!');
    console.log('Checks will run TypeScript type checking and ESLint before each commit.');
    
    return true;
  } catch (error) {
    console.error('Error setting up Git hooks:', error);
    return false;
  }
}

/**
 * Run a command in the terminal
 */
export function runCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error running command: ${command}`, error.message);
    }
    return '';
  }
}

/**
 * Check if TypeScript files have any errors
 */
export function checkTypeScript(): { success: boolean, output: string } {
  try {
    const output = runCommand('npx tsc --noEmit');
    return { success: true, output };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, output: error.message };
    }
    return { success: false, output: 'Unknown error checking TypeScript' };
  }
}

/**
 * Check if ESLint has any errors
 */
export function checkESLint(): { success: boolean, output: string } {
  try {
    const output = runCommand('npx eslint --ext .ts,.tsx src/');
    return { success: true, output };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, output: error.message };
    }
    return { success: false, output: 'Unknown error running ESLint' };
  }
}
