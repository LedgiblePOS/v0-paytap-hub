
# Preventing TypeScript Errors

This guide provides solutions for the most common TypeScript errors in our application.

## Entity-Model Pattern Best Practices

Our application follows a strict pattern to handle data between:
- **Database Entities**: Uses snake_case (e.g., `first_name`, `merchant_id`)
- **UI Models**: Uses camelCase (e.g., `firstName`, `merchantId`)

### Key Rules to Follow

1. **Always Convert at Boundaries**:
   ```typescript
   // After fetching from the database
   const userData = await supabase.from('users').select('*').single();
   const user = toUserModel(userData);
   
   // Before saving to the database
   const userEntity = toUserEntity(userModel);
   await supabase.from('users').update(userEntity);
   ```

2. **Use Correct Types**:
   - Entity types for database operations (e.g., `UserEntity`, suffixed with `Entity`)
   - Model types for UI components (e.g., `User` or `UserModel`)
   - Avoid mixing these or creating hybrid types

3. **Export Enums Consistently**:
   - Always export enums from their definition file AND re-export from barrel files
   - When using enums, import them directly from the correct source

4. **Use Type Guards**:
   ```typescript
   if (isUserEntity(data)) {
     // Now TypeScript knows data is UserEntity
   } else if (isUserModel(data)) {
     // Now TypeScript knows data is User
   }
   ```

5. **Avoid Direct Type Assertions**:
   - Use conversion functions instead of type assertions
   - When necessary, use proper casting: `as UserEntity` not `as any`

## Common Error Patterns and Fixes

### 1. "Property 'X' is missing"

```
error TS2345: Argument of type 'ProductModel' is not assignable to parameter of type 'Product'.
Property 'isAvailable' is missing in type 'ProductModel'
```

**Fix**: 
- Ensure all properties from the target type exist in the source type
- Check conversion functions to make sure they map all required fields
- Update interface definitions to match expected shape

### 2. "Module has no exported member"

```
error TS2305: Module '"@/types/user"' has no exported member 'mapProfileToUser'.
```

**Fix**:
- Add the missing export to the appropriate file
- Check for typos in import statements
- Use IDE features to verify exports exist

### 3. "Enum Type Mismatches"

```
error TS2345: Argument of type '"ADMIN"' is not assignable to parameter of type 'UserRole'.
```

**Fix**:
- Always use the enum directly: `UserRole.ADMIN` not `"ADMIN"`
- Ensure the enum is imported from the correct location
- Don't redefine enums in multiple places

### 4. "Cannot find module"

```
Failed to resolve import "@/lib/supabase" from "...". Does the file exist?
```

**Fix**:
- Check file paths and ensure files exist
- Verify path aliases are correctly configured in tsconfig.json
- Ensure barrel files re-export all necessary modules

## Implementation Checklist

When implementing features that require data exchange:

1. ✅ Define both Entity and Model interfaces
2. ✅ Create conversion functions between them
3. ✅ Export necessary types and functions
4. ✅ Use consistent naming conventions
5. ✅ Document type expectations in functions
6. ✅ Add type guards for runtime checks

## Testing Recommendations

1. Add unit tests specifically for type conversions
2. Include type safety checks in code reviews
3. Run TypeScript type checking before committing code

Following these practices will significantly reduce TypeScript errors in our codebase.
