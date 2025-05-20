
# Error Fixes Documentation

This document summarizes recent error fixes and provides guidance to prevent similar issues in the future.

## Recent Fixes

### 1. Property Name Format Mismatch (Fixed on [Current Date])

**Files affected:**
- Dashboard components 
- Inventory components
- Layout components
- Many service files

**Issues:**
- TypeScript errors related to property access on database entities vs UI models
- Error messages like:
  ```
  error TS2551: Property 'firstName' does not exist on type 'User'. Did you mean 'first_name'?
  ```
  ```
  error TS2561: Object literal may only specify known properties, but 'merchantId' does not exist in type 'Merchant'. Did you mean to write 'merchant_id'?
  ```

**Root cause:**
The codebase uses two different formats for the same data:
1. Database entities use snake_case (e.g., `first_name`, `merchant_id`)
2. UI models use camelCase (e.g., `firstName`, `merchantId`)

The errors occur when trying to use camelCase properties on snake_case entities or vice versa.

**Solutions implemented:**
1. Added explicit model conversion in components:
   ```typescript
   // Convert at the beginning of the component
   const userModel = toUserModel(user);
   // Now use camelCase properties
   userModel.firstName
   ```

2. Fixed type issues in utility functions, especially in `entityModelFixer.ts`

3. Created a new `withModelConversion` HOC utility to automatically convert entities to models for components

4. Added comprehensive documentation explaining the Entity-Model pattern and best practices

### 2. JSX Syntax Errors in Utility Files (Fixed earlier)

**Files affected:**
- `src/utils/entityModelFixer.ts`
- `src/utils/typeConversionUtils.ts`

**Issues:**
- Syntax errors related to JSX syntax in non-JSX environments
- Error messages:
  ```
  error TS1005: '>' expected.
  error TS1109: Expression expected.
  ```

**Root cause:**
The utility files were using JSX syntax (`<Component {...props} />`) but:
1. They were using `.ts` extensions instead of `.tsx`
2. They were not properly importing React

**Solutions implemented:**
1. Added proper React imports: `import React from 'react';`
2. Replaced JSX syntax with `React.createElement()` calls:
   ```typescript
   // Instead of:
   return <Component {...newProps} />;
   
   // Now using:
   return React.createElement(Component, newProps);
   ```

### 3. Entity/Model Format Mismatch Errors (Fixed earlier)

**Issues:**
- Multiple instances of property access errors:
  ```
  Property 'firstName' does not exist on type 'User'. Did you mean 'first_name'?
  ```

**Root cause:**
- Inconsistent property naming between database entities (snake_case) and UI models (camelCase)
- Components expecting camelCase while receiving snake_case properties

**Solutions implemented:**
1. Implemented proper type definitions for both formats
2. Created conversion utilities in `modelConversions.ts`
3. Added HOCs (Higher Order Components) to wrap components and auto-convert properties
4. Created utilities to ensure data is in the correct format at boundaries

## Prevention Guidelines

### 1. Entity-Model Pattern

When working with data in our application:

- **Database entities** (snake_case, like `first_name`) should be converted to **UI models** (camelCase, like `firstName`) at data boundaries
- Never mix these different formats in the same component or function
- Use the provided utilities to handle conversions automatically

### 2. Conversion Utilities

Use the following utilities to convert between formats:

- **Direct conversion functions**: `toUserModel()`, `toProductModel()`, etc.
- **Batch conversion functions**: `toUserModels()`, `toProductModels()`, etc.
- **HOCs for components**: `withUser()`, `withProduct()`, etc.
- **Auto-conversion utilities**: `createAutoConvertingProxy()`, `autoFixProps()`

Example:
```typescript
// Inside a component that receives a database entity
const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  // Convert to model at the beginning
  const userModel = toUserModel(user);
  
  // Now use camelCase properties safely
  return <h1>{userModel.firstName} {userModel.lastName}</h1>;
};
```

### 3. Higher-Order Components (HOCs)

For frequently used components, use our HOC utilities:

```typescript
// Define component expecting the model (camelCase) format
const UserProfile: React.FC<{ user: UserModel }> = ({ user }) => {
  // Use camelCase properties directly
  return <h1>{user.firstName} {user.lastName}</h1>;
};

// Export a wrapped version that accepts an entity but provides a model
export default withUser(UserProfile);
```

### 4. File Extensions

- Use `.tsx` extension for files containing JSX syntax
- Use `.ts` extension for pure TypeScript files without JSX

### 5. React in Non-JSX TypeScript Files

When working with React components in `.ts` files:
- Always import React: `import React from 'react';`
- Use `React.createElement()` instead of JSX syntax

### 6. Type Checking

- Always use explicit type annotations for function parameters and return types
- Use TypeScript's utility types like `Partial<T>`, `Omit<T>`, etc. when appropriate

## Recommended Tools and Patterns

1. **Type Converters**: Use the provided conversion utilities in `modelConversions.ts`
2. **HOCs**: Wrap components with conversion HOCs when they need to work with database entities
3. **Linting**: Configure ESLint to enforce naming conventions
4. **Type Guards**: Implement type guards to verify property existence before access
5. **Boundary Pattern**: Keep clear boundaries between data fetching and UI rendering

By following these guidelines, we can prevent similar errors in the future and maintain a more robust codebase.
