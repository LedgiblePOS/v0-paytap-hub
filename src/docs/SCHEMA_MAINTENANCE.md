
# Schema Maintenance Guide

This document outlines best practices for maintaining schema definitions to prevent TypeScript errors.

## Common Schema-Related Errors

### 1. Missing Schema Exports

Error example:
```
error TS2305: Module '"../schema"' has no exported member 'notificationPreferencesSchema'.
```

**Cause**: This error occurs when a component imports a schema that hasn't been defined or exported in the schema file.

**Solution**:
1. Ensure all schemas are defined in their respective schema files
2. Export all schemas and their derived types
3. Keep schema files and their imports in sync

### 2. Type Incompatibility

Error example:
```
error TS2322: Type '"warning"' is not assignable to type '"default" | "destructive"'.
```

**Cause**: This happens when a value doesn't match the expected type or enum.

**Solution**:
1. Check component documentation for allowed prop values
2. For UI components, verify which variants are supported
3. Update code to use only the allowed values
4. For shadcn/ui components, check the component source for allowed variants

## Schema Organization Best Practices

### 1. Centralized Schema Files

- Keep related schemas in a single file
- Group schemas by feature or module
- Use explicit naming to avoid conflicts

### 2. Type Derivation

- Use Zod's `z.infer<typeof schema>` to derive TypeScript types
- Export both the schema and derived type
- Reference the derived type in component props

### 3. Schema Validation

Before releasing new features:
- Verify all required schemas are defined
- Ensure schemas are imported correctly in components
- Check that all required fields are included
- Test schema validation with sample data

### 4. Maintaining Backward Compatibility

When updating schemas:
- Add new fields as optional when possible
- Consider impacts on existing data
- Update all components that use the schema
- Document breaking changes

## Schema Testing Checklist

- [ ] All schemas are properly exported
- [ ] Component imports match schema exports
- [ ] Enums and constants use valid values
- [ ] Default values conform to schema requirements
- [ ] Form validation messages are clear and helpful

By following these guidelines, we can prevent most schema-related TypeScript errors before they cause build failures.
