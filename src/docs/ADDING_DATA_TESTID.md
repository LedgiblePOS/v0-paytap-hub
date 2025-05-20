
# Adding data-testid Attributes for Better Content Detection

This guide explains how to properly add data-testid attributes to components for improved content detection and white page prevention.

## Why data-testid Attributes Are Important

1. **Content detection**: Helps our validation system verify that pages are rendering properly
2. **White page prevention**: Ensures our system can detect when content is actually visible
3. **Debugging**: Makes it easier to identify which components are rendering
4. **Testing**: Facilitates automated testing in the future

## Required data-testid Attributes

Add the following data-testid attributes to your components:

### Page-Level Containers

Each page should have a main container with a data-testid attribute:

```tsx
<div className="space-y-6" data-testid="dashboard-content">
  {/* Page content */}
</div>
```

### Module-Specific Elements

For specific modules, add relevant data-testid attributes:

```tsx
<div className="inventory-stats" data-testid="inventory-stats-container">
  {/* Stats content */}
</div>
```

## Example: Adding to Dashboard Component

Here's how to add proper data-testid attributes to the Dashboard component:

```tsx
// Before
return (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* ... */}
    </div>
    {/* ... */}
  </div>
);

// After
return (
  <div className="space-y-6" data-testid="dashboard-content">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* ... */}
    </div>
    <div className="dashboard-stats">
      {/* ... */}
    </div>
    <div className="dashboard-charts">
      {/* ... */}
    </div>
  </div>
);
```

## Important data-testid Patterns by Route

Route validation looks for these specific data-testid patterns:

- **Dashboard**: `data-testid="dashboard-content"` or `.dashboard-stats`, `.dashboard-charts`
- **Inventory**: `data-testid="inventory-module"` or `.inventory-table`, `.inventory-content`
- **Customers**: `data-testid="customers-module"` or `.customers-content`
- **Settings**: `data-testid="settings-module"` or `.settings-content`

Add at least one of these patterns to your page component to ensure it passes validation.

## Testing Your data-testid Attributes

After adding data-testid attributes, you can test if they're working by checking the console for route validation logs:

```
[RouteDebug] /dashboard: {
  validation: { isValid: true, ... },
  uiState: { hasContent: true, ... }
}
```

If the validation shows `isValid: true`, your data-testid attributes are working correctly.
