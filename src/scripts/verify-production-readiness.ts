
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Verifying production readiness...');

try {
  // 1. Run linting
  console.log('Running linting checks...');
  execSync('npm run lint', { stdio: 'inherit' });
  
  // 2. Run tests
  console.log('Running test suite...');
  execSync('npm run test', { stdio: 'inherit' });
  
  // 3. Build the application
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 4. Check for environment variables
  console.log('Checking environment variables...');
  const envFile = path.resolve(process.cwd(), '.env.production');
  if (!fs.existsSync(envFile)) {
    throw new Error('.env.production file is missing');
  }
  
  // 5. Verify build output
  console.log('Verifying build output...');
  const distDir = path.resolve(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    throw new Error('Build directory is missing');
  }
  
  // 6. Check bundle size
  console.log('Checking bundle size...');
  execSync('npm run analyze-bundle', { stdio: 'inherit' });
  
  // 7. Run security audit
  console.log('Running security audit...');
  execSync('npm audit --production', { stdio: 'inherit' });
  
  console.log('Production verification completed successfully!');
} catch (error) {
  console.error('Verification failed:', error);
  process.exit(1);
}
