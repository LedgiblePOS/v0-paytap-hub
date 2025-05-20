
# Type Consistency Guidelines

This documentation outlines best practices to maintain consistent typing between database entities and UI models, along with strategies to prevent common TypeScript errors.

## 1. Understanding the Entity-Model Pattern

Our application uses a dual-type approach:

- **Database Entities** (snake_case): Direct representations of database tables
  - Example: `{ user_id: string, first_name: string }`

- **UI Models** (camelCase): Used in React components
  - Example: `{ userId: string, firstName: string }`

## 2. Common Type Errors and Their Prevention

### 2.1. Missing Properties in Type Definitions

**Error:**
```
Property 'resourceId' is missing in type '{ ... }' but required in type 'AuditLogModel'
```

**Prevention:**
- Always check the corresponding interface when updating converter functions
- Ensure all required properties are included with appropriate default values for optional ones
- Use IDE features to verify property completeness

### 2.2. Type Mismatch Between Entity and Model

**Error:**
```
Argument of type '{ amount: number; created_at: string; ... }[]' is not assignable to parameter of type 'TransactionModel[]'
```

**Prevention:**
- Always use converter functions at data boundaries
- Convert entities to models immediately after fetching from API/database
- Convert models back to entities before saving

```typescript
// CORRECT - Use converters at boundaries
const transactionModels = toTransactionModels(recentTransactions);
<RecentTransactions transactions={transactionModels} />

// INCORRECT - Direct usage without conversion
<RecentTransactions transactions={recentTransactions} />
```

### 2.3. Property Access on Wrong Type

**Error:**
```
Property 'monthlyPrice' does not exist on type 'SubscriptionPlan'. Did you mean 'monthly_price'?
```

**Prevention:**
- Be consistent about whether you're working with an entity or model
- Use snake_case properties only with database entities
- Use camelCase properties only with UI models

### 2.4. Handling Arrays and JSON

**Error:**
```
Property 'map' does not exist on type 'Json'
```

**Prevention:**
- Always check the type before using array methods
- Add type guards for JSON data
- Handle both string and array formats when needed

```typescript
// Type guard for JSON array handling
if (Array.isArray(features)) {
  features.map(feature => /* ... */);
} else if (typeof features === 'string') {
  try {
    const featuresArray = JSON.parse(features);
    if (Array.isArray(featuresArray)) {
      featuresArray.map(feature => /* ... */);
    }
  } catch {
    // Handle as a single item
  }
}
```

## 3. Best Practices for Entity-Model Pattern

### 3.1. Consistent Conversion Flow

```
Database → Entity (snake_case) → Convert → Model (camelCase) → UI
UI → Model (camelCase) → Convert → Entity (snake_case) → Database
```

### 3.2. Automated Testing for Converters

Write tests for converter functions to ensure they:
- Handle all properties correctly
- Provide appropriate defaults for nullable fields
- Maintain data integrity during round-trip conversions

### 3.3. Type Guards for Runtime Checks

```typescript
function isUserEntity(obj: any): obj is User {
  return obj && typeof obj.first_name !== 'undefined';
}

function isUserModel(obj: any): obj is UserModel {
  return obj && typeof obj.firstName !== 'undefined';
}
```

## 4. Practical Workflow for Code Changes

When making changes that involve data types:

1. **Identify the Data Source**
   - Is it coming from a database? → Use entity types (snake_case)
   - Is it being displayed in UI? → Use model types (camelCase)

2. **Check Interface Definitions**
   - Verify required vs optional properties
   - Ensure alignment between entity and model definitions

3. **Use Proper Converters**
   - Always use toEntityModel() when moving data toward the UI
   - Always use toModelEntity() when moving data toward the database

4. **Consider Edge Cases**
   - Null/undefined handling
   - Array vs single item handling
   - JSON parsing requirements

5. **Document Unusual Type Behaviors**
   - Add comments for non-obvious type handling
   - Note where types might be polymorphic

By following these guidelines, we can dramatically reduce type errors and create a more maintainable codebase.
