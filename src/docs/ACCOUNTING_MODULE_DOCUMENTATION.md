
# Accounting Module Documentation

## Structure and Best Practices

The accounting module follows the "Types and Converters First" principle outlined in our TypeScript error prevention documentation. This approach helps prevent common type errors by:

1. **Defining clear types first**: All entity/model types are defined before implementation
2. **Creating conversion utilities**: Converters between database entities and UI models are implemented early
3. **Maintaining separation of concerns**: Code is organized by domain (expenses, incomes, reporting)

## Module Organization

The accounting functionality is split into these key areas:

### 1. Types (`/src/types/accounting.d.ts`)
- Defines all accounting-related types (ExpenseModel, IncomeModel, etc.)
- Follows camelCase naming for UI model properties

### 2. Services (`/src/services/accounting/`)
- `expenseService.ts`: Handle expense-related operations
- `incomeService.ts`: Handle income-related operations
- `reportingService.ts`: Handle financial reporting and tax calculations
- `index.ts`: Re-exports all services for backward compatibility

### 3. Hooks (`/src/pages/Accounting/hooks/`)
- `useExpenses.ts`: Custom hook for expense management
- `useIncomes.ts`: Custom hook for income management
- `useFinancialReporting.ts`: Custom hook for financial summaries and tax reports
- `useAccounting.ts`: Master hook that combines the functionality of all other hooks

## Best Practices Implementation

To prevent TypeScript errors, we've implemented:

1. **Clear type definitions**: Each model has a corresponding TypeScript interface
2. **Focused hooks**: Each domain has its own hook to reduce complexity
3. **Consistent property naming**: camelCase for UI models
4. **Centralized type conversion**: At data boundaries (API/database)
5. **Error handling**: Proper error propagation and display

## Future Enhancement Plans

### Inventory Reordering Integration with Accounting

A proposed feature is to automatically create expense records when inventory is reordered. This would:

1. Allow merchants to reorder stock from suppliers
2. Record the expense in the accounting system
3. Update inventory levels when stock is received

Implementation will follow these principles:
- Keep the inventory and accounting systems loosely coupled
- Use transactions to ensure data consistency
- Maintain type safety with proper entity/model conversions

## Troubleshooting Common Issues

If you encounter TypeScript errors:

1. Check for missing or incorrect imports
2. Verify that you're using the correct property names (camelCase in UI, snake_case for database)
3. Ensure all model converters are properly imported and used
4. Check component props for type mismatches
