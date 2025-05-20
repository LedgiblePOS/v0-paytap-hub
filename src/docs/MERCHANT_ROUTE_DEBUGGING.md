
# Merchant Route Debugging Guide

This document outlines the tools and strategies implemented to identify and fix "white page" issues in merchant routes.

## Enhanced Debugging Tools

We've implemented several tools to help debug navigation and white page issues:

### 1. Navigation Debugger

The `useNavigationDebugger` hook in `navigationDebugger.ts` now provides detailed logging and DOM inspection for route components, including:

- Component mount/unmount tracking
- Content validation checking
- Visible element detection
- Render time measurement

### 2. Route Content Validation

The `validateRouteContent` function in `routeContentValidator.ts` checks for expected DOM elements on each route:

- Maps routes to expected selectors
- Provides detailed validation reports
- Lists common issues per route for quicker debugging

### 3. Debug Route Wrapper

All merchant routes are now wrapped with `DebugRouteWrapper`, which:

- Automatically applies navigation debugging
- Validates route content after rendering
- Shows toast notifications for rendering issues
- Logs detailed diagnostics to the console

## Debugging Workflow for White Page Issues

When a white page occurs in a merchant route, follow these steps:

1. **Check console logs** for navigation debugger warnings:
   - Look for "[NavigationDebugger]" logs showing content checks
   - Note any "Possible white page detected" warnings

2. **Examine route validation results**:
   - The validation will report if expected content selectors were found
   - Review "possibleIssues" for common problems with that route

3. **Inspect UI details**:
   - The `inspectRouteUI` function provides details about the DOM state
   - Check visible element counts and content height

4. **Look for toast notifications**:
   - The enhanced navigation will show toasts for detected issues
   - These provide user-facing feedback about rendering problems

## Common Issues and Solutions

Based on our debugging, here are the most common issues causing white pages:

### 1. Data Loading Issues

**Symptoms:**
- Component mounts but no content renders
- No error messages in the console
- Navigation debugger shows 0 children in main content

**Solution:**
- Ensure data fetching has proper loading states
- Add empty state handling for when data is null
- Implement error handling for data fetching failures

### 2. Component Mounting Issues

**Symptoms:**
- Component doesn't mount at all
- Error in console about undefined components
- Route transition logs but no mount logs

**Solution:**
- Check component exports and imports
- Verify route path configuration
- Ensure all required dependencies are available

### 3. Render Error Issues

**Symptoms:**
- Component starts to mount but errors during render
- React error boundary catches error
- Navigation debugger mount log but no content check log

**Solution:**
- Add more granular error boundaries
- Check for null/undefined values in rendered content
- Fix component prop type mismatches

## Next Steps

For routes that still exhibit white page issues:

1. Apply `data-testid` attributes to key elements in each route component
2. Add route-specific error handling for data fetching operations
3. Implement fallback UI for common error states
4. Add more specific timing measurements for component lifecycle events

By leveraging these debugging tools and following the workflow, we can systematically identify and resolve white page issues across all merchant routes.
