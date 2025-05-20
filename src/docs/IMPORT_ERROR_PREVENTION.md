
# Import Error Prevention Guide

## Common Import Errors and How to Fix Them

### Error: Module has no exported member 'X'

```
error TS2614: Module '"@/bridges/FasstapBridge"' has no exported member 'FasstapBridge'.
```

This error occurs when trying to import a named export that doesn't exist in the module. There are two common patterns for exports in TypeScript/JavaScript:

1. **Default exports**:
   ```typescript
   // In file: export a single "main" thing
   export default class FasstapBridge { /* ... */ }
   
   // In importing file: import without braces
   import FasstapBridge from "@/bridges/FasstapBridge";
   ```

2. **Named exports**:
   ```typescript
   // In file: export multiple things
   export class FasstapBridge { /* ... */ }
   export interface FasstapConfig { /* ... */ }
   
   // In importing file: import with braces
   import { FasstapBridge, FasstapConfig } from "@/bridges/FasstapBridge";
   ```

### Error: Property 'X' does not exist on type 'Y'

```
error TS2576: Property 'getInstance' does not exist on type 'FasstapService'.
```

This error occurs when trying to access a property or method that doesn't exist on the imported type. Common causes:

1. **Accessing static methods directly on an import**:
   ```typescript
   // WRONG: Accessing static method on the imported type
   import FasstapService from '../fasstapService';
   FasstapService.getInstance() // Error if getInstance is a static method
   
   // RIGHT: Access static method correctly
   import { FasstapService } from '../fasstapService';
   FasstapService.getInstance()
   ```

2. **Mixing default and named imports**:
   ```typescript
   // If the file exports both default and named exports
   // Wrong usage:
   import FasstapService from '../fasstapService'; 
   FasstapService.getInstance() // Error if getInstance is a static method
   
   // Right usage (depends on how the service is exported):
   import FasstapService, { someNamedExport } from '../fasstapService';
   // OR
   import { FasstapService } from '../fasstapService';
   ```

## Best Practices to Prevent Import Errors

1. **Check the export type in the source file** before importing
2. **Use consistent export patterns** across your codebase
3. **Prefer named exports** for utility functions, interfaces, and types
4. **Use default exports** for main components or classes
5. **Be consistent with singleton patterns** - decide if you're exporting the class or an instance
6. **Document your export patterns** in your codebase
7. **Add automated tests** that verify proper imports

## Workflow Recommendations

1. When creating a new service or component, clearly decide on and document the export pattern
2. For singleton services, choose one consistent approach:
   - Export the class: `export class ServiceName`
   - Export an instance: `export default new ServiceName()`
3. For utility files with multiple exports, use named exports
4. For components, prefer default exports

By following these consistent patterns, you can prevent common import errors in your TypeScript applications.
