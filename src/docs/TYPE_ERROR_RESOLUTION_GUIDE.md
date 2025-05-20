# Type Error Resolution Guide

This document outlines patterns for resolving common TypeScript errors in our codebase and recommendations to prevent them.

## Common Error Patterns and Solutions

### 1. Missing Type Definitions

**Error:** `TS2305: Module '@/types' has no exported member 'X'`

**Solution:**
- Define all entity types in dedicated files under `src/types/`
- Export those types from the index.ts barrel file
- Ensure naming consistency (e.g., don't mix `Product` and `ProductModel`)

**Example Fix:**
```typescript
// In src/types/product.ts
export interface Product {
  id: string;
  // other properties...
}

// In src/types/index.ts
export * from './product';
```

### 2. Component Props Type Mismatches

**Error:** `TS2559: Type '{ children: Element; }' has no properties in common with type 'IntrinsicAttributes'`

**Solution:**
- Define proper interface for component props
- Ensure the component is correctly typed to accept children

**Example Fix:**
```typescript
interface MyComponentProps {
  children?: React.ReactNode; // Make children a valid prop
}

const MyComponent: React.FC<MyComponentProps> = ({ children }) => {
  return <div>{children}</div>;
};
```

### 3. Type Compatibility Issues

**Error:** `TS2322: Type 'X' is not assignable to type 'Y'`

**Solution:**
- Create type conversion utilities to transform between similar types
- Use proper type assertions where needed
- Define union types to handle multiple type possibilities

**Example Fix:**
```typescript
// Convert database entity to frontend model
const toUserModel = (user: User): UserModel => ({
  id: user.id,
  firstName: user.first_name,
  // other mapped properties...
});
```

### 4. Duplicate Type Definitions

**Error:** `TS2300: Duplicate identifier 'X'`

**Solution:**
- Keep type definitions in a single location
- Use import/export instead of redefining types
- Check for name conflicts across the codebase

### 5. Missing Import Issues

**Error:** `TS2304: Cannot find name 'X'`

**Solution:**
- Always import required components, hooks, and utilities
- Check for correct import paths
- Use IDE auto-imports to prevent typos

## Best Practices

1. **Centralize Type Definitions**:
   - Define entity types in dedicated files under `src/types/`
   - Export from a barrel file (index.ts) to make imports cleaner
   - Use descriptive names to distinguish between similar types (e.g., `Product` vs `ProductModel`)

2. **Use Type Conversion Functions**:
   - Create utility functions to convert between database entities and frontend models
   - Keep these conversions consistent across the application
   - Place conversion functions in dedicated utility files

3. **Export/Import Best Practices**:
   - Use named exports for multiple items from a file
   - Use default exports sparingly, only for main components
   - Prefer importing from barrel files to reduce import lines

4. **React Component Props**:
   - Always define props interface for components that accept props
   - Use React.FC<PropsType> for functional components
   - Use React.ReactNode for children prop types

5. **Type Guards and Assertions**:
   - Use type guards to validate types at runtime
   - Use type assertions only when you are certain of the type
   - Consider creating custom type guards for complex types

6. **Prevent Duplicate Types**:
   - Check for existing types before creating new ones
   - Leverage type extensions and intersections instead of duplication
   - Use IDE features to navigate to type definitions

By following these practices, we can significantly reduce TypeScript errors and improve code quality.
