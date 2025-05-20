
# TypeScript Error Resolution Guide

This document outlines a structured approach to fixing TypeScript errors in our codebase, particularly focusing on component props and type definitions.

## Systematic Error Resolution Process

### 1. Understand the Error Message

First, analyze the error message carefully:
```
error TS2769: No overload matches this call.
Property 'onReset' does not exist on type 'IntrinsicAttributes & IntrinsicClassAttributes<ErrorBoundary> & Readonly<Props>'.
```

This tells us:
- The specific error code (TS2769)
- The type of error (no matching overload)
- The specific property causing the issue ('onReset')
- The component where the error occurs (ErrorBoundary)

### 2. Examine Component Type Definitions

Check the props interface of the component in question:

```typescript
// Example from our ErrorBoundary component
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
```

Verify that all props being passed align with this interface.

### 3. Fix the Mismatch

Options to resolve the issue:
- Remove undefined props (like `onReset`) that aren't in the interface
- Add the missing prop to the interface if needed
- Use a type assertion only as a last resort

### 4. Verify Component Usage Throughout the Codebase

After fixing one instance, check for similar issues elsewhere in the codebase.

## Common TypeScript Error Patterns

### Props Type Mismatches

```typescript
// WRONG
<ErrorBoundary onReset={reset}>...</ErrorBoundary>

// CORRECT - if onReset is not defined in Props interface
<ErrorBoundary>...</ErrorBoundary>

// CORRECT - after adding to Props interface
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}
```

### Missing Required Props

```typescript
// WRONG - merchantId is required but missing
<AccountingOverview />

// CORRECT
<AccountingOverview merchantId="demo-merchant-id" />
```

### Import Errors

```typescript
// WRONG - Scanner doesn't exist in lucide-react
import { Scanner } from "lucide-react";

// CORRECT - Use the correct component name
import { ScanLine } from "lucide-react";
```

## Best Practices

1. **Check Type Definitions First**: Always examine the component's Props interface before usage
2. **Console Log Types**: Use `console.log(typeof component)` to debug type issues
3. **Respect Required vs Optional**: Pay attention to the `?` optional marker in interfaces
4. **Centralize Type Definitions**: Keep related types in a central location
5. **Use Descriptive Interface Names**: Name interfaces clearly (e.g., `ButtonProps` not just `Props`)

By following this systematic approach, we can efficiently resolve TypeScript errors and maintain type safety throughout the codebase.
