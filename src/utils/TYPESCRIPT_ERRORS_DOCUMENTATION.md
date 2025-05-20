
# TypeScript Common Errors Documentation

## Database Entity vs UI Model Format Issues

The most common error in our codebase is the mismatch between database entity field names (snake_case) and UI model field names (camelCase).

### Error Types:

1. **Property does not exist errors**:
   ```
   error TS2551: Property 'firstName' does not exist on type 'User'. Did you mean 'first_name'?
   ```

2. **Object literal may only specify known properties**:
   ```
   error TS2561: Object literal may only specify known properties, but 'merchantId' does not exist in type 'Product'. Did you mean to write 'merchant_id'?
   ```

3. **Type assignment compatibility errors**:
   ```
   error TS2322: Type '{ id: string; userId: string; }' is not assignable to type 'Merchant'. Property 'user_id' is missing.
   ```

### Solution:

We've implemented a clear separation between:
- **Database Entities**: Use snake_case (e.g., `user_id`, `first_name`)
- **UI Models**: Use camelCase (e.g., `userId`, `firstName`)

We now use converters in `/src/utils/modelConversions.ts` to translate between these formats:

```typescript
// Convert from database entity to UI model
const userModel = toUserModel(userEntity);

// Convert from UI model back to database entity
const userEntity = toUserEntity(userModel);
```

## Batch Conversion for Arrays

When dealing with arrays of entities, use the batch conversion utilities:

```typescript
// Convert an array of database entities to UI models
const userModels = toUserModels(userEntities);

// Use models in your UI components
return <UserList users={userModels} />;
```

## Type Checking for Optional JSON Properties

When accessing properties of JSON data, TypeScript can't guarantee the property exists:

```typescript
// This might cause an error if verification_data is null or doesn't have rejection_reason
const reason = verification.verification_data.rejection_reason;
```

Solution:
```typescript
// Use optional chaining and type guards
const reason = verification.verification_data?.rejection_reason || null;
```

## Ambiguous Types in Function Returns

Use explicit types for function return values to avoid ambiguity:

```typescript
// May cause errors if the return type is inferred incorrectly
const fetchUsers = async () => {
  // ...code
  return data;
};

// Better approach with explicit return type
const fetchUsers = async (): Promise<UserModel[]> => {
  // ...code
  return data.map(user => toUserModel(user));
};
```

## Working with Supabase Query Responses

Supabase query responses often need to be processed before use in UI:

```typescript
// Fetch data from Supabase
const { data, error } = await supabase.from("users").select("*");

// Convert to UI models before using in components
const userModels = data ? toUserModels(data) : [];
```

## Handling Mixed Data Types

Properties like `features` in `SubscriptionPlan` can be string or array:

```typescript
// Handle conversion based on current type
const features = typeof plan.features === 'string' 
  ? JSON.parse(plan.features) 
  : plan.features;
```

## Route Parameter Type Issues

React Router route parameters are always strings:

```typescript
// Incorrect - id will be a string, not a number
const { id } = useParams();
const numericId = id; // TS error if used where a number is expected

// Correct approach
const { id } = useParams();
const numericId = id ? parseInt(id, 10) : undefined;
```

## Function Returning void vs boolean

Some functions return void, but are incorrectly tested for truthiness:

```typescript
// Incorrect - login() returns void, not a boolean or object
const result = await login(email, password);
if (result) { // Error: Expression of type 'void' cannot be tested for truthiness

// Correct - check for specific conditions or handle exceptions
try {
  await login(email, password);
  // Success logic here
} catch (error) {
  // Error handling
}
```

These patterns help maintain consistency and type safety throughout the application.
