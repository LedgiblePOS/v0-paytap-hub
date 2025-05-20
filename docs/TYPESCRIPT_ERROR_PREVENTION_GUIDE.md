# TypeScript Error Prevention Guide

This document provides solutions for common TypeScript errors encountered in our project and guidance on how to prevent them in future builds.

## 1. Component Children Props Issue

### Error Pattern
```
Type '{ children: Element; }' has no properties in common with type 'IntrinsicAttributes'.
```

### Root Cause
This error occurs when passing children to a component that doesn't explicitly define a `children` property in its props interface. React components don't automatically accept children unless specified.

### Solution
1. Always define a props interface that includes `children` when a component needs to accept children:

```typescript
interface MyComponentProps {
  children?: React.ReactNode;
  // other props...
}

const MyComponent: React.FC<MyComponentProps> = ({ children }) => {
  // component implementation
};
```

2. Use the children prop consistently in component implementations:

```typescript
return (
  <div>
    {children}
  </div>
);
```

### Prevention Strategy
- When creating components that will be used as wrappers, always include the children prop in the interface
- Use React.FC<Props> type with properly defined props interfaces
- Review component usage patterns to ensure proper prop passing

## 2. Supabase Query Type Safety

### Error Pattern
```
Property 'id' does not exist on type 'SelectQueryError<...> | ...'
```

### Root Cause
This occurs when trying to access properties on Supabase query results without properly checking if the data exists and if it has the expected properties.

### Solution
1. Always check data existence before property access:

```typescript
// Correct pattern
const { data, error } = await supabase.from('table').select('id');

// Check if data exists first
if (data && data.length > 0 && 'id' in data[0]) {
  return String(data[0].id);
}
return null;
```

2. For single record queries, use type guards:

```typescript
// For maybeSingle() queries
if (typeof data === 'object' && data !== null && 'id' in data) {
  return String(data.id);
}
```

### Prevention Strategy
- Use proper type narrowing with type guards (typeof, instanceof, in)
- Always check for null/undefined before accessing properties
- Create utility functions for common data access patterns

## 3. Type Conversion Issues

### Error Pattern
```
Argument of type 'string' is not assignable to parameter of type 'number'.
```

### Root Cause
This happens when passing string values to functions expecting numbers, often with IDs or numeric parameters.

### Solution
1. Explicitly convert strings to numbers:

```typescript
// Convert string ID to number
const recordId = parseInt(stringId, 10);

// Check for NaN to handle invalid conversions
if (isNaN(recordId)) {
  throw new Error("Invalid ID format");
}
```

2. Add proper error handling for invalid conversions:

```typescript
try {
  const numericValue = Number(stringValue);
  if (isNaN(numericValue)) {
    throw new Error("Invalid numeric format");
  }
  // Use numericValue
} catch (error) {
  // Handle error
}
```

### Prevention Strategy
- Be explicit about types in function signatures
- Convert types at the boundaries of your application
- Validate data before conversion

## Best Practices Summary

1. **Props Interfaces**
   - Always define explicit props interfaces for components
   - Include `children?: React.ReactNode` for components that render children
   - Use React.FC<YourPropsInterface> to ensure proper type checking

2. **Supabase Data Handling**
   - Always check if data exists before accessing properties
   - Use type guards and narrowing to ensure properties exist
   - Handle null/undefined cases explicitly

3. **Type Conversions**
   - Convert types explicitly at system boundaries
   - Validate converted values (e.g., check for NaN)
   - Use consistent conversion patterns across the codebase

4. **Error Handling**
   - Add proper error handling around type conversions
   - Log errors with meaningful context information
   - Provide fallbacks for invalid data

By following these patterns consistently, we can prevent similar TypeScript errors in future builds and maintain a more robust codebase.
