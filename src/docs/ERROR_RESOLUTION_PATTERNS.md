# Error Resolution Patterns

This document tracks common error patterns we've encountered and their solutions to help prevent similar issues in the future.

## Entity/Model Conversion Issues

### Symptom
```
Type 'User[]' is not assignable to type 'UserData[]'.
Type 'User' is missing the following properties from type 'UserData': first_name, last_name, created_at, updated_at
```

### Root Cause
Our application uses two different naming conventions:
- Database entities: Use snake_case (e.g., `first_name`, `created_at`)
- UI models: Use camelCase (e.g., `firstName`, `createdAt`)

When components expect one format but receive the other, TypeScript errors occur.

### Solution Pattern
1. Create conversion utilities between formats
2. Apply conversions at data boundaries (API/UI)
3. Design flexible components that can handle both formats when needed

### Implementation
```typescript
// Convert database entity to UI model
function toUserModel(user: User): UserModel {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    // ...other properties
  };
}

// Convert UI model to database entity
function toUserEntity(model: UserModel): User {
  return {
    id: model.id,
    first_name: model.firstName,
    last_name: model.lastName,
    // ...other properties
  };
}
```

## Supabase Query Errors

### Symptom
```
Property 'id' does not exist on type 'SelectQueryError<"column 'email' does not exist on 'profiles'.">'
```

### Root Cause
Supabase TypeScript types can't properly parse complex join queries with the dot notation or renamed fields, or the query is attempting to select columns that don't exist in the table.

### Solution Pattern
1. Simplify queries
2. Check database schema to confirm column existence
3. Use multiple queries instead of complex joins
4. For joins, use proper syntax and verify column names

### Implementation
```typescript
// WRONG: Trying to access a column that doesn't exist
const { data } = await supabase
  .from('profiles')
  .select('id, first_name, email'); // Error if 'email' doesn't exist in 'profiles'

// CORRECT: Only select columns that exist
const { data } = await supabase
  .from('profiles')
  .select('id, first_name, last_name');
  
// Then fetch related data separately or use proper joins
```

## Component Prop Type Mismatches

### Symptom
```
Type '{ onRoleChange: (role: string) => void; }' is not assignable to type 'IntrinsicAttributes & UserFiltersProps'.
```

### Root Cause
Components expect specific prop names and types, but are receiving different ones.

### Solution Pattern
1. Design flexible component interfaces
2. Use optional props with defaults
3. Create adapter functions to normalize inputs

### Implementation
```typescript
interface UserFiltersProps {
  // Support multiple patterns
  roleFilter?: string;
  onRoleChange?: (role: string) => void;
  setFilterRole?: (role: string) => void;
}

const UserFilters: React.FC<UserFiltersProps> = (props) => {
  // Handle multiple patterns
  const handleRoleChange = (value: string) => {
    if (props.onRoleChange) props.onRoleChange(value);
    else if (props.setFilterRole) props.setFilterRole(value);
  };
  
  // Component implementation
};
```

## Import and Export Errors

### Symptom
```
Module '...' has no default export.
'...' has no exported member named 'X'.
```

### Root Cause
Incorrect import statements or trying to use components/functions that don't exist.

### Solution Pattern
1. Check actual exports in the file
2. Use correct import syntax based on how the component is exported
3. Verify component names against documentation

### Implementation
```typescript
// If exported as default:
export default MyComponent;
// Import as:
import MyComponent from './path/to/MyComponent';

// If exported by name:
export const MyComponent = () => { ... };
// Import as:
import { MyComponent } from './path/to/MyComponent';
```

## Name Collision Errors

### Symptom
```
Import declaration conflicts with local declaration of 'User'.
```

### Root Cause
When you import a type or variable and then declare another variable or interface with the same name in the same scope.

### Solution Pattern
1. Rename one of the conflicting variables/types
2. Use import aliases to avoid conflicts
3. Consolidate types in a single location

### Implementation
```typescript
// Use an import alias
import { User as ImportedUser } from '@/types';

// Or rename your local interface
interface UserModel {
  // properties
}
```

## Props Missing Required Properties

### Symptom
```
Type '{ ... }' is missing the following properties from type 'UserTableProps': handleEditUser, handleResetPassword, handleDeactivateUser
```

### Root Cause
Component usage doesn't match the required props defined in the component interface.

### Solution Pattern
1. Make props optional when possible
2. Design components to accept multiple calling patterns
3. Provide sensible defaults for props
4. Use adapter functions in the component to handle different prop patterns

### Implementation
```typescript
// Make the component more flexible
interface UserTableProps {
  // Required props
  users: UserData[];
  
  // Optional props with different patterns
  handleEditUser?: (user: UserData) => void;
  onEdit?: (user: UserData) => void;
}

// Handle both patterns in the component
const editUser = (user: UserData) => {
  if (onEdit) onEdit(user);
  else if (handleEditUser) handleEditUser(user);
};
```

## Type Resolving Issues in Function Calls

### Symptom
```
Cannot find name 'User'.
```

### Root Cause
A function or component is using a type that's either not imported, has been renamed, or conflicts with a local declaration.

### Solution Pattern
1. Use explicit type imports to avoid confusion
2. Consistently rename conflicting types
3. Use interfaces defined in the same file when needed

### Implementation
```typescript
// ORIGINAL CODE WITH ERROR:
const newUser: User = { ... }; // Error if User is not defined or conflicts

// SOLUTION - Define a local interface with a different name:
interface LocalUserModel {
  id: string;
  firstName: string;
  // other properties
}

// Then use the local interface:
const newUser: LocalUserModel = { ... }; // No error
```

## Best Practices Moving Forward

1. **Consistent Type Conversions**: Always convert at data boundaries
2. **Component Responsibility**: Keep components small and focused on a single responsibility
3. **Explicit Typing**: Use explicit type annotations for function parameters and return values
4. **Smaller Files**: Break large files into smaller, focused components
5. **Documentation**: Add comments about expected data formats and component responsibilities
6. **Pattern Recognition**: When fixing errors, look for patterns and apply consistent solutions
7. **Verify Database Schema**: When working with database queries, always verify column existence
8. **Type Checking**: Run TypeScript type checking before committing code

By following these patterns and investing in continuous refactoring, we can significantly reduce the occurrence of these common error types.
