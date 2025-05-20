# TypeScript Error Prevention Guide

This document provides guidelines to prevent common TypeScript errors in our codebase, with a focus on those that can cause blank/white pages.

## Common TypeScript Errors

### 1. Property Does Not Exist Errors

```
error TS2339: Property 'X' does not exist on type 'Y'
```

This error occurs when trying to access properties that don't exist on an object according to its type definition.

#### Prevention:

- Always define complete interfaces for all objects
- Use optional chaining (`?.`) for potentially undefined properties
- Add proper type guards before accessing properties
- Ensure object destructuring has defaults for missing properties

#### Example Fix:

```typescript
// Before (error-prone)
const { hasInventorySpecificContent } = uiState;

// After (safe)
const { hasInventorySpecificContent = false } = uiState || {};
// OR
const hasInventorySpecificContent = uiState?.hasInventorySpecificContent ?? false;
```

### 2. Function Argument Count Mismatch

```
error TS2554: Expected X arguments, but got Y
```

This error occurs when calling functions with the wrong number of arguments.

#### Prevention:

- Check function signatures before calling
- Use optional parameters when appropriate
- Provide default values for optional parameters
- Use named parameters for complex function calls

#### Example Fix:

```typescript
// Before (error-prone)
validateRouteContent(location.pathname);

// After (safe)
// Make the parameter optional in the function definition
function validateRouteContent(path?: string) { ... }

// Then call it either way
validateRouteContent(); // Works
validateRouteContent(location.pathname); // Also works
```

### 3. Type Assignment Errors

```
error TS2322: Type 'X' is not assignable to type 'Y'
```

This error occurs when trying to assign a value to a variable or prop that doesn't match the expected type.

#### Prevention:

- Define proper interfaces for components props
- Use union types for variables that can have multiple types
- Implement proper type conversions when necessary
- Document which props are required vs optional

#### Example Fix:

```typescript
// Before (error-prone)
<PageContainer renderState={renderState} ... />

// After (safe - solution 1: update interface)
interface PageContainerProps {
  renderState?: string;
  // other props
}

// After (safe - solution 2: remove the prop)
<PageContainer ... /> // Don't pass the extra prop
```

### 4. File Path Casing Issues

```
error TS1261: Already included file name differs from file name only in casing
```

This error occurs in case-sensitive file systems when import paths don't match the actual file path casing.

#### Prevention:

- Maintain consistent casing conventions:
  - Use PascalCase for component files (e.g., `ErrorBoundary.tsx`)
  - Use camelCase for utility files (e.g., `routeValidator.ts`)
  - Use kebab-case for directories (e.g., `error-handling/`)
- Update all import statements when renaming files
- Use path aliases configured in tsconfig.json

#### Example Fix:

```typescript
// Before (error-prone on case-sensitive systems)
import { Component } from '@/components/merchant/Component';

// After (safe)
import { Component } from '@/components/Merchant/Component';
```

## Best Practices for TypeScript

### 1. Define Clear Interfaces

Always define interfaces for:
- Component props
- State objects
- API responses
- Function parameters and return types

```typescript
interface ContentCheckResult {
  hasVisibleContent: boolean;
  attempt: number;
  mainHeight?: number;
  hasInventorySpecificContent?: boolean;
  pageState: string;
  pageType: string;
}
```

### 2. Use Type Guards

Implement type guards before accessing properties:

```typescript
// Basic type guard
if (typeof response === 'object' && response !== null && 'data' in response) {
  return response.data;
}

// Custom type guard function
function isInventoryItem(item: any): item is InventoryItem {
  return item 
    && typeof item === 'object'
    && 'id' in item
    && 'name' in item
    && 'quantity' in item;
}
```

### 3. Provide Reasonable Defaults

Always provide defaults for potentially missing properties:

```typescript
const { 
  mainHeight = 0,
  childCount = 0,
  hasVisibleContent = false
} = uiState || {};
```

### 4. Document Non-Obvious Types

Add JSDoc comments for complex types:

```typescript
/**
 * Result of UI inspection for debugging content rendering issues
 * @property {boolean} hasVisibleContent - Whether the main content area has visible content
 * @property {number} attempt - The current detection attempt number
 * @property {string} pageState - Current state of page rendering
 */
interface UIInspectionResult {
  // properties
}
```

### 5. Use TypeScript's Utility Types

Leverage built-in utility types for common patterns:

```typescript
// Make all properties optional
type PartialProps = Partial<ComponentProps>;

// Make all properties required
type RequiredProps = Required<ComponentProps>;

// Pick specific properties
type PickedProps = Pick<ComponentProps, 'title' | 'isLoading'>;

// Omit specific properties
type OmittedProps = Omit<ComponentProps, 'renderState'>;
```

## Handling React Component Props

### 1. Define Props Interface Separately

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', children, onClick }) => {
  // Component implementation
};
```

### 2. Document Required vs Optional Props

Mark required props explicitly in comments or by omitting the `?` modifier:

```typescript
interface FormProps {
  // Required props
  onSubmit: (data: FormData) => void;
  initialValues: FormData;
  
  // Optional props
  isLoading?: boolean;
  error?: Error | null;
}
```

### 3. Use Discriminated Unions for State-Based Components

```typescript
interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: ResponseData;
}

interface ErrorState {
  status: 'error';
  error: Error;
}

type ComponentState = LoadingState | SuccessState | ErrorState;

// Usage
const renderContent = (state: ComponentState) => {
  switch (state.status) {
    case 'loading':
      return <Spinner />;
    case 'success':
      return <DataDisplay data={state.data} />;
    case 'error':
      return <ErrorMessage error={state.error} />;
  }
};
```

## Preventing Type Errors in Builds

1. **Run TypeScript Checks Regularly**
   ```bash
   tsc --noEmit
   ```

2. **Set up ESLint with TypeScript Rules**
   - Use the `@typescript-eslint/recommended` rule set
   - Add specific rules for your project needs

3. **Add Pre-Commit Hooks**
   - Use Husky to run TypeScript checks before commits
   - Prevent pushing code with type errors

4. **Document Common Patterns**
   - Maintain this document with examples of fixed errors
   - Share solutions to recurring issues

By following these guidelines, we can prevent common TypeScript errors that lead to blank screens and runtime issues.
