
# Route Separation Strategy

This document outlines our approach to separating and managing Super Admin and Merchant routes.

## Route Organization

### Super Admin Routes
All Super Admin routes are prefixed with `/super-admin` and are managed in `SuperAdminRoutes.tsx`.
- Example: `/super-admin/users`, `/super-admin/security`, etc.
- Super Admin routes are only accessible to users with the `SUPER_ADMIN` role

### Merchant Routes
Merchant routes have no prefix and are managed in `MerchantRoutes.tsx`.
- Example: `/dashboard`, `/products`, `/inventory`, etc.
- Merchant routes are accessible to users with the `MERCHANT` role
- Super Admins can also access Merchant routes for monitoring purposes

## Route Protection

1. **Role-Based Access Control**:
   - Routes are protected based on user roles
   - Non-authenticated users are redirected to login
   - Users without proper permissions are redirected to an unauthorized page

2. **Route Redirection Logic**:
   - When Super Admins access merchant routes with Super Admin equivalents, they are redirected to the Super Admin version
   - This prevents confusion and ensures Super Admins always use their designated interfaces

3. **Visual Indication for Super Admins**:
   - When Super Admins view merchant interfaces, a prefix is added to route names for clarity
   - This helps administrators understand they're viewing a merchant perspective

## Route Conflict Resolution

To prevent route conflicts between interfaces:

1. **Path Mapping**:
   - Maintain a mapping of equivalent routes between interfaces
   - Example: `/tax-reporting` (merchant) maps to `/super-admin/tax` (super admin)

2. **Consistent Route Naming**:
   - Use consistent route naming patterns across interfaces
   - Super Admin routes always prefixed with `/super-admin`
   - Merchant routes use direct descriptive names

## Error Handling

1. **Not Found Pages**:
   - Each interface has its own catch-all route for undefined paths
   - Appropriate 404 pages are displayed based on the user's role
   
2. **Unauthorized Access**:
   - Attempts to access restricted routes redirect to `/unauthorized`
   - Clear feedback is provided about permission issues

## Route Testing Best Practices

When making changes to routes, test:

1. Access control for different user roles
2. Proper redirection behavior
3. Route parameter handling
4. Nested route functionality
5. Loading and error states
