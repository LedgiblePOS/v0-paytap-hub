
# TypeScript Best Practices for Preventing Errors

## Overview

This document outlines best practices for preventing TypeScript errors in our application, focusing on the most common issues we encounter and how to solve them.

## Database Entity vs UI Model Pattern

The most common errors in our codebase stem from the mismatch between:
- **Database Entities**: Using snake_case (e.g., `first_name`, `user_id`)
- **UI Models**: Using camelCase (e.g., `firstName`, `userId`)

### How to Properly Use This Pattern:

1. **Always Use Conversion Functions**:
   ```typescript
   import { toUserModel, toUserEntity } from '@/utils/modelConversions';
   
   // When fetching from the database, convert immediately
   const user = toUserModel(databaseUser);
   
   // When saving to the database, convert back
   const dbEntity = toUserEntity(userModel);
   ```

2. **Use TypeScript Features to Ensure Correct Usage**:
   ```typescript
   // Explicitly type your variables
   const user: UserModel = toUserModel(dbUser);
   
   // For arrays, use the batch conversion utilities
   const products: ProductModel[] = toProductModels(dbProducts);
   ```

3. **Set Clear Boundaries**:
   - Database access layer: Use snake_case entities
   - Business logic: Use camelCase models
   - Components: Only accept and use camelCase models

## Common Error Types and How to Fix Them

### 1. Property Access Errors

```typescript
// ❌ WRONG: Accessing camelCase property on snake_case entity
const name = user.firstName; // Error: Property 'firstName' does not exist on type 'User'

// ✅ RIGHT: Convert the entity first
const userModel = toUserModel(user);
const name = userModel.firstName; // Works correctly
```

### 2. Object Creation Errors

```typescript
// ❌ WRONG: Creating an entity with camelCase properties
const product = {
  merchantId: "123", // Error: Object literal may only specify known properties
  name: "Product"
};

// ✅ RIGHT: Create a model and convert it
const productModel: ProductModel = {
  merchantId: "123",
  name: "Product"
};
const productEntity = toProductEntity(productModel);
```

### 3. Function Parameter Errors

```typescript
// ❌ WRONG: Passing a model to a function expecting an entity
saveProduct(productModel); // Error: Type 'ProductModel' is not assignable to parameter of type 'Product'

// ✅ RIGHT: Convert before passing
saveProduct(toProductEntity(productModel));
```

### 4. Array Handling

```typescript
// ❌ WRONG: Trying to map over items without conversion
dbProducts.map(product => product.inStock); // Error: Property 'inStock' does not exist

// ✅ RIGHT: Convert first, then map
toProductModels(dbProducts).map(product => product.inStock);
```

## Special Case: Working with Supabase

When working with Supabase queries, always remember to convert the results:

```typescript
const { data, error } = await supabase
  .from('products')
  .select('*');

if (error) throw error;

// Convert the data to models before using
const productModels = toProductModels(data || []);

// Now you can safely use camelCase properties
productModels.forEach(product => {
  console.log(product.inStock, product.imageUrl);
});
```

## TypeScript Utility Types for Better Type Safety

### 1. Partial for Optional Updates

```typescript
// When updating an entity, you might not have all fields
function updateProduct(id: string, updates: Partial<ProductModel>) {
  // Convert partial model to partial entity
  const entityUpdates: Partial<Product> = {};
  
  if ('name' in updates) entityUpdates.name = updates.name;
  if ('inStock' in updates) entityUpdates.in_stock = updates.inStock;
  
  // Update in database
  return supabase.from('products').update(entityUpdates).eq('id', id);
}
```

### 2. Pick for Selecting Specific Properties

```typescript
// If you only need specific properties
type ProductSummary = Pick<ProductModel, 'id' | 'name' | 'price'>;

function getProductSummaries(): ProductSummary[] {
  return productModels.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price
  }));
}
```

### 3. Omit for Excluding Properties

```typescript
// When creating a new entity, omit auto-generated fields
type NewProduct = Omit<ProductModel, 'id' | 'createdAt' | 'updatedAt'>;

function createProduct(product: NewProduct) {
  return toProductEntity(product as ProductModel);
}
```

## Final Recommendations

1. **Be Consistent**: Always follow the entity/model pattern
2. **Use Type Annotations**: Explicitly annotate variables with their expected types
3. **Leverage Auto-completion**: Let IDE suggestions guide you to correct property names
4. **Write Unit Tests**: Test model conversions to catch issues early
5. **Review Pull Requests**: Look specifically for incorrect property access patterns

By following these guidelines, we can significantly reduce TypeScript errors in our codebase and improve our development efficiency.
