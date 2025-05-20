
# Spread Operator TypeScript Best Practices

## Common Error: "Spread types may only be created from object types"

This error occurs when trying to use the spread operator (`...`) on a value that might be `null`, `undefined`, or not an object.

### Issue Example

```typescript
// Error-prone code
let updatedData = { ...currentData?.verification_data };
```

This code will fail if `verification_data` is null or undefined because the spread operator can only be applied to objects.

### Solutions

#### 1. Use Default Empty Object with Type Assertion

```typescript
// Solution 1: Provide a default empty object with type assertion
const updatedData = { 
  ...(currentData?.verification_data || {} as Record<string, any>) 
};
```

#### 2. Use Conditional Spreading with Fallback

```typescript
// Solution 2: Conditional spreading
const baseData = currentData?.verification_data ? 
  currentData.verification_data : {};
const updatedData = { ...baseData };
```

#### 3. Use Optional Chaining with Nullish Coalescing

```typescript
// Solution 3: Optional chaining with nullish coalescing
const updatedData = { 
  ...(currentData?.verification_data ?? {})
};
```

### Best Practices for Spread Operations:

1. **Always validate before spreading**: Check if the value is an object before using the spread operator.

2. **Provide fallbacks**: Use nullish coalescing (`??`) or logical OR (`||`) to provide default values.

3. **Use type assertions carefully**: When using type assertions like `as Record<string, any>`, ensure they match the expected structure.

4. **Consider optional chaining**: Use `?.` to safely access nested properties.

5. **Use proper typing**: Define interfaces for your data structures to get better type checking.

### Example of Safe Pattern:

```typescript
interface VerificationData {
  submissionDate?: string;
  documents?: string[];
  status?: string;
  [key: string]: any; // For additional dynamic properties
}

// Safe pattern with proper typing
const updatedData: VerificationData = {
  ...(currentData?.verification_data as VerificationData || {}),
  rejection_reason: reason,
  rejection_date: new Date().toISOString()
};
```

By following these patterns, you can avoid the "Spread types may only be created from object types" error and ensure your code is more robust.
