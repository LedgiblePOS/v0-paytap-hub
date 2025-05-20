
import * as fs from 'fs';
import * as path from 'path';

function checkFilePaths(dir: string): void {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      checkFilePaths(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importLines = content.match(/^import.*from\s+['"].*['"]/gm) || [];

      importLines.forEach(line => {
        const match = line.match(/from\s+['"](.*)['"]/);
        if (match) {
          const importPath = match[1];
          if (!importPath.startsWith('.')) return; // Skip package imports

          const resolvedPath = path.resolve(dir, importPath);
          const exists = fs.existsSync(resolvedPath) || 
                        fs.existsSync(resolvedPath + '.ts') || 
                        fs.existsSync(resolvedPath + '.tsx') ||
                        fs.existsSync(resolvedPath + '/index.ts') ||
                        fs.existsSync(resolvedPath + '/index.tsx');

          if (!exists) {
            console.error(`Error: Import path not found: ${importPath} in ${fullPath}`);
            process.exit(1);
          }
        }
      });
    }
  });
}

// Start checking from src directory
checkFilePaths(path.resolve(__dirname, '..'));
