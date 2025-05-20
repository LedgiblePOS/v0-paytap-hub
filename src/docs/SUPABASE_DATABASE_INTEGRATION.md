
# Supabase Database Integration Guide

## Overview

This guide outlines best practices for working with Supabase database tables in our application. Following these guidelines will help prevent common errors related to database access and schema mismatches.

## Common Error Types

### 1. Non-Existent Table Access

**Error:**
```
Argument of type 'table_name' is not assignable to parameter of type '[list of valid tables]'.
```

**Cause:** Attempting to query a table that doesn't exist in the Supabase database.

**Solution:**
- Always check the database schema before referencing tables
- Create database migrations for new tables before implementing UI features
- Use a schema validation utility to verify table existence at runtime

### 2. Missing Column Access

**Error:**
```
Property 'column_name' does not exist on type '[database entity]'.
```

**Cause:** Trying to access a column that doesn't exist on a database entity.

**Solution:**
- Check the table schema in Supabase before referencing columns
- Create column migrations before implementing UI features
- Use optional chaining (`?.`) when accessing potentially missing properties

## Best Practices

### 1. Database Schema First Approach

Always create database tables and columns **before** implementing UI features:

```typescript
// WRONG - Accessing tables that don't exist
await supabase.from('data_export_logs').insert({ /* ... */ });

// RIGHT - Check if table exists or use audit logging as fallback
const { error } = await supabase.from('audit_logs').insert({
  action: 'EXPORT',
  resource: 'DATA',
  description: 'Exported data in CSV format',
});
```

### 2. Schema Validation

Implement a schema validation utility:

```typescript
// Example schema validation function
function validateTableExists(tableName: string): boolean {
  const validTables = [
    'products', 'merchants', 'customers', 'transactions', 
    'audit_logs', 'categories', 'merchant_customizations'
  ];
  return validTables.includes(tableName);
}

// Usage
if (validateTableExists('data_export_logs')) {
  await supabase.from('data_export_logs').insert({ /* ... */ });
} else {
  // Fallback to existing table
  await supabase.from('audit_logs').insert({ 
    action: 'EXPORT',
    resource: 'DATA',
    description: JSON.stringify(exportData)
  });
}
```

### 3. TypeScript Type Definitions

Ensure TypeScript type definitions match the actual database schema:

```typescript
// Define types based on actual database schema
interface MerchantCustomization {
  id: string;
  merchant_id: string;
  theme_color: string;
  logo_url: string | null;
  custom_domain: string | null;
  email_template: string | null;
  created_at: string;
  updated_at: string;
  // Note: These fields don't exist in the actual DB yet
  // accent_color?: string;
  // dark_mode?: boolean;
  // compact_mode?: boolean;
}
```

### 4. Graceful Degradation

Handle missing tables or columns gracefully:

```typescript
// Try to get data from the ideal table
const { data, error } = await supabase
  .from('notification_preferences')
  .select('*')
  .eq('user_id', userId);

// If table doesn't exist or error occurs, use defaults
if (error || !data) {
  console.warn('Using default notification preferences');
  return defaultPreferences;
}
```

### 5. Migration Process

Follow this process when adding new database tables or columns:

1. **Create a migration plan**
   - Document the tables and columns to be added
   - Define data types and constraints

2. **Implement the migration**
   - Use SQL migrations for database schema changes
   - Test migrations in a development environment

3. **Update TypeScript types**
   - Update or create TypeScript interfaces that match the new schema
   - Ensure type safety throughout the application

4. **Implement UI features**
   - Only after migrations are applied, implement UI features

## Database Schema Reference

Always refer to our current database schema before implementing features:

| Table Name | Columns |
|------------|---------|
| merchants | id, user_id, business_name, business_logo, country, default_currency, product_count, product_limit, subscription_tier, created_at, updated_at |
| merchant_customizations | id, merchant_id, theme_color, logo_url, custom_domain, email_template, created_at, updated_at |
| audit_logs | id, user_id, action, resource, description, ip_address, user_agent, created_at |
| ... | ... |

## Preventing Future Errors

1. Create SQL migrations for new tables and columns before implementation
2. Implement database validation utilities
3. Use feature flags for features requiring new database schemas
4. Review database schema during code reviews
5. Test application with the actual database schema before deployment
