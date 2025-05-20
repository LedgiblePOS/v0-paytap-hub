
# Super Admin Routing Best Practices

## Overview

This document outlines best practices for handling Super Admin routing in the application to prevent issues such as:
- Flashing of merchant modules before loading admin content
- Incorrect navigation items appearing in the sidebar
- Unauthorized access attempts

## Root Cause Analysis

Initially, Super Admin users were experiencing issues where merchant modules would load first, causing UI flickering before the correct admin modules appeared. This happened due to:

1. **Timing Issues**: Initial components would render before role-based navigation was properly applied
2. **Conditional Rendering Logic**: Navigation components weren't immediately identifying admin users
3. **Route Priority**: Super admin routes weren't given immediate priority at application start

## Implementation Strategies

### 1. Early Role Detection

Identify the user role as early as possible in the routing process:

```tsx
// In MainRouter.tsx
const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

// Immediate redirection for super admins at root path
if (isSuperAdmin && location.pathname === '/') {
  return <Navigate to="/super-admin" replace />;
}
```

### 2. Proper Route Ordering

Ensure that route checking occurs in the correct priority:

1. First check authentication status
2. Then check user role
3. Then check current path
4. Apply route protections based on these values

### 3. Avoid Double Renders

Prevent unnecessary re-renders that cause flickering:

- Use memoization where appropriate
- Implement proper conditionals to avoid rendering both admin and merchant components
- Don't rely on effects for initial routing decisions when they can be made declaratively

### 4. Clear Section Boundaries

Maintain clear boundaries between admin and merchant sections:

```tsx
// Check if trying to access super admin routes without proper role
if (location.pathname.startsWith('/super-admin') && !isSuperAdmin) {
  return <Navigate to="/unauthorized" replace />;
}
```

## Common Pitfalls

1. **Redirecting in Effects**: Using `useEffect` for initial route redirection can cause flickering
2. **Mixed Navigation Models**: Combining navigation items from different roles causes confusion
3. **Missing Role Checks**: Not checking roles early enough in the component hierarchy
4. **Inefficient Path Detection**: Using complex logic rather than simple prefix checks

## Testing Super Admin Routing

When testing Super Admin routing, verify:

1. Immediate correct navigation from the root route (`/`) to `/super-admin`
2. No flashing of merchant content for super admin users
3. Proper access control for protected routes
4. Correct sidebar navigation options based on the current section
5. Proper redirection from merchant routes to equivalent super admin routes

## Current Implementation

Our current implementation follows these best practices by:

1. Providing immediate redirection in `MainRouter.tsx` based on role
2. Using a dedicated `SuperAdminRedirects` component to handle special cases
3. Implementing proper section detection in `SidebarNavigationItems`
4. Applying strict route protection checks for unauthorized access attempts
