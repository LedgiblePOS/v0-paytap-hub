
# TypeScript Module Import Patterns

This document outlines best practices for module imports and exports in TypeScript, focusing on preventing common errors and maintaining consistency across the codebase.

## Default vs Named Exports

### Default Exports
Default exports are designed to export a single "main" entity from a module:

```typescript
// In module file
export default class MyClass { /* ... */ }

// Importing
import MyClass from './MyClass';
```

**Best for**: React components, main classes, or primary exports from a file

### Named Exports
Named exports allow multiple entities to be exported from a single module:

```typescript
// In module file
export interface MyInterface { /* ... */ }
export function myHelper() { /* ... */ }
export class MyUtility { /* ... */ }

// Importing
import { MyInterface, myHelper, MyUtility } from './MyModule';
```

**Best for**: Utility functions, interfaces, types, constants

### Mixed Exports
You can combine default and named exports in a single file:

```typescript
// In module file
export interface UserProps { /* ... */ }
export function formatUser(user: User) { /* ... */ }
export default function User(props: UserProps) { /* ... */ }

// Importing
import User, { UserProps, formatUser } from './User';
```

**Best for**: Component files where the component is the main export, but related types and utilities are also needed

## Singleton Pattern Implementations

### Option 1: Export class, instantiate on import
```typescript
// Service file
export class MyService {
  private static instance: MyService | null = null;
  
  static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService();
    }
    return MyService.instance;
  }
}

// Usage
import { MyService } from './MyService';
const service = MyService.getInstance();
```

### Option 2: Export pre-instantiated singleton
```typescript
// Service file
class MyService {
  // implementation
}

export default new MyService();

// Usage
import myService from './MyService';
myService.doSomething();
```

## Common Issues and Solutions

### Issue: Mixing up default and named imports
```typescript
// WRONG
import { MyComponent } from './MyComponent'; // If MyComponent is a default export
import MyService from './MyService'; // If MyService uses named exports

// RIGHT
import MyComponent from './MyComponent'; // For default exports
import { MyService } from './MyService'; // For named exports
```

### Issue: Inconsistent singleton implementation
```typescript
// Define ONE pattern and stick with it
// Either always use:
import { ServiceClass } from './Service';
const instance = ServiceClass.getInstance();

// OR always use:
import serviceInstance from './Service';
serviceInstance.method();
```

## Project Conventions

To maintain consistency in our project, follow these conventions:

1. **React Components**: Always use default exports
   ```typescript
   export default function Button() { /* ... */ }
   ```

2. **Service Classes**: Use named exports with static getInstance methods
   ```typescript
   export class AuthService {
     private static instance: AuthService;
     static getInstance(): AuthService { /* ... */ }
   }
   ```

3. **Utility Functions**: Use named exports
   ```typescript
   export function formatCurrency(value: number): string { /* ... */ }
   ```

4. **Types and Interfaces**: Use named exports
   ```typescript
   export interface UserData { /* ... */ }
   export type PaymentMethod = 'card' | 'cash';
   ```

5. **Constants**: Use named exports
   ```typescript
   export const API_ENDPOINT = '/api/v1';
   ```

By following these patterns consistently, we can reduce errors related to imports and make our codebase more maintainable.
