
# Type Conflict Resolution Guide

## Problem: Multiple Type Definitions for the Same Entity

One common issue in our application is having multiple definitions of the same entity type across different files. This leads to TypeScript errors when these types are incompatible, such as:

```
Type 'import("/src/types/inventory").InventoryItem[]' is not assignable to type 'InventoryItem[]'
```

This error occurs when:
1. We have a centralized type definition in `/src/types/`
2. A component defines its own local interface with the same name
3. Data is passed between components expecting different versions of the same type

## Solution Strategies

### 1. Use a Single Source of Truth

The best approach is to maintain a single definition for each entity type:

```typescript
// In /src/types/inventory.ts
export interface InventoryItem {
  // Common properties used across the application
}

// In all components
import { InventoryItem } from '@/types/inventory';
```

### 2. Type Conversion at Boundaries

When component-specific types are necessary, create explicit conversion functions:

```typescript
// Convert from global type to component-specific type
function toComponentInventoryItem(item: GlobalInventoryItem): ComponentInventoryItem {
  return {
    id: item.id,
    name: item.name,
    // Map other properties accordingly
  };
}
```

### 3. Type Adaptation Pattern

For component-specific needs, extend the base type instead of redefining it:

```typescript
import { InventoryItem } from '@/types/inventory';

// Extend the base type with component-specific properties
interface EnhancedInventoryItem extends InventoryItem {
  displayPrice: string;
  isSelected: boolean;
}
```

### 4. Interface Naming Conventions

To prevent confusion:
- Use specific names for component interfaces: `InventorySummaryItem` instead of just `InventoryItem`
- Name interfaces based on their role: `InventoryItemProps` for component props

## Implementation Example

When dealing with incompatible types:

1. Identify the source of the conflict (check import paths and type definitions)
2. Choose one of the following approaches:
   - Use the centralized type and remove local definitions
   - Rename local interfaces to avoid conflicts
   - Create explicit conversion between types
   - Extend the base type instead of redefining it

## Best Practices

1. **Consistent Naming**: Use consistent property names across related types
2. **Type Documentation**: Document the purpose and usage of each type
3. **Single Responsibility**: Each type should have a clear, single purpose
4. **Type Checking**: Run `npm run type-check` before committing changes
5. **Import Checks**: Verify import paths for types to avoid duplicates

By following these guidelines, we can prevent type conflicts and ensure type consistency across the application.
