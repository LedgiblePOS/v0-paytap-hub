# Preventing Entity-Model TypeScript Errors

## Common Error Categories

The most common TypeScript errors in our application occur when working with the two different formats we use:
- **Database Entities**: Using snake_case property names (e.g., `merchant_id`, `is_verified`)
- **UI Models**: Using camelCase property names (e.g., `merchantId`, `isVerified`)

## Entity-Model Type Mismatch Errors

### 1. Import Declaration Conflicts

**Error:**
```
error TS2440: Import declaration conflicts with local declaration of 'MerchantVerificationModel'.
```

**Solution:**
- Do not redefine types that are imported
- Check for duplicate type definitions across files
- Structure code to avoid name conflicts:
```typescript
// Instead of:
import { MerchantVerificationModel } from './models';
export interface MerchantVerificationModel { /*...*/ } // Conflict!

// Do this:
import { MerchantVerificationModel as ImportedModel } from './models';
export interface LocalModel { /*...*/ } // No conflict
```

### 2. Property Access Errors

**Error:**
```
error TS2561: Object literal may only specify known properties, but 'merchant' does not exist in type 'MerchantVerificationModel'.
```

**Solution:**
- Always match property names exactly as defined in interfaces
- Use IDE autocompletion to ensure correct property names
- Update interfaces when adding new properties

### 3. Spread Type Errors

**Error:**
```
error TS2698: Spread types may only be created from object types.
```

**Solution:**
- Always check that spread values are objects or provide defaults:
```typescript
// Error-prone:
{ ...someValue } // Might not be an object!

// Safe:
{ ...(someValue || {}) }

// Even better with typing:
{ ...((someValue as Record<string, any>) || {}) }
```

## Best Practices

### 1. Type Conversion Boundaries

- **Convert at Database Boundaries**: Immediately convert snake_case entities to camelCase models after fetching from database
```typescript
const { data } = await supabase.from('table').select('*');
const models = toModels(data);
```

- **Convert before Database Operations**: Convert models back to entities before saving
```typescript
const entity = toEntity(model);
await supabase.from('table').insert(entity);
```

### 2. Relationship Handling

When dealing with relationships between entities:

- **Optional Fields for Joins**: Mark relationship fields as optional in both entity and model interfaces
```typescript
interface MerchantVerification {
  // Required fields
  id: string;
  merchant_id: string;
  // Optional relationship
  merchants?: Merchant;
}
```

- **Conditionally Add Related Objects**: Use conditional spreading for relationships
```typescript
// Safe pattern for conversion with relationships
return {
  // Base properties
  id: entity.id,
  // ...other properties
  
  // Only add relationship if it exists
  ...(entity.related ? { related: toRelatedModel(entity.related) } : {})
};
```

### 3. Type Guards

For safer type handling:

```typescript
// Check if property exists before using it
if (verification.merchants && verification.merchants.business_name) {
  // Safe to use
  const name = verification.merchants.business_name;
}

// Type guard function
function hasMerchant(verification: MerchantVerification): verification is MerchantVerification & { merchants: Merchant } {
  return verification.merchants !== undefined;
}

// Usage
if (hasMerchant(verification)) {
  // TypeScript knows merchants exists
  const name = verification.merchants.business_name;
}
```

## Integration with Development Workflow

1. **Run Type Checking Before Commits**: `npm run type-check`
2. **Use IDE TypeScript Integration**: Take advantage of real-time error highlighting
3. **Document Type Structures**: Keep updated diagrams of entity-model relationships
4. **Review Type Definitions When Adding Features**: Update all related interfaces

By following these practices consistently, we can prevent most entity-model related TypeScript errors in our application.
