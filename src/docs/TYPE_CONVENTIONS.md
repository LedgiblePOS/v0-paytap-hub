
# Type System Conventions

## Overview

Our application follows a clear separation between database entities and UI models to handle the mismatch between database conventions (snake_case) and UI conventions (camelCase).

## Core Types

### 1. Entity Types (Database Layer)

- Use snake_case property naming (e.g., `first_name`, `created_at`)
- Represent database tables directly
- Used for Supabase queries and database operations
- Examples: `UserData`, `MerchantEntity`, `MerchantCustomizationEntity`

### 2. Model Types (UI Layer)

- Use camelCase property naming (e.g., `firstName`, `createdAt`)
- Optimized for React components
- Used in all UI components and state
- Examples: `User`, `MerchantModel`, `MerchantCustomizationModel`

## Type Definitions

All type definitions are centralized in the `src/types/` directory:

- `user.ts`: User-related types and UserRole enum
- `merchant.ts`: Merchant-related types
- `enums.ts`: Central location for all enums, re-exported from their original files
- `auth.ts`: Authentication-related types that reference User types

## Conversion Utilities

We maintain dedicated conversion functions in `src/utils/modelConversions/`:

- `userConverter.ts`: Convert between `UserData` and `User`
- `merchantConverter.ts`: Convert between `MerchantEntity` and `MerchantModel`
- `merchantCustomizationConverter.ts`: Convert between customization entities and models

Each converter file provides:

1. Entity to model conversion: `toUserModel`, `toMerchantModel`, etc.
2. Model to entity conversion: `toUserData`, `toMerchantEntity`, etc.
3. Batch array conversion: `toUserModels`, `toMerchantModels`, etc.
4. Type guards: `isUserData`, `isMerchantModel`, etc.

## Using the Type System

### When Working with Database/API

```typescript
// Fetch data from the database (returns UserData)
const { data: userData } = await supabase.from('profiles').select('*');

// Convert to model before using in UI
const users = toUserModels(userData);

// Now use the models in your components
return <UserList users={users} />;
```

### When Saving Data

```typescript
// Get model from component state
const userModel: User = { /* ... */ };

// Convert to entity before saving to database
const userData = toUserData(userModel);
await supabase.from('profiles').update(userData);
```

### Automatic Type Detection

The `typeConversion.ts` utility provides helpers to automatically detect and convert types:

```typescript
// Will automatically determine if source is entity or model
// and convert it to the other format
const converted = convertType(source);

// For ensuring consistent types in components
const user = ensureModel<User>(someDataFromAPI);
```

## Best Practices

1. **Convert at Boundaries**: Convert types at the boundary between database and UI layers
2. **Use Type Guards**: When unsure about a type, use type guards
3. **Consistent Naming**: Use the established naming convention for new types
4. **Single Source of Truth**: Always import types from their definitive source
5. **Avoid String Literal Enums**: Use proper enum types instead of string literals

By following these conventions, we maintain type safety throughout the application while handling the mismatch between database and UI conventions.
