# Consistent Type Usage Guide

This document outlines best practices for maintaining consistent type usage across our application, focusing on preventing the most common type errors we've encountered.

## Entity vs. Model Pattern

We use two primary types for most entities in our system:

1. **Entity Types** (snake_case): Represent database schema
   - Example: `Product` with fields like `merchant_id`
   - Used when working directly with database responses

2. **Model Types** (camelCase): Frontend-friendly representations
   - Example: `ProductModel` with fields like `merchantId`
   - Used in component props, state, and UI logic

### Best Practices:

- Keep entities and models in separate interfaces
- Use conversion utilities to transform between them
- Be explicit about which type you're using in function signatures

```typescript
// Entity (from database)
interface Product {
  id: string;
  merchant_id: string;
  // ...other fields
}

// Model (for frontend)
interface ProductModel {
  id: string;
  merchantId: string;
  // ...other fields
}

// Conversion utility
const toProductModel = (product: Product): ProductModel => ({
  id: product.id,
  merchantId: product.merchant_id,
  // ...convert other fields
});
```

## Type Export Strategy

For clean imports and organization:

1. **Define specific types in domain-specific files**
   - Example: All product-related types in `types/product.ts`

2. **Export from a barrel file for convenience**
   - Re-export all from domain files in `types/index.ts`
   - Allows importing directly from '@/types'

3. **Prefer named exports over default exports for types**
   - Makes imports more explicit and refactor-friendly

## Enum Consistency

When working with enums:

1. **Define enums in a single location**
   - Keep related enums in the same file
   - Export them from that file only

2. **Use string values for easier debugging**
   - Example: `UserRole.ADMIN = 'ADMIN'` instead of numeric values

3. **Import enums directly, don't recreate them**
   - Never use string literals when an enum exists

```typescript
// GOOD
import { UserRole } from '@/types/user';
const role = UserRole.ADMIN;

// BAD
const role = 'ADMIN';
```

## Component Props Pattern

For React components:

1. **Always define Props interface**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}
```

2. **Use React.FC with generic type parameter**
```typescript
const Button: React.FC<ButtonProps> = ({ variant = 'primary', children }) => {
  // ...
};
```

3. **Always accommodate children properly**
```typescript
interface LayoutProps {
  children?: React.ReactNode; // Make children optional or required as needed
}
```

## Handling API Data

When working with API responses:

1. **Type guard for safety**
```typescript
const isProduct = (data: any): data is Product => {
  return data && typeof data === 'object' && 'id' in data && 'name' in data;
};
```

2. **Handle missing or nullable fields with defaults**
```typescript
const productName = product?.name || 'Untitled Product';
```

3. **Use type assertions only when necessary and safe**
```typescript
// Only when you're sure of the structure
const productData = response.data as unknown as Product;
```

## Preventing Common Errors

1. **No Property Error (`Property 'X' does not exist on type 'Y'`):**
   - Check if you're using the right type (entity vs model)
   - Ensure you're importing the correct type definition
   - Use optional chaining for potentially undefined properties

2. **Type Assignment Error (`Type 'X' is not assignable to type 'Y'`):**
   - Use proper type conversion functions
   - Verify that enum values match between imports
   - Check for subtle differences like required vs optional properties

3. **Module Import Error (`Module has no exported member 'X'`):**
   - Verify that the type is exported from the module
   - Check for typos in the import statement
   - Ensure that barrel files re-export the type

By following these practices consistently, we can significantly reduce TypeScript errors and improve code quality throughout the application.
