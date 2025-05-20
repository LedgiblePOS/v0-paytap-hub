# Entity/Model Pattern Guide

## Overview

Our application uses two different data formats for the same conceptual entities:

1. **Database Entities** (snake_case): Represent data as stored in the database
2. **UI Models** (camelCase): Represent data as used in the UI components

This pattern helps maintain a clear separation between database operations and UI display, but requires careful type handling to avoid errors.

## Why Two Formats?

- **Database Conventions**: Many databases and APIs use snake_case (e.g., `first_name`, `created_at`)
- **JavaScript/TypeScript Conventions**: UI code typically uses camelCase (e.g., `firstName`, `createdAt`)
- **Separation of Concerns**: Clear distinction between database representation and application logic

## How It Works

### Type Definitions

For each domain concept, we define two interfaces:

```typescript
// Database Entity (snake_case)
export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  merchant_id?: string;
}

// UI Model (camelCase)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  merchantId?: string;
}
```

### Conversion Functions

We use dedicated functions to convert between these formats:

```typescript
// Convert from database entity to UI model
export function toUserModel(userData: UserData): User {
  return {
    id: userData.id,
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userData.role as UserRole,
    isActive: userData.is_active,
    createdAt: userData.created_at,
    updatedAt: userData.updated_at,
    merchantId: userData.merchant_id
  };
}

// Convert from UI model to database entity
export function toUserData(user: User): UserData {
  return {
    id: user.id,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    role: user.role,
    is_active: user.isActive,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    merchant_id: user.merchantId
  };
}
```

## Using the Pattern Correctly

### Data Fetching

When fetching data from the database or API:

```typescript
const { data: userData } = await supabase.from('profiles').select('*').eq('id', userId).single();
const user = toUserModel(userData);

// Now use user.firstName, user.lastName, etc. in UI components
```

### Data Saving

When saving data to the database:

```typescript
const user: User = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  // ...other properties
};

const userData = toUserData(user);
await supabase.from('profiles').update(userData).eq('id', userData.id);
```

### Component Props

Be consistent about which format you use in component props:

```typescript
interface UserProfileProps {
  user: User; // Use UI model format in components
}

function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      <h2>{user.firstName} {user.lastName}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## Common Errors and Fixes

### Property Access Errors

```
Property 'firstName' does not exist on type 'UserData'
```

**Fix**: Convert to the correct format before accessing properties

```typescript
// Wrong
const name = userData.firstName; // Error!

// Right
const user = toUserModel(userData);
const name = user.firstName; // Works!
```

### Type Assignment Errors

```
Type 'User' is not assignable to parameter of type 'UserData'
```

**Fix**: Convert to the expected type

```typescript
// Wrong
updateProfile(user); // Error if updateProfile expects UserData

// Right
updateProfile(toUserData(user)); // Works!
```

## Best Practices

1. **Convert at Boundaries**: Always convert at the boundary between database and UI
2. **Be Explicit**: Use explicit type annotations to catch errors early
3. **Use Consistent Naming**: Name entity types with `Entity` or `Data` suffix
4. **Write Helper Functions**: Create shared utilities for common operations
5. **Document Type Expectations**: Document whether functions expect entities or models

By following this pattern consistently, we can maintain a clear separation between our database and UI layers while minimizing TypeScript errors.
