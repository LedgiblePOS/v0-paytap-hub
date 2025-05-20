
# Subscription Plan Type Fixes

## Issue Overview

We encountered several type inconsistencies with the `SubscriptionPlan` interface that caused TypeScript errors. These errors arose because:

1. The database schema uses snake_case (e.g., `monthly_price`), but our frontend models use camelCase (e.g., `monthlyPrice`)
2. Some components were using properties that weren't defined in the type interface
3. The `features` field was sometimes a string and sometimes a string array

## Resolution

We've implemented the following changes:

### 1. Consistent Property Naming

We updated the `SubscriptionPlan` interface to use camelCase consistently:

```typescript
export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  productLimit: number;
  features: string[];
  isActive: boolean;
  description: string;
  price?: number; // For backward compatibility
}
```

### 2. Backward Compatibility

To maintain compatibility with existing code that may rely on snake_case properties, we added optional snake_case aliases:

```typescript
export interface SubscriptionPlan {
  // camelCase properties
  monthlyPrice: number;
  // ...
  
  // snake_case aliases for backward compatibility
  monthly_price?: number;
  annual_price?: number;
  product_limit?: number;
  is_active?: boolean;
}
```

### 3. Features Field Normalization

We standardized the `features` field as a string array but ensured our converters can handle string-encoded JSON:

```typescript
// In converters
const features = typeof entity.features === 'string' 
  ? JSON.parse(entity.features || "[]") 
  : (entity.features || []);
```

### 4. Type Conversion in Components

In `SubscriptionManagement.tsx`, we now properly convert database entities to our frontend model:

```typescript
queryFn: async () => {
  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*");

  if (error) throw error;
  
  return data.map(plan => ({
    id: plan.id,
    name: plan.name,
    monthlyPrice: plan.monthly_price,
    annualPrice: plan.annual_price,
    productLimit: plan.product_limit || 10,
    features: typeof plan.features === 'string' ? 
      JSON.parse(plan.features || "[]") : 
      (plan.features || []),
    isActive: plan.is_active || false,
    description: plan.description || "",
    price: plan.monthly_price // For backward compatibility
  }));
},
```

## Preventing Future Issues

1. **Always use converters**: Don't directly assign database objects to typed variables
2. **Keep types in sync with database**: When database schema changes, update types
3. **Type checking**: Run TypeScript checks before committing changes
4. **Standardized naming**: Use camelCase in frontend, snake_case for database

By following these practices, we can prevent future type inconsistencies and errors.
