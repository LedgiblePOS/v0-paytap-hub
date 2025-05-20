# TypeScript Error Resolution Guide

This document provides solutions to common TypeScript errors encountered in our codebase, along with explanations and patterns to prevent them in future development.

## Error: TS2559 - No properties in common with IntrinsicAttributes

### Example Error
```
error TS2559: Type '{ children: string | number | true | Element | Iterable<ReactNode>; }' has no properties in common with type 'IntrinsicAttributes'.
```

### Root Cause
This error occurs when passing the `children` prop to a component that doesn't accept it. It typically happens when:
1. A component is defined without a proper props interface that includes children
2. A component is passed children but uses the incorrect props type definition
3. A component is incorrectly used as a simple wrapper when it's not designed for that purpose

### Solution Pattern
1. Define component interfaces that explicitly include children when needed:
```typescript
interface ComponentProps {
  children?: React.ReactNode;
  // other props...
}

const Component: React.FC<ComponentProps> = ({ children, ...otherProps }) => {
  // component logic
};
```

2. Use React.FC type which includes children by default, but be explicit in your props interface:
```typescript
const Component: React.FC = ({ children }) => {
  // component logic
};
```

3. When a component needs to be used as an error boundary or similar wrapper, ensure it can accept children:
```typescript
// Fixed approach
<ErrorBoundary>
  <Outlet />
</ErrorBoundary>

// Instead of
<ErrorBoundary children={<Outlet />} />
```

## Error: TS2339 - Property does not exist on type

### Example Error
```
error TS2339: Property 'id' does not exist on type 'SelectQueryError<"Invalid Relationships cannot infer result type"> | SelectQueryError<"Invalid RelationName cannot infer result type">'.
```

### Root Cause
This error occurs when trying to access properties on a Supabase query result without proper type checking. Supabase queries can return either data or an error, and each has different properties.

### Solution Pattern
1. Properly handle the potential types:
```typescript
const { data, error } = await supabase.from('table').select('*');

// Check for error first
if (error) {
  console.error("Error:", error);
  return null;
}

// Now we know data exists and can safely access it
return data ? data.someProperty : null;
```

2. Use proper type guards:
```typescript
const checkExists = async () => {
  const { data, error } = await supabase.from('table').select('id');
  
  if (error) {
    console.error("Error:", error);
    return null;
  }
  
  return data && data.length > 0 ? data[0].id : null;
};
```

3. Use type assertions only when necessary:
```typescript
// Convert string ID to number for database operations
const recordId = parseInt(idString, 10);
```

## Error: TS2345 - Argument is not assignable to parameter

### Example Error
```
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

### Root Cause
This error occurs when passing a value of one type (like string) to a function or method that expects another type (like number). Common causes:
1. Database IDs retrieved as strings but needed as numbers
2. User input not being converted to the proper type
3. API responses with numeric values as strings

### Solution Pattern
1. Convert types explicitly at the boundary where needed:
```typescript
// Convert string ID to number for database operations
const recordId = parseInt(idString, 10);
```

2. Use conditional type checks:
```typescript
const value = typeof input === 'string' ? parseInt(input, 10) : input;
```

3. Add proper validation:
```typescript
if (isNaN(Number(input))) {
  throw new Error("Invalid numeric input");
}
const value = Number(input);
```

## Best Practices to Prevent TypeScript Errors

1. **Define interfaces explicitly** for all component props, API responses, and function parameters
2. **Use guards to check for nullability** before accessing properties
3. **Handle API responses safely** by checking for errors before accessing data
4. **Convert types at boundaries** where data crosses from external sources into your system
5. **Be explicit about children props** in React components

By following these patterns, we can prevent the most common TypeScript errors and create a more robust codebase.
