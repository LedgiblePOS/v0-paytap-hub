
const fs = require('fs');
const path = require('path');

// Ensure .git directory exists
const gitDir = path.join(__dirname, '.git');
if (!fs.existsSync(gitDir)) {
  console.error('Error: .git directory not found. Initialize git repository first.');
  process.exit(1);
}

// Ensure hooks directory exists
const hooksDir = path.join(gitDir, 'hooks');
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
