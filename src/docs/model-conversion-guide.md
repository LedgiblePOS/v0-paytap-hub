# Model Conversion Guide

This guide explains how to properly use our model conversion system to prevent TypeScript errors.

## Core Concepts

Our application uses two types of data structures:

1. **Database Entities** (snake_case): Represent data as stored in the database
   - Example: `{ first_name: "John", last_name: "Doe" }`
   - Use these when interacting directly with Supabase or other database APIs

2. **UI Models** (camelCase): Represent data in a format friendly to frontend code
   - Example: `{ firstName: "John", lastName: "Doe" }`
   - Use these in components, business logic, and most application code

## When to Convert

### Entity → Model (snake_case → camelCase)

Convert **immediately** after retrieving data from the database:

```typescript
// Data fetching example
const { data, error } = await supabase.from('users').select('*');
if (error) throw error;

// Convert to models immediately
const userModels = toUserModels(data);

// Now work with the models throughout your application
return userModels;
```

### Model → Entity (camelCase → snake_case) 

Convert **just before** sending data to the database:

```typescript
// Get data from a form or state as a model
const userModel: UserModel = {
  firstName: "Jane",
  lastName: "Smith",
  email: "jane@example.com",
  // ... other properties
};

// Convert to entity only when ready to save
const userEntity = toUserEntity(userModel);
const { data, error } = await supabase.from('users').insert(userEntity);
```

## Conversion Functions

Our application provides several utility functions for conversion:

### Individual Entity Conversions

For converting single items:

```typescript
// Entity to Model
const userModel = toUserModel(userEntity);
const productModel = toProductModel(productEntity);
const customerModel = toCustomerModel(customerEntity);

// Model to Entity
const userEntity = toUserEntity(userModel);
const productEntity = toProductEntity(productModel);
const customerEntity = toCustomerEntity(customerModel);
```

### Batch Conversions

For converting arrays of items:

```typescript
// Entity arrays to Model arrays
const userModels = toUserModels(userEntities);
const productModels = toProductModels(productEntities);
const customerModels = toCustomerModels(customerEntities);

// Model arrays to Entity arrays
const userEntities = toUserEntities(userModels);
const productEntities = toProductEntities(productModels);
const customerEntities = toCustomerEntities(customerModels);
```

## Common Patterns

### Fetching and Displaying Data

```typescript
// In a data fetching hook
const fetchProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw error;
  return toProductModels(data);
};

// In a component
function ProductList() {
  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>In stock: {product.inStock}</p>
          <img src={product.imageUrl} alt={product.name} />
        </div>
      ))}
    </div>
  );
}
```

### Creating and Updating Data

```typescript
// Creating a new item
const createProduct = async (productModel: Omit<ProductModel, 'id' | 'createdAt' | 'updatedAt'>) => {
  const entity = toProductEntity(productModel as ProductModel);
  const { data, error } = await supabase.from('products').insert(entity);
  if (error) throw error;
  return data ? toProductModel(data[0]) : null;
};

// Updating an existing item
const updateProduct = async (id: string, updates: Partial<ProductModel>) => {
  // Convert just the updated fields to entity format
  const entityUpdates = {};
  
  if ('name' in updates) entityUpdates['name'] = updates.name;
  if ('price' in updates) entityUpdates['price'] = updates.price;
  if ('inStock' in updates) entityUpdates['in_stock'] = updates.inStock;
  if ('imageUrl' in updates) entityUpdates['image_url'] = updates.imageUrl;
  
  const { data, error } = await supabase
    .from('products')
    .update(entityUpdates)
    .eq('id', id);
    
  if (error) throw error;
  return data ? toProductModel(data[0]) : null;
};
```

## Troubleshooting

If you encounter a TypeScript error related to property access (e.g., `Property 'firstName' does not exist on type 'User'`), it usually means you're trying to access a model property on an entity or vice versa.

### Resolution Steps:

1. Check the type of your variable
2. Make sure you've applied the appropriate conversion function
3. Ensure you're using consistent naming (camelCase for models, snake_case for entities)
4. When in doubt, explicitly type your variables

```typescript
// If unsure about the type, add explicit annotations
const userModel: UserModel = toUserModel(dbUser);
const userName = userModel.firstName; // Now TypeScript knows this is correct
```

By following these guidelines consistently, you can eliminate most TypeScript errors related to property access and type mismatches in our application.
