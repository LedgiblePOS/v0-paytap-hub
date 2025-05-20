
# Entity/Model Type Conversion Errors: Guide for Prevention

## Understanding the Issue

Our application maintains a clear separation between database entities (snake_case) and UI models (camelCase). 
The TypeScript errors occur when we try to use one where the other is expected.

## Common Error Patterns

1. **Type Mismatch: TransactionModel[] vs Transaction[]**
   - Error: `Type 'TransactionModel[]' is not assignable to type 'Transaction[]'`
   - Happens when: A component expects snake_case entities but receives camelCase models

2. **Missing Properties**
   - Error: `Property 'merchant_id' is missing in type 'ProductModel' but required in type 'Product'`
   - Happens when: Trying to use a model (UI) where an entity (database) is expected

3. **Number/String Type Mismatches**
   - Error: `Argument of type 'number' is not assignable to parameter of type 'string'`
   - Happens when: Type definitions don't match between the API and UI layers

## Best Practices to Prevent These Errors

1. **Always Convert at Boundaries**
   - When fetching from database: Convert entities to models immediately
   - When sending to database: Convert models to entities
   - When passing to components: Check what type the component expects and convert accordingly

2. **Use Conversion Utilities**
   ```typescript
   // Convert single items
   const userModel = toUserModel(userEntity);
   const userEntity = toUserEntity(userModel);
   
   // Convert arrays
   const productModels = toProductModels(productEntities);
   const productEntities = toProductEntities(productModels);
   ```

3. **Check Component Props**
   - Before passing data to a component, check its prop types
   - Component names can give clues: If it has "Entity" in the name, it likely expects database entities

4. **Common Conversion Points**
   - After API/database fetches
   - Before database updates
   - Before passing to components with specific type requirements

## Examples of Fixed Code

### Example 1: Passing transactions to a component
```typescript
// Wrong:
<RecentTransactions transactions={recentTransactions} /> // recentTransactions is TransactionModel[]

// Correct:
const transactionEntities = toTransactionEntities(recentTransactions);
<RecentTransactions transactions={transactionEntities} /> // Now it's Transaction[]
```

### Example 2: Converting for database operations
```typescript
// Wrong:
await updateProductStock(product.id, newStockValue); // product is ProductModel

// Correct:
const productEntity = toProductEntity(product);
await updateProductStock(productEntity.id, newStockValue);
```

## Troubleshooting Steps

If you encounter TypeScript errors related to entity/model mismatches:

1. Identify whether the error is about missing snake_case properties (like `merchant_id`) or camelCase properties (like `merchantId`)
2. Determine if you need to convert from entity to model or model to entity
3. Use the appropriate conversion utility from `@/utils/modelConversions`
4. Check component documentation to understand what types it expects
5. Use explicit type annotations to catch these errors early

Remember: Model types (camelCase) are for UI, Entity types (snake_case) are for database operations.
