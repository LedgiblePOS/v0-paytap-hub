
# Entity/Model Type Best Practices

This document outlines best practices for working with entity and model type definitions in our application to prevent common TypeScript errors.

## Entity vs Model Pattern

Our application follows a clear separation between database entities and UI models:

- **Database Entities**: Use snake_case property names (e.g., `user_id`, `first_name`)
- **UI Models**: Use camelCase property names (e.g., `userId`, `firstName`)

### Key Guidelines

1. **Complete Interface Definitions**: 
   - Ensure every property from database responses is included in entity interfaces
   - Include all needed fields in model interfaces for UI consumption
   - Use optional properties (`?`) for fields that might not always be present

2. **Type Conversion Boundaries**:
   - Always convert entities to models immediately after fetching from API/database
   - Convert models back to entities before sending to API/database
   - Use converter utilities consistently in boundary layers

3. **Avoid Enum Duplication**:
   - Define enums in a single place (`src/types/enums.ts`) 
   - Import enums from this central location
   - Never redeclare enums in multiple files

4. **Smart Entity Construction**:
   - When receiving data from API/database, map it to a complete entity object
   - Provide defaults for missing properties to prevent runtime errors
   - Handle nullish values with nullish coalescing operator (`??`)

## Common Error Prevention

### 1. Prevent "Property does not exist" errors:
```typescript
// WRONG
const merchantEntity = data; // Might be missing fields
merchantEntity.business_email.toLowerCase(); // Error if null/undefined!

// RIGHT
const merchantEntity: MerchantEntity = {
  ...data,
  business_email: data.business_email || '',
  // Always provide defaults for possibly missing fields
};
```

### 2. Prevent Export Conflicts:
```typescript
// WRONG
// In user.ts
export enum UserRole { /* ... */ }

// In enums.ts
export enum UserRole { /* ... */ }

// In index.ts
export * from './user';
export * from './enums';
// Conflict: UserRole exported from both files!

// RIGHT
// Only define UserRole in enums.ts
// In user.ts
import { UserRole } from './enums';
```

### 3. Import Type Declarations:
```typescript
// WRONG
import { UserRole } from './user'; // If UserRole moved to enums.ts

// RIGHT
import { UserRole } from './enums';
// OR for more maintainability:
import { UserRole } from '@/types'; // Import from barrel file
```

## Working with Conversion Functions

Always use the provided conversion utilities:

```typescript
// Entity to Model
const merchantModel = toMerchantModel(merchantEntity);

// Model to Entity
const merchantEntity = toMerchantEntity(merchantModel);
```

These functions handle all property mapping and ensure type safety between database and UI representations.

## Typescript Type Guards

When needed, use type guards to safely handle potentially undefined data:

```typescript
function isMerchantEntity(obj: any): obj is MerchantEntity {
  return obj && typeof obj === 'object' && 'business_name' in obj;
}

// Usage
if (isMerchantEntity(data)) {
  // TypeScript now knows data is MerchantEntity
  console.log(data.business_name);
}
```

By following these practices consistently, we can prevent most type-related errors in our application.
