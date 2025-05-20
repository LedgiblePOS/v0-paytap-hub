
# Database Schema Mismatch Resolution Guide

This guide provides strategies for resolving common database schema mismatch errors encountered during development.

## Error Types and Solutions

### 1. Missing Table Errors

```
Argument of type 'non_existent_table_name' is not assignable to parameter of type '[list of valid tables]'
```

#### Immediate Solutions:

1. **Audit Log Fallback:**
   ```typescript
   // Instead of:
   await supabase.from('data_export_logs').insert({ /* data */ });
   
   // Use:
   await supabase.from('audit_logs').insert({
     action: 'EXPORT',
     resource: 'DATA',
     description: JSON.stringify(exportData),
   });
   ```

2. **Console Logging with Mock Response:**
   ```typescript
   // Log the attempted operation
   console.log("Would save to data_export_logs:", exportData);
   
   // Return mock response
   return { success: true, id: 'mock-id' };
   ```

### 2. Missing Column Errors

```
Property 'dark_mode' does not exist on type 'MerchantCustomization'
```

#### Immediate Solutions:

1. **Selective Property Access:**
   ```typescript
   // Instead of:
   const { theme_color, dark_mode, logo_url } = customization;
   
   // Use:
   const theme_color = customization.theme_color;
   const logo_url = customization.logo_url;
   const dark_mode = false; // Default value
   ```

2. **Object Mapping with Defaults:**
   ```typescript
   const settings = {
     themeColor: customization.theme_color || "#8B5CF6",
     logoUrl: customization.logo_url || "",
     darkMode: false, // Default - column doesn't exist yet
     compactMode: false // Default - column doesn't exist yet
   };
   ```

### 3. Save Operations with Missing Columns

```
Attempted to save 'dark_mode' but column doesn't exist
```

#### Immediate Solutions:

1. **Only Save Existing Columns:**
   ```typescript
   // Instead of:
   await supabase.from('merchant_customizations').upsert({
     merchant_id: id,
     theme_color: data.themeColor,
     accent_color: data.accentColor, // Non-existent column
     dark_mode: data.darkMode, // Non-existent column
   });
   
   // Use:
   await supabase.from('merchant_customizations').upsert({
     merchant_id: id,
     theme_color: data.themeColor,
     // Omit non-existent columns
   });
   
   // Log what would have been saved
   console.log("Additional fields that would be saved:", {
     accent_color: data.accentColor,
     dark_mode: data.darkMode
   });
   ```

## Preventative Measures

### 1. Schema Validation Utility

Create a utility that validates table and column existence:

```typescript
// Example schema validation utility
export const dbSchema = {
  tables: {
    merchants: true,
    products: true,
    merchant_customizations: true,
    // Add all existing tables here
  },
  columns: {
    merchant_customizations: {
      id: true,
      merchant_id: true,
      theme_color: true,
      logo_url: true,
      custom_domain: true,
      email_template: true,
      // These don't exist yet
      accent_color: false,
      dark_mode: false,
      compact_mode: false,
    },
    // Add column definitions for other tables
  }
};

export function tableExists(tableName: string): boolean {
  return !!dbSchema.tables[tableName];
}

export function columnExists(tableName: string, columnName: string): boolean {
  return !!(dbSchema.columns[tableName] && dbSchema.columns[tableName][columnName]);
}
```

### 2. Safe Database Access Methods

Create wrapper methods for safe database access:

```typescript
export async function safeInsert(
  tableName: string, 
  data: Record<string, any>
): Promise<{ data: any; error: any }> {
  if (!tableExists(tableName)) {
    console.error(`Table ${tableName} does not exist`);
    return { 
      data: null, 
      error: new Error(`Table ${tableName} does not exist`) 
    };
  }

  // Filter out non-existent columns
  const safeData = Object.entries(data).reduce((acc, [key, value]) => {
    if (columnExists(tableName, key)) {
      acc[key] = value;
    } else {
      console.warn(`Column ${key} does not exist in ${tableName}`);
    }
    return acc;
  }, {} as Record<string, any>);

  return await supabase.from(tableName).insert(safeData);
}
```

### 3. Development Database Schema Synchronization

Ensure development matches production:

1. **Schema Export Script:**
   ```bash
   # Export current schema for reference
   npx supabase db dump -f schema.sql
   ```

2. **Schema Documentation Generation:**
   ```typescript
   // Script to generate schema documentation
   async function generateSchemaDoc() {
     const { data } = await supabase.rpc('get_schema');
     fs.writeFileSync(
       'src/docs/current_schema.md',
       JSON.stringify(data, null, 2)
     );
   }
   ```

## Implementation Plan for Missing Tables and Columns

1. **Feature Flags:**
   ```typescript
   // Configuration
   const FEATURES = {
     DATA_EXPORT_IMPORT_TABLE: false, // Set to true once table exists
     THEME_EXTENDED_FIELDS: false, // Set to true once columns are added
   };

   // Usage
   if (FEATURES.DATA_EXPORT_IMPORT_TABLE) {
     await supabase.from('data_export_logs').insert(data);
   } else {
     // Fallback approach
     await supabase.from('audit_logs').insert({
       action: 'EXPORT',
       resource: 'DATA',
       description: JSON.stringify(data),
     });
   }
   ```

2. **Database Migrations:**
   When ready to implement these features properly, create SQL migrations:

   ```sql
   -- Example migration for notification preferences table
   CREATE TABLE merchant_notification_preferences (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     merchant_id UUID NOT NULL REFERENCES merchants(id),
     email_notifications BOOLEAN DEFAULT TRUE,
     push_notifications BOOLEAN DEFAULT FALSE,
     sms_notifications BOOLEAN DEFAULT FALSE,
     new_order_notify BOOLEAN DEFAULT TRUE,
     payment_notify BOOLEAN DEFAULT TRUE,
     inventory_alerts BOOLEAN DEFAULT FALSE,
     marketing_emails BOOLEAN DEFAULT TRUE,
     digest_frequency TEXT DEFAULT 'daily',
     created_at TIMESTAMPTZ DEFAULT now(),
     updated_at TIMESTAMPTZ DEFAULT now()
   );
   
   -- Example migration for adding columns to merchant_customizations
   ALTER TABLE merchant_customizations
   ADD COLUMN accent_color TEXT DEFAULT '#0EA5E9',
   ADD COLUMN dark_mode BOOLEAN DEFAULT FALSE,
   ADD COLUMN compact_mode BOOLEAN DEFAULT FALSE;
   ```

By following these guidelines, we can prevent database schema mismatch errors and ensure smooth development.
