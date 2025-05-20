
# Common Errors and Solutions

This document outlines common errors encountered in the project and their solutions to help developers avoid similar issues in the future.

## React Router Errors

### Error: Component is not a `<Route>` component

```
Error: [ComponentName] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>
```

**Solution:**
- Components used directly under `<Routes>` must return `<Route>` elements, not just JSX.
- When creating route component files (like SuperAdminRoutes.tsx), make sure they return Route components, not JSX wrapped in divs.

**Example of correct implementation:**
```jsx
// Correct implementation
const SuperAdminRoutes = () => {
  return (
    <>
      <Route path="/admin" element={<AdminComponent />} />
      <Route path="/admin/users" element={<UsersComponent />} />
    </>
  );
};

// INCORRECT implementation
const SuperAdminRoutes = () => {
  return (
    <div>
      <div path="/admin">
        <AdminComponent />
      </div>
    </div>
  );
};
```

## TypeScript Errors

### Missing Types in Imports

```
error TS2305: Module '"@/types"' has no exported member 'SomeType'.
```

**Solution:**
- Make sure to define all types used in the application in your types files.
- When importing a type, verify it exists in the specified module.
- Use TypeScript interfaces and types to properly define object shapes.

### Property Does Not Exist on Type

```
error TS2339: Property 'someProperty' does not exist on type 'SomeType'.
```

**Solution:**
- Make sure the property is defined in the interface or type definition.
- Check for typos in property names.
- If the property might not exist, use optional property syntax with `?` or use type guards.

### Type Mismatch

```
error TS2345: Argument of type 'string' is not assignable to parameter of type 'Enum'.
```

**Solution:**
- Ensure you're using the correct type for function arguments and variables.
- For enums, always use the enum value, not a string directly.
- Use type casting if appropriate (but prefer proper typing).

## Supabase Errors

### JSON Data Handling

**Problem:** Issues with JSON data storage and retrieval in Supabase tables.

**Solution:**
- Use the correct methods for handling JSON data in Supabase.
- For updating JSON fields, use PostgreSQL-specific JSON functions or properly format the JSON before sending it.
- When retrieving JSON data, handle parsing appropriately based on the expected structure.

Example for updating JSON fields:
```typescript
// Get current data first
const { data: currentData } = await supabase
  .from("table_name")
  .select("json_field")
  .eq("id", recordId)
  .single();

// Update the JSON field
const updatedData = {
  ...currentData.json_field,
  newProperty: newValue
};

await supabase
  .from("table_name")
  .update({ json_field: updatedData })
  .eq("id", recordId);
```

### Single Row Query Errors

**Problem:** Errors when expecting a single row but getting multiple or none.

**Solution:**
- Use `.single()` only when you're certain a row exists and is unique.
- Use `.maybeSingle()` when a row might not exist.
- Add appropriate error handling for cases where `.single()` might fail.

## React Form Errors

### Form Submission Issues

**Problem:** Form submission not working or submitting incorrect values.

**Solution:**
- Use form libraries like react-hook-form for better form management.
- Make sure to handle form events correctly (preventDefault for native forms).
- Validate form inputs before submission.
- Check that form values match the expected shape for your API.

## API Errors

### API Call Failures

**Problem:** API calls failing with 401, 403, or 500 errors.

**Solution:**
- For authentication errors (401), check if the user is logged in and the token is valid.
- For permission errors (403), verify that the user has the right role and permissions.
- For server errors (500), check server logs and input validation.
- Always include error handling in API calls:

```typescript
try {
  const { data, error } = await supabase.from("table").select("*");
  if (error) throw error;
  // Process data
} catch (error) {
  console.error("API error:", error);
  // Handle error (show toast, etc.)
}
```

## Performance Issues

### Slow Component Rendering

**Problem:** Components rendering slowly or causing performance issues.

**Solution:**
- Use React.memo for components that don't need frequent re-renders.
- Move expensive calculations to useMemo hooks.
- Use virtualization for large lists (react-window or react-virtualized).
- Use Suspense and React.lazy for code splitting.

## Authentication Issues

### Login/Auth Flow Problems

**Problem:** Issues with login or authentication flow.

**Solution:**
- Make sure auth providers are correctly configured in Supabase dashboard.
- Verify redirect URLs are set correctly.
- Handle auth state changes properly in your app.
- Use the supabase auth API consistently throughout the app.

## General Debugging Tips

1. **Check the console logs** for errors and warnings.
2. **Use React DevTools** to inspect component props and state.
3. **Use Network tab** in browser DevTools to inspect API requests.
4. **Add temporary console.log** statements to debug flow and values.
5. **Verify that your environment variables** are set correctly.
6. **Check for typos** in variable names, function calls, and imports.
7. **Restart your development server** if you suspect caching issues.

Remember to keep this document updated as new common errors are identified and resolved!
