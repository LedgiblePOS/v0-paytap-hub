# Common TypeScript Error Fixes

This document provides guidelines on how to fix common TypeScript errors encountered in our project.

## 1. Children Props in React Components

### Error Pattern
```
error TS2559: Type '{ children: Element; }' has no properties in common with type 'IntrinsicAttributes'.
```

### Solution
Always define a props interface that explicitly includes children when a component needs to accept children:

```typescript
interface MyComponentProps {
  children?: React.ReactNode;
  // other props...
}

const MyComponent: React.FC<MyComponentProps> = ({ children }) => {
  // component implementation
};
```

Fixed in:
- `ProtectedMerchantLayout.tsx` - Added proper props interface with children
- `MerchantRoutes.tsx` - Fixed how we pass props to ProtectedMerchantLayout

## 2. Supabase Query Response Type Checking

### Error Pattern
```
error TS2339: Property 'id' does not exist on type 'SelectQueryError<...> | ...'
```

### Solution
Always properly check if data exists and if properties exist on data objects from Supabase queries:

```typescript
// CORRECT
const { data, error } = await supabase.from('table').select('id').maybeSingle();

// Check if data exists AND has the property we want to access
return data && 'id' in data ? String(data.id) : null;
```

Fixed in:
- `baseSettingsService.ts` - Added proper type checking
- Applied pattern throughout the codebase

## 3. String vs Number ID Conversion

### Error Pattern
```
error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
```

### Solution
Explicitly convert string IDs to numbers when needed:

```typescript
// CORRECT
const recordId = parseInt(stringId, 10);
```

Fixed in:
- `securitySettingsService.ts` - Added proper conversion
- `systemSettingsService.ts` - Added proper conversion

## Best Practices

1. **Always define prop types**: Create interfaces for component props
2. **Check for existence before access**: Use optional chaining and type guards
3. **Convert types explicitly**: Don't rely on implicit conversions
4. **Use proper TypeScript assertions**: Only when absolutely necessary, and with proper checking
5. **Document edge cases**: Add comments for complex type handling patterns

By following these practices, we can maintain better type safety throughout the project.
