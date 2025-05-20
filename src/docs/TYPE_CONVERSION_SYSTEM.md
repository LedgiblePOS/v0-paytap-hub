
# Type Conversion System

This document explains the comprehensive type conversion system implemented in the application to handle the differences between database entities (snake_case) and frontend models (camelCase).

## Overview

Our application deals with data in two different formats:

1. **Database/API Format (Entities)**: Uses snake_case property names (e.g., `first_name`, `business_email`)
2. **UI Format (Models)**: Uses camelCase property names (e.g., `firstName`, `businessEmail`)

The conversion system provides a robust way to transform data between these formats automatically.

## Core Utilities

### Type Transformations

The system includes TypeScript utility types for static type checking:

```typescript
// Convert string from snake_case to camelCase
type SnakeToCamel<S extends string> = ...

// Convert string from camelCase to snake_case
type CamelToSnake<S extends string> = ...

// Convert object keys from snake_case to camelCase
type SnakeToCamelObject<T> = ...

// Convert object keys from camelCase to snake_case
type CamelToSnakeObject<T> = ...
```

### Runtime Transformation Functions

The following functions handle runtime conversions:

```typescript
// Convert a snake_case string to camelCase
function snakeToCamel(str: string): string

// Convert a camelCase string to snake_case
function camelToSnake(str: string): string

// Transform object keys from snake_case to camelCase
function transformSnakeToCamel<T>(obj: T): SnakeToCamelObject<T>

// Transform object keys from camelCase to snake_case
function transformCamelToSnake<T>(obj: T): CamelToSnakeObject<T>
```

### Type Guards

Type guards help identify the format of an object:

```typescript
// Check if an object uses snake_case keys
function isSnakeCaseObject(obj: Record<string, any>): boolean

// Check if an object uses camelCase keys
function isCamelCaseObject(obj: Record<string, any>): boolean

// Auto-detect and transform based on key format
function autoTransform<T>(obj: T): T
```

## React Integration

### useTransform Hook

The `useTransform` hook automatically transforms data as it changes:

```typescript
function useTransform<T>(
  data: T | null | undefined, 
  targetCase: 'camel' | 'snake' = 'camel'
): T | null | undefined
```

### withTransform HOC

The `withTransform` higher-order component automatically transforms selected props:

```typescript
function withTransform<P>(
  Component: React.ComponentType<P>,
  propsToTransform: Array<keyof P> = [],
  targetCase: 'camel' | 'snake' = 'camel'
): React.FC<P>
```

## Entity-Specific Converters

Each entity type has dedicated conversion utilities:

```typescript
// User converters
export const toUserModel = (userData: UserData): User => ...
export const toUserData = (user: User): UserData => ...

// Merchant converters
export const toMerchantModel = (entity: MerchantEntity): MerchantModel => ...
export const toMerchantEntity = (model: MerchantModel): MerchantEntity => ...
```

## Generic Converters

The system also includes generic converters for any entity type:

```typescript
export function entityToModel<T, U>(entity: T): U
export function modelToEntity<T, U>(model: T): U
export function entitiesToModels<T, U>(entities: T[]): U[]
export function modelsToEntities<T, U>(models: T[]): U[]
```

## Best Practices

1. **Always Convert at Boundaries**: Convert data at API/database boundaries
   ```typescript
   const { data } = await supabase.from('merchants').select('*');
   const merchantModels = toMerchantModels(data);
   ```

2. **Use Type Guards for Safety**:
   ```typescript
   if (isMerchantEntity(data)) {
     // Handle entity format
   } else if (isMerchantModel(data)) {
     // Handle model format
   }
   ```

3. **Component Props**: Components should always expect model format (camelCase)

4. **Database Operations**: Always convert models back to entities before saving
   ```typescript
   const entityToSave = toMerchantEntity(merchantModel);
   await supabase.from('merchants').insert(entityToSave);
   ```

## Implementation Examples

### Transforming API Response

```typescript
// Automatically handle conversion in a data fetching hook
function useFetchMerchants() {
  const [merchants, setMerchants] = useState<MerchantModel[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('merchants').select('*');
      // Auto-convert from snake_case to camelCase
      setMerchants(toMerchantModels(data));
    }
    
    fetchData();
  }, []);
  
  return merchants;
}
```

### Component with Automatic Prop Conversion

```typescript
// Component expects camelCase properties
const MerchantDetails: React.FC<{merchant: MerchantModel}> = ({merchant}) => {
  return <div>{merchant.businessName}</div>;
};

// HOC adds automatic conversion
const MerchantDetailsWithConversion = withTransform(
  MerchantDetails, 
  ['merchant']
);

// Can now accept either format
<MerchantDetailsWithConversion merchant={snakeCaseMerchantFromAPI} />
```
