
# Static Method Access Pattern

This document provides guidance on how to correctly access static methods and properties in TypeScript classes.

## Common Error Pattern

One of the most common TypeScript errors in our codebase involves incorrect access to static methods:

```
error TS2576: Property 'getInstance' does not exist on type 'FasstapService'. 
Did you mean to access the static member 'FasstapService.getInstance' instead?
```

This error occurs when trying to access a static method as if it were an instance method.

## Correct Static Method Access

When accessing static methods, always use the class name, not an instance:

### INCORRECT:
```typescript
import FasstapService from '../services/fasstapService';
const service = FasstapService().getInstance(); // Error!
```

### CORRECT:
```typescript
import FasstapService from '../services/fasstapService';
const service = FasstapService.getInstance(); // Correct!
```

## Singleton Access Patterns

For singleton services, we use two main patterns:

### Pattern 1: Static getInstance Method

```typescript
// Definition
class MyService {
  private static instance: MyService | null = null;
  
  static getInstance(): MyService {
    if (!MyService.instance) {
      MyService.instance = new MyService();
    }
    return MyService.instance;
  }
  
  // Instance methods
  public doSomething(): void {
    // Implementation
  }
}

// Usage
const service = MyService.getInstance();
service.doSomething();
```

### Pattern 2: Default Export of Instance

```typescript
// Definition
class MyService {
  // Implementation
}

// Create and export single instance
export default new MyService();

// Usage
import myService from './MyService';
myService.doSomething();
```

## Import Considerations

When using static methods, be mindful of the export pattern:

- For classes with **default export**, use: `import ClassName from './path'`
- For named exports, use: `import { ClassName } from './path'`

## Best Practice Recommendations

1. **Be Consistent**: Use the same pattern across similar services
2. **Document Access Pattern**: Add comments showing correct usage
3. **Use TypeScript Hints**: Pay attention to TypeScript error suggestions
4. **Check Example Usage**: Look at other code using the same service

## Testing Considerations

When mocking services with static methods:

```typescript
// Mock a service with static getInstance method
jest.mock('../services/myService', () => ({
  getInstance: jest.fn().mockReturnValue({
    doSomething: jest.fn().mockResolvedValue({ success: true })
  })
}));

// Reset before tests
beforeEach(() => {
  jest.clearAllMocks();
});
```
