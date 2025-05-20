
# Import/Export Error Resolution Guide

This document provides solutions to common import/export errors in TypeScript projects.

## Common Error Types and Solutions

### 1. Component vs Array Confusion

**Error:**
```
error TS2604: JSX element type 'X' does not have any construct or call signatures.
error TS2786: 'X' cannot be used as a JSX component.
```

**Solution:**
This occurs when you try to use an array or object as a React component. 

```typescript
// INCORRECT - Using an array as a component
<SuperAdminNavItems />

// CORRECT - Map the array to create components
<SidebarNav 
  items={SuperAdminNavItems.map(item => ({
    name: item.title,
    path: item.href,
    icon: item.icon
  }))}
/>
```

### 2. Spread Operator on Nullable Types

**Error:**
```
error TS2698: Spread types may only be created from object types.
```

**Solution:**
Provide a fallback object when spreading values that might be null or undefined:

```typescript
// INCORRECT
const updatedData = { ...obj.maybeUndefined };

// CORRECT
const updatedData = { ...((obj.maybeUndefined || {}) as Record<string, any>) };

// ALTERNATIVE
const updatedData = { ...(obj.maybeUndefined ?? {}) };
```

### 3. Default vs Named Import/Export Mismatch

**Error:**
```
error TS2613: Module 'X' has no default export.
error TS2614: Module 'X' has no exported member 'Y'.
```

**Solution:**
Match your import style to the export style of the module:

```typescript
// For default exports:
export default MyComponent; 
import MyComponent from './path';

// For named exports:
export const MyComponent = () => {};
import { MyComponent } from './path';
```

### 4. Type Instantiation Too Deep

**Error:**
```
error TS2589: Type instantiation is excessively deep and possibly infinite.
```

**Solution:**
This often occurs with complex nested generic types or recursive types:

1. Simplify complex type structures
2. Add explicit type annotations
3. Break circular type dependencies
4. Use interfaces instead of complex type aliases

```typescript
// Instead of complex nested generics
type ComplexType<T> = Record<string, T extends object ? ComplexType<T[keyof T]> : T>;

// Use simpler interfaces with explicit types
interface SimpleType {
  [key: string]: string | number | SimpleType;
}
```

## Best Practices to Prevent Import/Export Errors

1. **Be consistent with export styles**:
   - Use default exports for main components
   - Use named exports for utility functions and types

2. **Check imports in your IDE**:
   - Most IDEs will suggest the correct import style
   - Use auto-import features when available

3. **Type guard nullable objects**:
   ```typescript
   if (someObject?.nestedProperty) {
     // Now safe to spread
     const newObj = { ...someObject.nestedProperty };
   }
   ```

4. **Use explicit type annotations**:
   ```typescript
   const data = response.data as SystemSetting; 
   ```

5. **Run TypeScript checks frequently**:
   ```bash
   tsc --noEmit
   ```

By following these patterns, you can avoid many common import/export and type-related errors in your TypeScript project.
