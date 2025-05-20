
# Preventing TypeScript Errors: Best Practices

## Common Error Patterns and Solutions

### 1. Component Property Errors

When updating UI components:
- Always check if a component exists in the imported library
- Reference component documentation for valid property names
- Use TypeScript to verify component props match expected types

Example fix:
```typescript
// Error: Using non-existent Sidebar.NavItem
<Sidebar.NavItem>Item</Sidebar.NavItem>

// Fix: Use the correct SidebarNav component
import { SidebarNav } from '@/components/ui/sidebar/sidebar-nav';
<SidebarNav items={navItems} />
```

### 2. Function Argument Mismatch

When calling functions:
- Check the function signature for the correct number and types of arguments
- For service functions, ensure parameter order matches the implementation
- When modifying argument counts, update all call sites

Example fix:
```typescript
// Error: Incorrect number of arguments
createExpense(expense, merchantId); // Expected 1 argument

// Fix: Match the expected signature
createExpense(expense);
```

### 3. Type Assignment Incompatibility

When assigning values:
- Ensure the source type matches the target type exactly
- Use proper type casting or conversion when needed
- Check for missing required properties

Example fix:
```typescript
// Error: Missing required properties
const expense: ExpenseModel = { /* missing id, createdAt, updatedAt */ };

// Fix: Use Omit to create a partial type
const expense: Omit<ExpenseModel, "id" | "createdAt" | "updatedAt"> = { /* ... */ };
```

### 4. Type vs Array Confusion

When working with data that could be single items or collections:
- Verify array types match expected array types
- Don't pass a single value where an array is expected
- Check type definitions for arrays vs primitive types

Example fix:
```typescript
// Error: Type 'number' is not assignable to type 'any[]'
const items: any[] = 5;

// Fix: Ensure correct typing
const items: number = 5; // or, if array needed: const items: any[] = [5];
```

## Library-Specific Best Practices

### 1. React-Query Compatibility

When upgrading or using @tanstack/react-query:
- Always use the object format for hook configurations
- Use `meta.errorHandler` instead of `onError` for error handling
- Check imports to ensure you're using the right version methods

Example fix:
```typescript
// Error: onError is deprecated in newer versions
const query = useQuery('key', fetchFn, { onError: handleError });

// Fix: Use meta.errorHandler instead
const query = useQuery({
  queryKey: ['key'],
  queryFn: fetchFn,
  meta: { errorHandler: handleError }
});
```

## Workflow Integration

### Pre-commit TypeScript Validation

1. **Run type-checking before commits**:
   ```bash
   npm run type-check
   ```

2. **Automated CI type checking**:
   - Add type checking to CI pipeline
   - Block merges if type errors are detected

### Code Review Type Safety Checklist

During code reviews, verify:

1. ✓ Are all imported components used with the correct props?
2. ✓ Are function arguments correctly typed and ordered?
3. ✓ Are conditionals properly handling null and undefined?
4. ✓ Is any type casting properly justified?
5. ✓ Are library-specific patterns followed correctly?

### Library Documentation Reference

Keep a team reference document for:
- Current library versions and their requirements
- Breaking changes in recent upgrades
- Common patterns for each library

### Type Compatibility Regression Tests

Create tests that verify:
- Database entity to UI model conversions
- API response handling
- Form data validation
- Component prop validation

### Regular Type Safety Audits

Schedule monthly:
- TypeScript strictness settings review
- Check for deprecated properties
- Update type definitions for external libraries
- Review any uses of `any` or type assertions

By following these practices, we can minimize TypeScript errors in our codebase and improve code quality.
