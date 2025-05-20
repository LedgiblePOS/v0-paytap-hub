
# Proper Static Method Access Pattern

This document provides guidance on how to correctly access static methods and properties in TypeScript classes, as well as best practices for imports.

## Common Errors and Their Solutions

### Error: Property 'getInstance' does not exist on type 'FasstapService'

```
error TS2576: Property 'getInstance' does not exist on type 'FasstapService'. 
Did you mean to access the static member 'FasstapService.getInstance' instead?
```

This error occurs when trying to access a static method (`getInstance`) as if it were an instance method.

#### Incorrect usage:
```typescript
import { FasstapService } from "../fasstapService";
const service = FasstapService.getInstance(); // Error!
```

#### Correct usage:
```typescript
// For a class with static methods
import FasstapService from "../fasstapService";
const service = FasstapService.getInstance(); // Correct!
```

### Error: Module has no exported member 'X'

```
error TS2614: Module '"@/bridges/FasstapBridge"' has no exported member 'FasstapBridge'. 
Did you mean to use 'import FasstapBridge from "@/bridges/FasstapBridge"' instead?
```

This error occurs when using named import syntax (`{ FasstapBridge }`) for a default export.

#### Incorrect usage:
```typescript
import { FasstapBridge } from "@/bridges/FasstapBridge"; // Error!
```

#### Correct usage:
```typescript
import FasstapBridge from "@/bridges/FasstapBridge"; // Correct!
```

## Best Practices for Import and Static Methods

### 1. Match Import Style to Export Style

- Use `import X from 'Y'` for default exports
- Use `import { X } from 'Y'` for named exports

### 2. Be Consistent with Singleton Pattern Implementations

Choose one pattern and use it consistently:

#### Option 1: Class with static getInstance method
```typescript
// In service file
export default class MyService {
  private static instance: MyService | null = null;
  
  static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService();
    }
    return MyService.instance;
  }
}

// Usage
import MyService from './MyService';
const service = MyService.getInstance();
```

#### Option 2: Export instance directly
```typescript
// In service file
class MyService {
  // implementation
}

export default new MyService();

// Usage
import myService from './MyService';
myService.doSomething();
```

### 3. Check IDE Suggestions

When you see TypeScript errors, carefully read the suggested fix:
- "Did you mean to use 'import X from Y' instead?" - Use default import syntax
- "Did you mean to access the static member 'X.Y' instead?" - Use class name to access static methods

### 4. Document Expected Usage

Add JSDoc comments showing the correct usage pattern:

```typescript
/**
 * Singleton service for Fasstap integration
 * @example
 * // Correct usage:
 * import FasstapService from '../fasstapService';
 * const service = FasstapService.getInstance();
 */
export default class FasstapService {
  // implementation
}
```

### 5. Testing Considerations

When testing components that use services with static methods:
- Mock the service at the module level, not the class level
- Ensure your mocks follow the same pattern as the actual implementation
- Reset mocks between tests to prevent test state leakage

```typescript
// Example of properly mocking a service with static methods
jest.mock('@/services/MyService', () => ({
  getInstance: jest.fn().mockReturnValue({
    doSomething: jest.fn(),
    getData: jest.fn().mockResolvedValue({ result: 'data' })
  })
}));

// Reset before each test
beforeEach(() => {
  jest.clearAllMocks();
});
```

By following these patterns consistently, you can prevent common TypeScript errors related to imports and static method access.
