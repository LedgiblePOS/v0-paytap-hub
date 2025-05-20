
# Authentication Type Handling Best Practices

## Overview

Our application implements a consistent pattern for handling user data between the database and UI layers:

- **Database entities**: Use snake_case (e.g., `user_id`, `first_name`)
- **UI models**: Use camelCase (e.g., `userId`, `firstName`)

This document explains the proper patterns for handling this conversion and preventing TypeScript errors.

## Core Types

### User Entity (Database)

```typescript
// Snake_case properties from database
interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  merchant_id: string | null;
}
```

### User Model (UI)

```typescript
// CamelCase properties for UI components
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole; // Enum type
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  merchantId: string | null;
}
```

## Conversion Utilities

Always use conversion functions when crossing boundaries between database and UI:

1. **Database to UI**: After fetching data
   ```typescript
   const userData = await supabase.from('profiles').select('*').single();
   const user = toUserModel(userData);
   ```

2. **UI to Database**: Before saving data
   ```typescript
   const userEntity = toUserData(userModel);
   await supabase.from('profiles').update(userEntity);
   ```

## Common Error Patterns

### 1. Mixed Property Access

**Error:**
```
Property 'firstName' does not exist on type 'UserData'. Did you mean 'first_name'?
```

**Solution:**
Convert the data before accessing properties:
```typescript
// Wrong
const name = userData.firstName;

// Correct
const user = toUserModel(userData);
const name = user.firstName;
```

### 2. Type Assignment Incompatibility

**Error:**
```
Type '{ firstName: string; }' is missing properties from type 'UserData': first_name, ...
```

**Solution:**
Use proper conversion when assigning data:
```typescript
// Wrong
const userData: UserData = { firstName: "John", lastName: "Doe" }; 

// Correct
const user: User = { firstName: "John", lastName: "Doe" };
const userData = toUserData(user);
```

### 3. Function Parameter Type Mismatches

**Error:**
```
Argument of type 'User' is not assignable to parameter of type 'UserData'
```

**Solution:**
Convert the data before passing to functions:
```typescript
// Wrong
saveUserToDatabase(userModel);

// Correct
saveUserToDatabase(toUserData(userModel));
```

## Best Practices

1. **Clear Type Annotations**: Always specify types for variables and function parameters
2. **Consistent Pattern Usage**: Use the same pattern throughout the codebase
3. **Type Guards**: Create type guards to check data format
4. **Conversion at Boundaries**: Convert only when crossing system boundaries
5. **Documented Interfaces**: Keep interfaces well-documented and in a central location

## Implementation in Authentication Flow

Our authentication system handles this pattern in these key places:

1. **AuthProvider**: Converts database user data to User model after login/registration
2. **fetchUserProfile**: Converts profile data from database format
3. **updateUser**: Converts User model properties back to database format
4. **useAuth Hook**: Returns User model format to components

By understanding and following these patterns, you can avoid the most common type-related errors in our authentication system.
