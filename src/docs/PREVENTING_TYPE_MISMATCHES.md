
# Preventing Type Mismatches: Best Practices

This document outlines best practices for maintaining consistent type definitions across the application, specifically to avoid common type errors we've encountered.

## Common Type Error Patterns

### 1. Inconsistent Entity Definitions

**Problem:** The same entity (e.g., `InventoryItem`) has multiple definitions across the codebase, leading to type mismatches when components interact.

**Solution:**
- Define each entity type in **one central location** (usually `src/types/`)
- Use imports from this central location throughout the codebase
- Never redefine entity types locally in components

### 2. Required vs. Optional Property Confusion

**Problem:** A property is defined as optional in one place (`id?: string`) but required in another (`id: string`), causing errors like:

```
Type 'Partial<InventoryItem>' is not assignable to parameter of type 'Partial<InventoryItem> & { id: string; }'.
```

**Solution:**
- Create derivative types for specific use cases:
  ```typescript
  // For new items (no ID yet)
  export type NewInventoryItem = Omit<InventoryItem, "id" | "created_at" | "updated_at">;
  
  // For updates (ID required)
  export type UpdateInventoryItem = Partial<InventoryItem> & { id: string };
  ```
- Be explicit about which properties are required in function parameters

### 3. Database Entity vs. UI Model Confusion

**Problem:** Database entities (using snake_case) and UI models (using camelCase) are mixed up.

**Solution:**
- Create clear separation between database entities and UI models
- Use conversion functions at boundaries (API/database layer)
- Document which functions expect entities and which expect models

### 4. Function Return Type Inconsistency

**Problem:** Functions return different types than what TypeScript expects:

```
Type 'Promise<{ success: boolean; rowsProcessed: number; errors: string[][]; }>' 
is not assignable to type 'Promise<ImportResult>'.
```

**Solution:**
- Explicitly define return types for functions
- Ensure the returned object strictly matches the expected type
- Use type assertions only when absolutely necessary and you're certain of the structure

## Prevention Strategies

### 1. Use Strongly Typed Imports

Always import types directly from their source:

```typescript
import { InventoryItem } from '@/types/inventory';
```

### 2. Type Guards for Runtime Safety

Use type guards to validate types at runtime:

```typescript
function isInventoryItem(obj: any): obj is InventoryItem {
  return obj && 
    typeof obj === 'object' && 
    typeof obj.id === 'string' &&
    typeof obj.name === 'string';
}
```

### 3. Create Specialized Types for Different Operations

Define specific types for create, update, and read operations:

```typescript
// For creation (no ID required)
type CreateUserInput = Omit<User, 'id' | 'created_at'>;

// For updates (partial, but ID required)
type UpdateUserInput = Partial<User> & { id: string };

// For responses (complete)
type UserResponse = User;
```

### 4. Constant Vigilance with Mock Data

Ensure mock data conforms to your type definitions:

```typescript
// Define mock data with the correct types
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    // All required properties must be present
  }
];
```

### 5. TypeScript Tooling

- Use IDE features that highlight type errors
- Run `tsc --noEmit` regularly to check for type errors
- Consider adding a pre-commit hook that runs type checking

## Specific Entity Guidelines

### InventoryItem

When working with inventory items:

1. Use `NewInventoryItem` type for creation operations
2. Use `UpdateInventoryItem` type for update operations
3. Ensure all required fields are specified when adding new items
4. Always check for ID existence before updating

### Transaction

When processing transactions:

1. Make sure all required transaction properties are defined
2. Use proper transaction status values (from the enum, not arbitrary strings)
3. Handle nullable fields appropriately

### Customer

For customer operations:

1. Ensure `type` property is explicitly 'retail' | 'wholesale'
2. Handle optional properties safely with nullish coalescing

## Code Reviews

When reviewing code, specifically check for:

1. Consistent use of central type definitions
2. Proper handling of required vs optional properties
3. Explicit typing of function parameters and return values
4. Type-safe handling of external data (API responses, form inputs)

By following these guidelines, we can prevent the most common type errors in our codebase.
