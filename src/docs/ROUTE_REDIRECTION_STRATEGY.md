# Route Redirection Strategy

This document outlines our approach to handling route redirection between the merchant and super admin interfaces.

## Cross-Interface Routes

Some routes are available in both interfaces but at different paths. For example:
- Tax Reporting: `/tax` (merchant) vs `/super-admin/tax` (super admin)
- API Credentials: `/settings/api-credentials` (merchant) vs `/super-admin/settings/api-credentials` (super admin)

## Redirection Strategy

We use the following strategy to handle cross-interface routes:

1. In `AppRoutes.tsx`, we check if the current path is a common path that appears in both interfaces
2. Based on the user's role (Merchant or Super Admin), we redirect to the appropriate path
3. This ensures users always land on the correct page regardless of which URL they enter

## Implementation Details

```javascript
// Example from AppRoutes.tsx
const commonPaths = ['/tax', '/api-credentials', '/settings/api-credentials'];
const currentPathIsCommon = commonPaths.includes(location.pathname);

if (isAuthenticated && currentPathIsCommon) {
  if (isSuperAdmin) {
    if (location.pathname === '/tax') {
      return <Navigate to="/super-admin/tax" replace />;
    }
    // ...other redirections
  }
}
```

## Route Fallbacks

To prevent 404 errors:
- Each interface (Merchant and Super Admin) has its own catch-all route
- The SuperAdminRoutes component uses a `<NotFound />` component for undefined routes
- The MerchantRoutes component also handles undefined routes

## Placeholder for Developing Features

When a feature is still in development, we use the `MerchantModulePlaceholder` component to display a user-friendly message instead of showing a 404 error. This is especially useful for routes that are defined in the navigation but don't have full implementations yet.

## Testing Route Redirections

When testing the application, verify these scenarios:
1. Super Admin users can access `/super-admin/tax` directly
2. Super Admin users are redirected from `/tax` to `/super-admin/tax`
3. Merchant users can access `/tax` directly
4. Unauthorized routes show the appropriate Not Found or Unauthorized page

By following this strategy, we ensure users always land on the correct page and avoid confusion between the different interfaces.
