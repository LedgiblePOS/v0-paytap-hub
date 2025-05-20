
# Sidebar Navigation and Data Loading Issues

This document tracks common navigation and data loading issues encountered in the application and their solutions.

## Issue 1: TypeScript Error in useMerchantsList.ts

**Error:** Property 'id' does not exist on type SelectQueryError

**Root Cause:** Trying to access 'email' field from profiles table which might not exist or trying to access properties from error object.

**Solution:** 
- Changed the query strategy to separate merchant and profile queries
- Added proper error checking and handling for both queries
- Used a placeholder email format instead of trying to access potentially missing email field

## Issue 2: Failed to Load Merchants Error

**Error:** "Failed to load merchants. Please try again later" toast appears.

**Root Cause:** Join issues between merchants and profiles table causing query errors.

**Solution:**
- Separated the queries instead of using a join
- Implemented a two-step process: first fetch merchants, then fetch related profiles
- Added a fallback display of merchant data even if profile fetch fails
- Used proper error handling and display meaningful error messages

## Issue 3: Sidebar Navigation Routes Back to Dashboard

**Error:** Clicking on sidebar menu items routes back to the dashboard.

**Root Cause:** Incorrect path handling in SidebarNav component.

**Solution:**
- Fixed path matching for active items
- Ensured Link component from react-router-dom is used correctly
- Added proper path checking logic to determine active state

## Issue 4: Missing Logout Option

**Error:** Logout functionality was missing from sidebar navigation.

**Root Cause:** No logout item in the sidebar navigation items.

**Solution:**
- Added a new "Account" section with logout item to both merchant and admin sidebars
- Implemented onClick handler capability in SidebarNav component
- Connected logout functionality from AuthContext

## Issue 5: White Page on User Management

**Error:** White page appears when navigating to User Management.

**Root Cause:** Component rendering errors, possibly related to missing data or broken props.

**Solution:**
- Ensured proper error boundaries around components
- Fixed navigation routing
- Added proper loading and error states

## Best Practices

1. **Path Matching Logic:** Always check both exact matches and path prefixes
2. **Data Fetching:** Separate related data queries to avoid join issues
3. **Error Handling:** Implement toast notifications and fallback UI
4. **Component Structure:** Ensure components can handle null or undefined data
5. **Type Safety:** Use proper TypeScript types and interfaces

By following these solutions and best practices, we can avoid similar issues in the future.
