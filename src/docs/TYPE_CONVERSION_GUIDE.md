
# Type Conversion Guide: Dealing with Database vs UI Models

## Overview

Our application has two different data models for most entities:

1. **Database Model**: Uses snake_case field names (e.g., `first_name`, `is_active`)
2. **UI Model**: Uses camelCase field names (e.g., `firstName`, `isActive`)

This guide explains how to properly convert between these models to avoid TypeScript errors.

## Common Type Errors

Most type errors in our codebase are related to property access on the wrong format:

```typescript
// ERROR: Property 'firstName' does not exist on type 'UserData'. Did you mean 'first_name'?
user.firstName

// ERROR: Property 'first_name' does not exist on type 'User'. Did you mean 'firstName'?
user.first_name
```

## How to Fix These Errors

### 1. Use Type Conversion Functions

Always use the appropriate conversion function when you need to cross the database-to-UI boundary:

```typescript
import { UserData, mapToUser, mapToUserData } from '@/types/user';

// When receiving data from database/API, convert to UI model
const apiResponse: UserData = await api.getUser(userId);
const userForUI = mapToUser(apiResponse);

// When sending data to database/API, convert to database model
const userFromForm: User = { firstName: 'John', ... };
const dataForAPI = mapToUserData(userFromForm);
```

### 2. Be Clear About Types

Always explicitly type your variables to catch these issues early:

```typescript
// Good - explicitly typed
const user: UserData = { first_name: 'John', ... };

// Better - use conversion
const userModel: User = mapToUser(user);
```

### 3. Type Guards for Unknown Data

When you're not sure which format you're dealing with:

```typescript
function isUserData(user: any): user is UserData {
  return 'first_name' in user;
}

function processUser(user: User | UserData) {
  if (isUserData(user)) {
    // It's a UserData (snake_case)
    console.log(user.first_name);
  } else {
    // It's a User (camelCase)
    console.log(user.firstName);
  }
}
```

## Conversion Functions Reference

### User Data

```typescript
// UserData (snake_case) -> User (camelCase)
mapToUser(userData: UserData): User

// User (camelCase) -> UserData (snake_case)
mapToUserData(user: User): UserData

// Either format -> EditUserData (camelCase)
mapToEditUserData(user: User | UserData): EditUserData
```

## Component Guidelines

1. **API/Database Layer**: Always use snake_case (UserData)
2. **Component Props**: Always use camelCase (User) 
3. **Convert at boundaries**: Convert data at API boundaries or before passing to components
4. **Be consistent**: Don't mix formats within a single component

## Recommended Pattern

```typescript
// In API service
async function fetchUsers(): Promise<UserData[]> {
  const { data } = await supabase.from('users').select('*');
  return data;
}

// In component/hook
async function loadUsers() {
  const userData = await fetchUsers();
  
  // Convert at the boundary
  const users = userData.map(mapToUser);
  
  // Now use camelCase everywhere in UI code
  setUsers(users);
}
```

## Common Pitfalls

1. **Forgetting to convert**: Always check if you need to convert data when API responses cause type errors
2. **Inconsistent naming**: Stick to consistent naming (`user` for UI models, `userData` for API/DB models)
3. **Converting too late**: Don't wait until rendering to convert - do it at API boundaries

By following these guidelines, we can significantly reduce type errors in our codebase.
