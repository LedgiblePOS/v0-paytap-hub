
# TypeScript Import and Static Method Patterns

This document outlines best practices for handling imports and accessing static methods in TypeScript, based on our recent implementations and troubleshooting experiences.

## Import Pattern Best Practices

When importing modules in TypeScript, it's crucial to match the import syntax with the export style:

### Default Exports vs Named Exports

**Default Export:**
```typescript
// In file (export)
export default class MyService { /* ... */ }

// Correct import
import MyService from './MyService';
```

**Named Export:**
```typescript
// In file (export)
export class MyService { /* ... */ }

// Correct import
import { MyService } from './MyService';
```

Using the wrong import pattern (e.g., trying to use named import for a default export) will cause TypeScript errors.

## Static Method Access Pattern

One common error pattern we've resolved involves accessing static methods on classes. 

### Common Error Pattern
```
error TS2576: Property 'getInstance' does not exist on type 'FasstapService'. 
Did you mean to access the static member 'FasstapService.getInstance' instead?
```

This occurs when trying to use a static method as if it were an instance method, or when using the wrong import style.

### Solution: Correct Static Method Access

There are two valid patterns for accessing static methods:

#### Direct Access with Class Name:
```typescript
// For a class with static methods
import { MyClass } from './MyClass';
MyClass.staticMethod(); // Correct!
```

#### Using the Correct Import Type:
If you're getting the error with a default export:
```typescript
// Correct import for default export
import MyClass from './MyClass'; // Not { MyClass }
MyClass.staticMethod(); // Now works correctly
```

## Implementation in Our Project

We've successfully applied these patterns in several areas:

1. In `credentialsManager.ts` by importing `{ FasstapService }` as a named export
2. Using proper static method access with `FasstapService.getInstance()`
3. Following consistent import patterns across service files

## Best Practices Moving Forward

1. **Check Export Type** - Examine how a module is exported before importing it
2. **Use Consistent Patterns** - Maintain consistency in how services are exported and imported
3. **Class vs Instance** - Be clear about when you're working with a class (with static methods) vs. an instance
4. **Use IDE Hints** - Pay attention to TypeScript error messages which often suggest the correct approach

By following these patterns, we can prevent common TypeScript errors related to imports and static method access, keeping our codebase robust and maintainable.
