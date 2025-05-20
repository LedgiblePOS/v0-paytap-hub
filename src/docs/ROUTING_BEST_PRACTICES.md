
# Merchant Module Routing Best Practices

This document outlines the best practices for routing in the merchant modules of our application.

## Routing Structure

We've implemented a hierarchical routing structure with these key features:

1. **Nested Routes**: All merchant routes are nested under `/dashboard/*` for organizational clarity.

2. **Direct Path Support**: For better UX, we've implemented automatic redirects from direct paths to their nested equivalents:
   - `/inventory` → `/dashboard/inventory` 
   - `/customers` → `/dashboard/customers`
   - etc.

3. **Consistent Navigation**: Sidebar navigation items use consistent paths that match our route definitions.

## Implementation Details

### Route Components

Each merchant module is wrapped with essential components:

1. **DebugRouteWrapper**: Provides debug information and console logging
2. **MerchantModulePlaceholder**: Ensures content is always visible for modules in development
3. **ErrorBoundary**: Catches and handles render errors gracefully

### Navigation Flow

1. User clicks a link in the sidebar
2. AppRoutes component intercepts the direct path (e.g., `/inventory`)
3. Redirects to the nested path (e.g., `/dashboard/inventory`) 
4. MerchantRoutes component renders the appropriate module content

## Content Detection

To prevent white pages, we've implemented:

1. **data-testid Attributes**: Every module has a unique data-testid for content detection
2. **Placeholder Content**: Modules without full implementation use MerchantModulePlaceholder
3. **Loading States**: Each module implements proper loading states with Skeleton UI
4. **BlankScreenRecovery**: Global component that detects and responds to white screens

## Best Practices for Adding New Routes

When adding a new merchant module route:

1. Add a route entry in `MerchantRoutes.tsx`
2. Add a redirect in `AppRoutes.tsx`
3. Add a navigation item in `MerchantNavItems.tsx`
4. Use DebugRouteWrapper and implement proper content detection
5. Follow the content validation pattern from existing modules
6. **IMPORTANT**: Always ensure required components are imported

## Common Issues and Solutions

### White Pages

If encountering white pages:
- Ensure the component has a `data-testid` attribute
- Verify that the component's container has proper height/content
- Check that loading states are implemented correctly
- Make sure MerchantModulePlaceholder is properly imported where used
- Check browser console for import errors
- Verify that all component dependencies are imported correctly

### Navigation Issues

If links aren't working properly:
- Confirm that path in MerchantNavItems matches the route path
- Check that the redirect in AppRoutes is correctly configured
- Verify the route is properly defined in MerchantRoutes
- Ensure all necessary component imports are present
- Check for typos in path names

By following these practices, we maintain a consistent and reliable routing system across all merchant modules.
