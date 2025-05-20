
# Common Build Errors and How to Avoid Them

## Type Errors

### Issue: Module has no exported member 'X'

Error example:
```
error TS2614: Module '"@/components/POS/Cart"' has no exported member 'CartItemType'.
```

**Cause**: This error occurs when trying to import a type or component that isn't properly exported from its source file.

**Solution**:
1. Make sure the type or component is properly exported from its source file:
   ```typescript
   // Right way:
   export interface CartItemType {
     // properties
   }
   ```

2. Verify the import statement uses the correct syntax based on how the item is exported:
   ```typescript
   // For named exports
   import { CartItemType } from './Cart';
   
   // For default exports
   import Cart from './Cart';
   ```

### Issue: Missing required properties

Error example:
```
error TS2741: Property 'merchant_id' is missing in type '{ id: string; name: string; }' but required in type 'Category'.
```

**Cause**: This happens when an object is missing properties that are required by its type definition.

**Solution**:
1. Check the type definition to see what properties are required
2. Add all required properties to the object
3. For mock data, ensure all required properties are included:
   ```typescript
   // Wrong:
   const mockCategories: Category[] = [
     { id: 'cat1', name: 'Category 1' }, // Missing merchant_id
   ];
   
   // Right:
   const mockCategories: Category[] = [
     { id: 'cat1', name: 'Category 1', merchant_id: 'merchant-1' },
   ];
   ```

## Import Errors

### Issue: Module has no exported member 'X'

Error example:
```
error TS2305: Module '"lucide-react"' has no exported member 'Cash'.
```

**Cause**: This happens when trying to import a component or function that doesn't exist in the specified module, often due to:
1. Typos in the import name
2. Using a component that was renamed or removed in a library update
3. Using a component from the wrong library

**Solution**:
1. Check the documentation for the correct component name
2. For UI libraries like lucide-react, verify the icon exists and use the correct name:
   ```typescript
   // Wrong:
   import { Cash } from 'lucide-react'; // Cash doesn't exist
   
   // Right:
   import { Banknote } from 'lucide-react'; // Use Banknote instead
   ```
3. Consider using the library's search functionality or documentation to find the right component

## Best Practices to Avoid These Errors

1. **Type Checking**: Run `tsc --noEmit` regularly during development to catch type errors early
2. **Documentation First**: Check component documentation before using it in your code
3. **Create Type Libraries**: Maintain a central location for type definitions
4. **Export Guide**: Follow a consistent pattern for exports:
   - Use named exports for types, interfaces, and utility functions
   - Use default exports for React components
5. **Mock Data**: Create helper functions to generate valid mock data with all required properties
6. **Icon Usage**: Create an icon directory or component that documents all available icons

By following these practices, you can avoid common build errors and create a more reliable codebase.
