# Type Consistency Best Practices

This document outlines best practices for maintaining type consistency across the application, which helps prevent common TypeScript errors.

## Common Type Errors and Their Fixes

### 1. Interface Mismatch Between Modules

**Problem:** Different modules define or expect different types for the same entity.

**Example:**
```typescript
// In one file:
interface InventoryItem {
  id: string;
  quantity: number;
  // Other properties...
}

// In another file (importing from a different location):
interface InventoryItem {
  id: string;
  quantity: number;
  price: number; // Extra required property!
  // Other properties...
}
```

**Fix:**
- Create a single source of truth for each type definition
- Export all shared types from a central location
- Ensure all imports reference this shared definition

### 2. Optional vs. Required Properties in Function Parameters

**Problem:** Functions expect required properties that are defined as optional in the type definitions.

**Example:**
```typescript
interface User {
  id?: string;
  name: string;
}

// Error: Property 'id' is optional in type 'User' but required in type '{ id: string }'
function updateUser(user: User & { id: string }) {
  // Implementation
}
```

**Fix:**
- Be explicit about which properties are required in function parameters
- Use intersection types to add required constraints
- Consider making critical properties non-optional in the base type

### 3. Array Type Mismatches

**Problem:** Arrays of different but similar types are used interchangeably.

**Example:**
```typescript
// Type 'ServerInventoryItem[]' is not assignable to type 'ClientInventoryItem[]'
const items: ClientInventoryItem[] = fetchItemsFromServer(); // Returns ServerInventoryItem[]
```

**Fix:**
- Create mapping functions to convert between different type representations
- Use utility types like `Pick<>` or `Omit<>` to create compatible types
- Consider using generic types to maintain type relationships

### 4. Return Type Inconsistency in Async Functions

**Problem:** Promise return types don't match the expected return type.

**Example:**
```typescript
// Type 'Promise<{ success: boolean; errors: string[][] }>'
// is not assignable to type 'Promise<ImportResult>'
const handleImport = async (): Promise<ImportResult> => {
  // Returns a different structure
  return { success: true, errors: [['Error 1'], ['Error 2']] };
};
```

**Fix:**
- Explicitly define and adhere to return types
- Create transformation functions to conform to expected interfaces
- Use type assertions only when you're certain of the structure

## Best Practices for Preventing Type Errors

### 1. Single Source of Truth for Types

Always define each entity type in one location and import it where needed. This ensures consistency across the application.

```typescript
// src/types/inventory.ts
export interface InventoryItem { /* ... */ }

// In component files
import { InventoryItem } from '@/types/inventory';
```

### 2. Type Guards for Runtime Safety

Use type guards to validate types at runtime, especially when dealing with external data:

```typescript
function isInventoryItem(obj: any): obj is InventoryItem {
  return obj && 
    typeof obj === 'object' && 
    typeof obj.id === 'string' &&
    typeof obj.quantity === 'number';
}

// Usage
if (isInventoryItem(data)) {
  // TypeScript knows data is InventoryItem here
}
```

### 3. Use Type Predicates for Nullable Values

For values that might be null or undefined:

```typescript
function ensureItemHasId(item: Partial<InventoryItem>): item is (Partial<InventoryItem> & { id: string }) {
  return item.id !== undefined;
}

// Usage
if (ensureItemHasId(item)) {
  updateItem.mutateAsync(item); // TypeScript knows id exists
}
```

### 4. Explicit Generic Types

Always provide explicit type parameters to generic functions to avoid inference errors:

```typescript
// Good
const result = await Promise.all<Result[]>(promises);

// Avoid (might infer incorrect types)
const result = await Promise.all(promises);
```

### 5. Type-Safe API Responses

When working with API responses, define explicit interface types and validate the response data:

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  errors?: string[];
}

async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const result = await response.json();
  
  // Validate structure matches ApiResponse<T>
  if (!result.success && !Array.isArray(result.errors)) {
    result.errors = ['Unknown error'];
  }
  
  return result;
}
```

By following these practices, we can significantly reduce type errors and improve code maintainability.
