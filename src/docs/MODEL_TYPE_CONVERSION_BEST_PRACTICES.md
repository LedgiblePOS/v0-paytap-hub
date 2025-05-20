
# Model/Entity Type Conversion: Best Practices

## Issue Overview

We recently encountered type mismatch errors between our database entity types (snake_case) and UI model types (camelCase). This document outlines best practices to prevent similar issues.

## Common Issues

1. **Inconsistent Type Definitions**: Different files defining the same entity type with different property requirements.
   - Example: `Customer` defined with required `email` in one file, but optional `email?` in another.

2. **Type Boundaries Not Respected**: Using database entity types in UI components or vice versa.
   - Example: Passing a `CustomerModel` to a function expecting a `Customer`.

3. **Missing Type Conversions**: Not using converter functions at appropriate boundaries.
   - Example: Not using `toCustomerModel()` when fetching from the database.

## Best Practices

### 1. Single Source of Truth for Type Definitions
- Define entity types (snake_case) in `src/types/index.ts`
- Define model types (camelCase) in `src/types/models.ts`
- Use these types consistently across the application

### 2. Consistent Optional Properties
- Mark properties as optional (`?`) consistently across all type definitions
- Remember that database columns might allow NULL values
- Handle null/undefined values explicitly in conversion functions

### 3. Clear Boundary Conversions
- **Database → UI**: Always convert entities to models immediately after fetching
  ```typescript
  const { data } = await supabase.from('customers').select('*');
  const customerModels = toCustomerModels(data as Customer[]);
  ```

- **UI → Database**: Always convert models to entities before saving
  ```typescript
  const customerEntity = toCustomerEntity(customerModel);
  await supabase.from('customers').insert(customerEntity);
  ```

### 4. Type Guard Functions
- Consider implementing type guards to validate data at runtime
  ```typescript
  function isCustomer(obj: any): obj is Customer {
    return obj && 
           typeof obj.id === 'string' && 
           typeof obj.merchant_id === 'string' &&
           typeof obj.first_name === 'string' &&
           typeof obj.last_name === 'string';
  }
  ```

### 5. Empty String vs. Undefined
- Be consistent in how you handle empty values
- Consider converting empty strings to undefined for optional database fields
- Consider converting null/undefined to empty strings for UI model fields

## Action Steps for Type Issues

1. **Check Entity Type Definition**: Verify snake_case type in `src/types/index.ts`
2. **Check Model Type Definition**: Verify camelCase type in `src/types/models.ts`
3. **Review Converter Functions**: Ensure they handle optional properties correctly
4. **Search for Direct Usage**: Find places where entities are used directly in UI or vice versa
5. **Add Type Assertions**: Use type assertions (`as Type`) only when necessary
6. **Update Documentation**: Document any special cases or conventions

Remember: The goal is to maintain a clear separation between database representation (entities) and UI representation (models).
