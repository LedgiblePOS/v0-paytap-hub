
# Entity/Model Type Conversion Pattern

## Overview

Our application follows a clear separation between database entities and UI models. This document explains the pattern and how to avoid common TypeScript errors.

## Core Concepts

### Entity Types (Database Layer)

- Use snake_case property naming (e.g., `merchant_id`, `created_at`)
- Direct representations of database tables
- Used when interacting with Supabase or other database operations
- Examples: `Product`, `Merchant`, `Transaction`

### Model Types (UI Layer)

- Use camelCase property naming (e.g., `merchantId`, `createdAt`)
- Optimized for use in React components
- Used in all UI components and rendering logic
- Examples: `ProductModel`, `MerchantModel`, `TransactionModel`

## Conversion Utilities

We have dedicated conversion utilities for transforming between these types:

```typescript
// Entity to Model
toProductModel(product: Product): ProductModel
toMerchantModel(merchant: Merchant): MerchantModel

// Model to Entity
toProductEntity(model: ProductModel): Product
toMerchantEntity(model: MerchantModel): Merchant

// Batch conversions
toProductModels(products: Product[]): ProductModel[]
toProductEntities(models: ProductModel[]): Product[]
```

## Common Error Patterns

1. **Missing snake_case Property**
   ```
   Property 'merchant_id' is missing in type 'ProductModel' but required in type 'Product'
   ```
   This happens when passing a model (UI) to a function expecting an entity (database).
   
   **Fix**: Convert using `toProductEntity(productModel)`

2. **Missing camelCase Property**
   ```
   Property 'merchantId' is missing in type 'Product' but required in type 'ProductModel'
   ```
   This happens when passing an entity (database) to a component expecting a model (UI).
   
   **Fix**: Convert using `toProductModel(productEntity)`

3. **Array Type Mismatch**
   ```
   Type 'ProductModel[]' is not assignable to type 'Product[]'
   ```
   This occurs when passing an array of models where an array of entities is expected.
   
   **Fix**: Convert using `toProductEntities(productModels)`

## Best Practices

1. **Consistent Layer Typing**
   - UI Layer: Always use model types
   - Database Layer: Always use entity types
   - Service Layer: Be explicit about input/output types

2. **Convert at Boundaries**
   - After fetching from database: Convert to model
   - Before sending to database: Convert to entity

3. **Clear Component Props**
   - Document what type each component expects
   - Use consistent typing across related components

4. **TypeScript Tools**
   - Use strict mode to catch errors early
   - Add JSDoc comments to clarify expected types

## Example Workflow

```typescript
// In a service function
async function getProducts(): Promise<ProductModel[]> {
  // Fetch from database (returns Product[] entities)
  const { data: products } = await supabase.from('products').select('*');
  
  // Convert to UI models before returning
  return toProductModels(products);
}

// In a component
function ProductsPage() {
  // Data is already in model format for UI
  const [products, setProducts] = useState<ProductModel[]>([]);
  
  // When saving back to database
  async function saveProduct(productModel: ProductModel) {
    // Convert to entity before saving
    const productEntity = toProductEntity(productModel);
    await supabase.from('products').upsert(productEntity);
  }
  
  // Component only deals with model types
  return <ProductList products={products} onSave={saveProduct} />;
}
```

By following this pattern consistently, we can maintain a clear separation between our database and UI layers while avoiding common TypeScript errors.
