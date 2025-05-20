
# TypeScript Error Patterns in Entity-Model Architecture

This document outlines the common TypeScript error patterns we've encountered in our entity-model architecture and how to avoid them.

## Common Error Patterns

### 1. Property Access Errors on User Objects

```typescript
error TS2339: Property 'merchantId' does not exist on type 'User'.
error TS2339: Property 'merchant_id' does not exist on type 'User'.
```

**Root Cause**: Inconsistent property naming across our codebase.

**Solution Implemented**:
- We've updated the `User` interface to include both camelCase and snake_case versions of the properties:

```typescript
export interface User {
  // CamelCase properties for UI
  firstName?: string;
  lastName?: string;
  merchantId?: string;
  
  // Snake_case properties for database
  first_name?: string;
  last_name?: string;
  merchant_id?: string;
}
```

**Best Practice**: Always use `user?.merchantId || user?.merchant_id` when accessing these properties to ensure compatibility with both versions.

### 2. Type Mismatch Between Different Modules

```typescript
error TS2322: Type 'import("/dev-server/src/types/index").SubscriptionTier' is not assignable to type 'import("/dev-server/src/types/subscription").SubscriptionTier'.
```

**Root Cause**: Different definitions of the same type across multiple files.

**Solution Implemented**:
- Consolidated enum definitions in a single location
- Used proper imports rather than redefining the same types

**Best Practice**: Follow the "Single Source of Truth" principle: define each type in exactly one place.

### 3. Component Props Type Errors

```typescript
error TS2559: Type '{ children: Element; }' has no properties in common with type 'IntrinsicAttributes'.
```

**Root Cause**: Missing props interface or incorrect props passing.

**Solution Implemented**:
- Added proper wrapper elements to accept children props
- Fixed component export/import patterns

**Best Practice**: Always define explicit prop interfaces for components and make sure the component properly handles children.

### 4. String vs Enum Type Errors

```typescript
error TS2322: Type 'string' is not assignable to type 'UserRole'.
```

**Root Cause**: Using string literals where enums are expected.

**Solution Implemented**:
- Added type guards and casting when handling data from external sources
- Fixed conversion between string and enum types

**Best Practice**:
```typescript
// When getting data from API/database that should be an enum:
const userRole = typeof roleString === 'string' ? roleString as UserRole : UserRole.USER;
```

### 5. Database Relationship Errors

```typescript
error TS2339: Property 'email' does not exist on type 'SelectQueryError<"could not find the relation between audit_logs and user_id">'.
```

**Root Cause**: Attempting to access properties from a join query that didn't work.

**Solution Implemented**:
- Separated queries to fetch related data independently
- Added error handling for relationship queries

**Best Practice**: Check the existence of joined data before accessing properties:
```typescript
if (data.profiles && !('error' in data.profiles)) {
  // Now it's safe to use data.profiles.email
}
```

### 6. Missing Import/Export Errors

```typescript
error TS2305: Module '"@/utils/modelConversions"' has no exported member 'toExpenseModels'.
```

**Root Cause**: Using functions or types that aren't properly exported.

**Solution Implemented**:
- Added missing exports
- Created proper conversion utilities for all entity types

**Best Practice**: After creating a new utility function, always update the barrel exports (index.ts).

## Entity-Model Pattern Best Practices

To minimize TypeScript errors in our entity-model architecture:

1. **Consistency in Type Definitions**:
   - Use interfaces with both naming conventions (camelCase and snake_case)
   - Or create proper conversion functions between entity and model types

2. **Clear Boundary Demarcation**:
   - Database Layer: Always use snake_case (entity) types
   - UI Layer: Always use camelCase (model) types
   - Convert at boundaries between layers

3. **Handle Ambiguous Types**:
   - Use type guards when converting external data to enums
   - Provide default values for nullable/optional properties

4. **Keep Related Types Together**:
   - Group related types in domain-specific files
   - Use barrel exports (index.ts) to simplify imports

5. **Proper Error Handling for Database Relationships**:
   - Check for existence and validity of relationship data
   - Fetch related data separately if joins are problematic

By following these best practices, we can significantly reduce TypeScript errors in our codebase.
