
# TypeScript Error Prevention Guide

## Common Error Pattern: Entity/Model Type Mismatch

One of the most common issues we've encountered in the codebase is mismatches between entity types (snake_case, used for database) and model types (camelCase, used for UI components). This guide will help prevent such errors.

### Understanding the Pattern

Our codebase uses a clear separation between:

1. **Entity Types (Database)**: Use snake_case property naming (e.g., `merchant_id`, `in_stock`)
   - Examples: `Product`, `Merchant`, `Transaction`
   - Used when interacting with database (Supabase)

2. **Model Types (UI)**: Use camelCase property naming (e.g., `merchantId`, `inStock`)
   - Examples: `ProductModel`, `MerchantModel`, `TransactionModel`
   - Used in React components and UI logic

### Prevention Strategies

#### 1. Always Convert at Boundaries

When data crosses the boundary between database and UI, convert it:

```typescript
// After fetching from database
const product = await supabase.from('products').select('*').single();
const productModel = toProductModel(product);

// Before sending to database
const productEntity = toProductEntity(productModel);
await supabase.from('products').insert(productEntity);
```

#### 2. Be Consistent with Type Usage

- **Database Operations**: Always use entity types (snake_case)
- **UI Components**: Always use model types (camelCase)
- **Service Functions**: Be explicit about what they accept and return

#### 3. Use Type Checking

Before committing code, run TypeScript type checking:

```bash
npm run typecheck
```

#### 4. Common Error Messages and Fixes

| Error Message | Likely Cause | Fix |
|---------------|--------------|-----|
| Property 'merchant_id' is missing in type 'ProductModel' | Passing a model to a function expecting an entity | Convert using `toProductEntity()` |
| Property 'merchantId' is missing in type 'Product' | Passing an entity to a function expecting a model | Convert using `toProductModel()` |
| Type 'ProductModel[]' is not assignable to type 'Product[]' | Using model array where entity array is expected | Convert using `toProductEntities()` |

### Conversion Functions

We have utility functions for each entity/model pair:

```typescript
// Single item conversions
toProductModel(productEntity)
toProductEntity(productModel)

// Batch conversions
toProductModels(productEntities)
toProductEntities(productModels)
```

### Best Practices

1. Check prop types carefully - know whether components expect entity or model types
2. Use explicit type annotations to catch errors early
3. When in doubt, console.log the data structure to understand its format
4. Document whether functions expect entity or model types in comments
5. Consider creating higher-order components that handle conversions automatically

By following these guidelines, we can prevent the common TypeScript errors that arise from entity/model type mismatches.
