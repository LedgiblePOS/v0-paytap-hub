# Import Error Prevention Workflow

## Overview

This document outlines our workflow for preventing and resolving import errors in TypeScript. Following this workflow will help reduce build errors related to imports and exports.

## Pre-Development Checklist

Before starting development on a new feature:

1. **Review Related Modules**:
   - Understand how related components are exported
   - Check existing import patterns in the codebase
   - Look at interfaces and types used by related components

2. **Plan Module Structure**:
   - Decide on export strategy (named vs default)
   - Determine which types need to be exported
   - Plan the public API of your module

## Development Best Practices

### Consistent Export Patterns

**Default Exports** - Use for primary components and classes:
```typescript
// Component file (MyComponent.tsx)
const MyComponent = () => { /* ... */ };
export default MyComponent;

// Import in another file
import MyComponent from './MyComponent';
```

**Named Exports** - Use for utilities, types, and multiple exports:
```typescript
// Utility file (utils.ts)
export const formatDate = () => { /* ... */ };
export type DateFormat = 'short' | 'long';

// Import in another file
import { formatDate, type DateFormat } from './utils';
```

### Type Exports

Always export types and interfaces that will be used by other modules:

```typescript
// Correct
export interface PrinterDevice {
  device: USBDevice;
  productName: string;
  // other properties
}

// Using the type in another file
import { PrinterDevice } from './printer';
```

### Utility Class Patterns

For utility classes with static methods, choose one approach and be consistent:

**Option 1: Instance methods with a singleton export**
```typescript
// printer.ts
class PrinterService {
  connect() { /* ... */ }
  print() { /* ... */ }
}

export const printerService = new PrinterService();

// Usage
import { printerService } from './printer';
printerService.connect();
```

**Option 2: Static methods with class export**
```typescript
// printer.ts
export class PrinterService {
  static connect() { /* ... */ }
  static print() { /* ... */ }
}

// Usage
import { PrinterService } from './printer';
PrinterService.connect();
```

## Continuous Verification

During development:

1. **Run Type Checking Frequently**:
   ```bash
   npm run type-check
   ```

2. **Test Imports After Refactoring**:
   After moving or renaming files, verify all imports still work

3. **Check for Unused Exports**:
   Regularly clean up unused exports to keep the codebase clean

## Pre-Commit Verification

Before committing changes:

1. **Verify Module Structure**:
   - Check that all necessary types are exported
   - Ensure consistent export patterns
   - Verify import statements in all affected files

2. **Run Full Type Check**:
   ```bash
   npm run type-check
   ```

3. **Test in Development Environment**:
   - Verify the application builds without errors
   - Check that imports resolve correctly at runtime

## Troubleshooting Import Errors

When encountering import errors:

1. **Check Export Statement**:
   - Verify the item is actually exported from the module
   - Check for typos in export names

2. **Check Import Statement**:
   - Verify you're using the correct import syntax (named vs default)
   - Check for typos in import names

3. **Check File Path**:
   - Verify the file exists at the specified path
   - Check for case sensitivity issues

4. **Investigate Circular Dependencies**:
   - Look for potential circular imports
   - Restructure to break dependency cycles

## Documentation

Document the public API of shared utilities:

```typescript
/**
 * Connects to a receipt printer via WebUSB
 * 
 * @returns A PrinterDevice object if connection succeeds, null otherwise
 * @example
 * const printer = await connectToPrinter();
 * if (printer) {
 *   await printReceipt(printer, "Receipt content");
 * }
 */
export const connectToPrinter = async (): Promise<PrinterDevice | null> => {
  // Implementation
};
```

By following this workflow, we can significantly reduce import and export errors in our TypeScript codebase.
