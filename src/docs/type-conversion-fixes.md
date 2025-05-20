
# TypeScript Entity-Model Conversion Fixes

## Overview of Fixed Issues

We've addressed several recurring patterns of TypeScript errors in the codebase:

1. **Missing Properties in Hook Return Values**
   - Added `customerInsights` and `totalRevenue` properties to the return value of `useAnalyticsData`
   - Ensured returned data matches what components expect

2. **Model/Entity Type Mismatches**
   - Fixed mismatches between `Merchant` (snake_case) and `MerchantModel` (camelCase)
   - Fixed mismatches between `Transaction` and `TransactionModel`
   - Fixed mismatches between `Product` and `ProductModel`

3. **Incorrect Function Arguments**
   - Updated `useDashboardData` to not accept arguments
   - Ensured proper conversion between entity and model types when calling services

4. **Component Prop Type Mismatches**
   - Updated `DashboardContent` to receive entity types that it expects
   - Added proper conversion between models and entities

## Best Practices for Entity-Model Pattern

### 1. Always Convert at Boundaries

- When fetching from the database, immediately convert to model:
  ```typescript
  const data = await supabase.from('products').select('*');
  return toProductModels(data);
  ```

- When sending to the database, convert to entity:
  ```typescript
  const productEntity = toProductEntity(productModel);
  await supabase.from('products').insert(productEntity);
  ```

### 2. Use Proper Naming and Types

- Entity types (database): `Product`, `Merchant`, `Transaction` (snake_case properties)
- Model types (UI): `ProductModel`, `MerchantModel`, `TransactionModel` (camelCase properties)

### 3. Check Component Expectations

- Check what type components expect (entity or model)
- Convert as needed before passing props:
  ```typescript
  // If component expects entity but you have model
  const entityData = toMerchantEntity(modelData);
  <ComponentThatExpectsEntity data={entityData} />
  
  // If component expects model but you have entity
  const modelData = toMerchantModel(entityData);
  <ComponentThatExpectsModel data={modelData} />
  ```

### 4. Consistent Hook Return Types

- Clearly define the shape of data returned from hooks
- Ensure all referenced properties are actually returned

## Pattern for Converting Property Names

When converting partial objects (for updates), use explicit property mapping:

```typescript
// Converting from model (UI) to entity (database)
const updateData: Partial<Product> = {};
if (productData.merchantId !== undefined) updateData.merchant_id = productData.merchantId;
if (productData.name !== undefined) updateData.name = productData.name;
if (productData.inStock !== undefined) updateData.in_stock = productData.inStock;
```

## Remaining TODO Items

- Continue applying these patterns to other files
- Consider creating more automated conversion utilities
- Add runtime type checks for API responses
- Create test cases that verify conversion correctness

By following these patterns consistently, we'll significantly reduce TypeScript errors and improve code maintainability.
