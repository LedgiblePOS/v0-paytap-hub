
# User Model Conversion Pattern

This document explains the pattern we use for converting between database user data (snake_case) and frontend user models (camelCase).

## The Problem

Our application deals with two different representations of user data:

1. **UserData** (snake_case): Used in the database and API responses
   ```typescript
   {
     id: string;
     email: string;
     first_name: string;
     last_name: string;
     role: string;
     is_active: boolean;
     merchant_id?: string;
     created_at: string;
     updated_at: string;
   }
   ```

2. **UserModel** (camelCase): Used in the frontend components
   ```typescript
   {
     id: string;
     email: string;
     firstName: string;
     lastName: string;
     role: UserRole;
     isActive: boolean;
     merchantId?: string;
     createdAt: string;
     updatedAt: string;
   }
   ```

This dual representation causes errors when components expect one format but receive the other.

## The Solution: Consistent Conversion

We use consistent conversion functions to transform data between the two formats:

### 1. Conversion Functions

```typescript
// Convert from database format to frontend format
const userModel = toUserModel(userData);

// Convert from frontend format to database format
const userData = toUserData(userModel);
```

### 2. Type Guards

We provide type guards to safely check the format:

```typescript
if (isUserModel(user)) {
  // Use user.firstName
} else if (isUserData(user)) {
  // Use user.first_name
}
```

### 3. Conversion Points

We convert data at specific points in the application:

- **API Boundary**: Convert from snake_case to camelCase when receiving data
- **Before Storage**: Convert to snake_case when sending to the API
- **Component Interface**: Components always expect UserModel

## Best Practices

1. **Never Mix Formats**: Components should work with either UserModel or UserData, never both
2. **Convert Early**: Convert data as soon as you receive it from an API
3. **Type Safety**: Use TypeScript to ensure type safety throughout the application
4. **Consistent Access**: Always use the converted model in components

## Examples

### Converting in a Component

```typescript
const { user } = useAuth();
const userModel = toUserModel(user); // Ensure we have a UserModel

// Now use userModel.firstName instead of user.first_name
```

### Safe Access with Optional Chaining

```typescript
// Safe access regardless of conversion
const displayName = user ? 
  ('firstName' in user ? user.firstName : user.first_name) 
  : 'Guest';
```

By following these patterns consistently, we avoid type errors and make our code more maintainable.
