
# TypeScript Model-Entity Conversion Error Prevention Guide

## Overview

Our application follows a strict pattern to handle data between the database (snake_case entities) and the UI (camelCase models). This guide explains how to use this pattern correctly to avoid TypeScript errors.

## Common Errors We're Preventing

1. **Missing Properties Errors**:
   ```
   Property 'merchantId' is missing in type 'Product' but required in type 'ProductModel'.
   ```

2. **Incompatible Types Errors**:
   ```
   Type 'ProductModel[]' is not assignable to type 'Product[]'.
   ```

3. **Export/Import Errors**:
   ```
   Module '"./MerchantNavItems"' has no exported member 'MerchantNavItems'.
   ```

## Best Practices for Error Prevention

### 1. Always Use the Right Type at the Right Layer

- **Database Layer**: Use entity types (snake_case) when interacting with Supabase
- **UI Layer**: Use model types (camelCase) in React components
- **Service Layer**: Convert between types as needed

### 2. Convert at Boundaries

ALWAYS convert between types at the boundary between layers:

```typescript
// After fetching from database (entity -> model)
const { data, error } = await supabase.from('products').select('*');
const productModels = toProductModels(data as Product[]);
return productModels;

// Before saving to database (model -> entity)
const productEntity = toProductEntity(productModel);
await supabase.from('products').update(productEntity).eq('id', productEntity.id);
```

### 3. Explicit Exports and Imports

Always use one of these patterns for exporting components:

```typescript
// Option 1: Default export
const ComponentName = () => { /* component code */ };
export default ComponentName;

// Option 2: Named export
export const ComponentName = () => { /* component code */ };
```

And match the import style with the export style:

```typescript
// For default exports
import ComponentName from './path/to/ComponentName';

// For named exports 
import { ComponentName } from './path/to/file';
```

### 4. Register New Types and Converters

When adding new entity/model pairs:

1. Define both types (entity and model)
2. Create converters (toEntityModel, toModelEntity, etc.)
3. Register converters in the main index.ts export file
4. Import and use them consistently

### 5. Watch for Props Interface Inconsistencies

Ensure component props interfaces match your data:

```typescript
// CORRECT: Component expects models
interface ProductListProps {
  products: ProductModel[];
}

// CORRECT: Component expects entities
interface ProductEntityListProps {
  products: Product[];
}
```

### 6. Use TypeScript Checks

Run TypeScript checks before committing code:

```bash
npm run typecheck
```

## Entity/Model Conversion Pattern

For any data type:

1. Define entity (snake_case) in types.ts
2. Define model (camelCase) in models.ts
3. Create converters in modelConversions folder
4. Export converters from index.ts
5. Use converters at boundaries

## Debugging Tips

If you see TypeScript errors related to missing properties:

1. Check if you're using an entity where a model is expected (or vice versa)
2. Look for missing conversions at boundaries
3. Ensure all properties are correctly mapped in converters
4. Verify your import/export patterns

By following these guidelines, we can prevent most TypeScript errors related to our entity/model pattern.
