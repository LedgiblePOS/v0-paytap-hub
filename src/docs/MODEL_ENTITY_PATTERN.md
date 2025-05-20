# Entity-Model Pattern: Best Practices

## Overview

Our application follows a strict pattern for data handling between the database layer and the UI layer:

- **Database Entities**: Use snake_case property naming (e.g., `first_name`, `user_id`)
- **UI Models**: Use camelCase property naming (e.g., `firstName`, `userId`)

This document explains how to properly implement this pattern and avoid common errors.

## Core Principles

1. **Clear Separation of Layers**:
   - Database operations only use entity types
   - UI components only use model types
   - Conversion happens at system boundaries

2. **Consistent Naming Convention**:
   - Entities: `UserData`, `MerchantEntity`, `TransactionEntity`
   - Models: `User`, `MerchantModel`, `TransactionModel`
   - Conversion functions: `toUserModel()`, `toMerchantEntity()`

3. **Type Safety**:
   - Explicit type annotations
   - No use of `any` type
   - Proper generics for functions

## Conversion Pattern

### 1. Entity to Model Conversion

When fetching data from the database, convert it to a model immediately:

```typescript
// Fetch data
const { data: userData } = await supabase.from('profiles').select('*').single();

// Convert to model
const user = toUserModel(userData);

// Now use in UI
return <UserProfile user={user} />;
```

### 2. Model to Entity Conversion

When saving data to the database, convert it to an entity:

```typescript
// Get model data from form
const updatedUser: Partial<User> = {
  firstName: "John",
  lastName: "Doe"
};

// Convert to entity
const entityToUpdate = toPartialUserEntity(updatedUser);

// Save to database
await supabase.from('profiles').update(entityToUpdate).eq('id', user.id);
```

## Common Errors and Solutions

### 1. Property Access Errors

```
Error: Property 'firstName' does not exist on type 'UserData'
```

**Solution**: Always convert before accessing properties:

```typescript
// Wrong
const name = userData.firstName;

// Correct
const user = toUserModel(userData);
const name = user.firstName;
```

### 2. Function Parameter Type Mismatches

```
Error: Argument of type 'User' is not assignable to parameter of type 'UserData'
```

**Solution**: Convert before passing:

```typescript
// Wrong
saveToDatabase(userModel);

// Correct
saveToDatabase(toUserEntity(userModel));
```

### 3. Array Conversion Issues

```
Error: Type '{ name: string; created_at: string; }[]' is not assignable to type 'ProductModel[]'
```

**Solution**: Use batch conversion functions:

```typescript
// Wrong
const products: ProductModel[] = dbProducts;

// Correct
const products = toProductModels(dbProducts);
```

## Best Practices

1. **Create Conversion Functions for Every Type**:
   - Implement both directions (entity → model and model → entity)
   - Create batch conversion for arrays
   - Include partial conversion for updates

2. **Use Type Guards When Necessary**:
   - Check for correct property formats
   - Add runtime validation when needed

3. **Centralize Conversion Logic**:
   - Keep conversions in dedicated files by domain
   - Use consistent naming patterns

4. **Add Proper Error Handling**:
   - Handle null/undefined inputs
   - Provide fallback values for missing fields
   - Log conversion errors

## Implementation Examples

### User Data Conversion

```typescript
// Entity type (database)
interface UserData {
  id: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  // ...other fields
}

// Model type (UI)
interface User {
  id: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  // ...other fields
}

// Conversion function
function toUserModel(userData: UserData | null): User | null {
  if (!userData) return null;
  
  return {
    id: userData.id,
    firstName: userData.first_name || '',
    lastName: userData.last_name || '',
    isActive: userData.is_active !== false,
    // ...other fields
  };
}
```

### Merchant Data Conversion

```typescript
// Entity type (database)
interface MerchantEntity {
  id: string;
  business_name: string;
  user_id: string;
  // ...other fields
}

// Model type (UI)
interface MerchantModel {
  id: string;
  businessName: string;
  userId: string;
  // ...other fields
}

// Conversion function
function toMerchantModel(entity: MerchantEntity | null): MerchantModel | null {
  if (!entity) return null;
  
  return {
    id: entity.id,
    businessName: entity.business_name || '',
    userId: entity.user_id,
    // ...other fields
  };
}
```

By following these patterns, we can maintain a clear separation between database and UI concerns, making our codebase more maintainable and type-safe.
