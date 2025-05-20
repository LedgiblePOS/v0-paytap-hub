
# Preventing Function Argument Errors

## Common Error Patterns

In our codebase, we've encountered several function argument errors that fall into these categories:

1. **Incorrect Argument Count**
   - Error: `Expected X arguments, but got Y`
   - Cause: Function signatures change in service files without updating all call sites

2. **Type Mismatch**
   - Error: `Type X is not assignable to parameter of type Y`
   - Cause: Passing incomplete objects or incorrect types to functions

3. **Missing Required Properties**
   - Error: `Property X is missing in type Y`
   - Cause: Not providing all required fields when creating new objects

## Real-World Examples

In financial/accounting applications like ours, these errors are critical to prevent:

1. **In QuickBooks**: Missing transaction dates or amounts can cause reconciliation issues
2. **In Banking Systems**: Incorrect account IDs can lead to misrouted payments
3. **In Point-of-Sale**: Incomplete product data can break inventory tracking

## Our Solution Strategy

To prevent these errors in our application, we will:

### 1. Function Signature Documentation

* Document all function signatures in comments or dedicated documentation files:
  ```typescript
  /**
   * Creates a new expense
   * @param expense - Complete ExpenseModel object with all required fields
   * @returns The created expense with ID and timestamps
   */
  export const createExpense = (expense: ExpenseModel): Promise<ExpenseModel>
  ```

### 2. Type Safety Patterns

* Use TypeScript's utility types for partial objects:
  ```typescript
  // When creating new items:
  type NewExpense = Omit<ExpenseModel, "id" | "createdAt" | "updatedAt">;
  
  // When updating:
  type ExpenseUpdate = Partial<ExpenseModel>;
  ```

* Create complete objects before passing to functions:
  ```typescript
  // Add placeholder values for required fields
  const fullExpense = {
    ...partialExpense,
    id: "", // Will be generated
    createdAt: "", // Will be filled 
    updatedAt: "" // Will be filled
  };
  
  return createExpense(fullExpense);
  ```

### 3. Consistent Parameter Order

* Keep parameter ordering consistent across similar functions
* Place required parameters first, optional parameters later
* Use object parameters for functions with many options

### 4. API Boundary Checks

* Validate input at API boundaries
* Add proper error handling for missing/invalid arguments
* Use runtime type checks for critical operations

## Best Practices Going Forward

1. **Never Change Function Signatures Without Updating All Call Sites**
   - Search the codebase for all function calls when changing signatures
   - Consider using staged deprecation for major signature changes

2. **Use Consistent Parameter Patterns Across Similar Functions**
   - All "get" functions should have the same basic parameter order
   - All "create" functions should expect complete or specifically typed objects

3. **Add Unit Tests That Verify Function Argument Handling**
   - Test with missing arguments
   - Test with invalid types
   - Test edge cases like null/undefined values

4. **Use TypeScript's strictNullChecks and strictFunctionTypes**
   - These compiler flags catch many function argument errors
   - Add non-null assertions only when absolutely certain

By implementing these practices, we can significantly reduce function argument errors in our application.

