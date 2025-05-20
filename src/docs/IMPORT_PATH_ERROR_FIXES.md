
# Import Path and Type Error Fixes

This document outlines common import path and type errors encountered in the project and how to fix them.

## Common Import Errors and Solutions

### 1. Module Has No Exported Member Error

**Error:**
```
error TS2305: Module '@/types' has no exported member 'Permission'.
```

**Solution:**
Check the correct location of exported types and update the import path.

```typescript
// Incorrect
import { Permission } from '@/types';

// Correct
import { Permission } from '@/utils/permissions/types';
```

### 2. Missing Required Props Error

**Error:**
```
error TS2741: Property 'title' is missing in type '{ children: Element; }' but required in type 'PageContainerProps'.
```

**Solution:**
Always check component props requirements and provide all required props:

```typescript
// Incorrect
<PageContainer>
  <YourComponent />
</PageContainer>

// Correct
<PageContainer title="Your Page Title">
  <YourComponent />
</PageContainer>
```

### 3. Excessive Type Instantiation Error

**Error:**
```
error TS2589: Type instantiation is excessively deep and possibly infinite.
```

**Solution:**
This often occurs with complex type inference. Explicitly type your variables and use type assertions when necessary:

```typescript
// Problematic code with implicit typing
const data = await fetchData();
setSettings(data); // Type inference may cause deep instantiation error

// Fixed code with explicit typing
const data = await fetchData();
const settingData = data as unknown as SystemSetting; // Explicit casting
setSettings(settingData);
```

## Best Practices for Preventing Import and Type Errors

1. **Use IDE Features**: Configure your IDE to show import suggestions and type errors in real-time
2. **Explicit Type Annotations**: Always explicitly type your variables and function parameters
3. **Component Prop Validation**: Check component definitions for required props before usage
4. **Type Guards**: Use type guards for safer type assertions
5. **Avoid Deep Nesting**: Simplify complex nested types to prevent instantiation errors
6. **Use Type Aliases**: Create clear type aliases for complex types
7. **Verify Import Paths**: Double-check import paths match the actual file structure

## Automated Error Detection

Consider implementing pre-commit hooks that run TypeScript checks to catch these errors before they make it into the codebase.

```bash
# Example pre-commit script
tsc --noEmit
```

By following these practices, we can reduce the occurrence of common import and type errors in our project.
