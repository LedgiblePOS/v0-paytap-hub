
# Dashboard Content Migration Guide

This document outlines the steps needed to update the Dashboard component to work with our content validation system.

## Current Issues

Based on console logs, we're seeing a validation error for the Dashboard component:

```
[RouteValidator] Dashboard validation: {
  "isValid": false,
  "pageName": "Dashboard",
  "details": "Missing content for Dashboard. Expected any of: [data-testid=\"dashboard-content\"], .dashboard-stats, .dashboard-charts, .merchant-overview",
  "possibleIssues": [],
  "renderTime": 4300
}
```

## Required Changes

To ensure proper content detection and validation, the Dashboard component should be updated to include the expected data-testid attributes and class names.

### Recommended Updates:

1. Add the `data-testid="dashboard-content"` attribute to the main container
2. Ensure dashboard stats have the class `.dashboard-stats`
3. Add `.dashboard-charts` class to chart containers
4. Use `.merchant-overview` for the overview section

## Example Implementation

```tsx
// Example Dashboard component update
const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardData();
  
  return (
    <PageContainer title="Dashboard" isLoading={isLoading} error={error}>
      <div data-testid="dashboard-content">
        <DashboardStats className="dashboard-stats" />
        <WeeklySalesChart className="dashboard-charts" />
        <MerchantOverview className="merchant-overview" />
      </div>
    </PageContainer>
  );
};
```

## Implementation Checklist

When updating the Dashboard component:

- [ ] Add required data-testid attribute
- [ ] Apply the proper class names
- [ ] Ensure the component uses PageContainer
- [ ] Verify loading and error states
- [ ] Test the content validation after changes

## Validation Testing

After making changes, check the console logs to confirm that the Dashboard validation now shows:

```
[RouteValidator] Dashboard validation: {
  "isValid": true,
  "pageName": "Dashboard",
  "details": "Found content for Dashboard: [data-testid=\"dashboard-content\"]",
  "possibleIssues": [],
  "renderTime": xxx
}
```

This will indicate that our Dashboard component is properly integrating with the content validation system.
