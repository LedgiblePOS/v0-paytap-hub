
# React Query v5 Usage Guide

## Object Syntax Requirement

As of React Query v5, all query and mutation related functions must use the object parameter syntax rather than multiple arguments.

## Correct Usage Patterns

### useQuery - Correct Usage

```typescript
// ✅ CORRECT: Object syntax
const { data, isLoading } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  enabled: shouldFetch,
})
```

### useQuery - Incorrect Usage

```typescript
// ❌ INCORRECT: Multiple arguments syntax (deprecated in v5)
const { data, isLoading } = useQuery(
  'todos',
  fetchTodos,
  { enabled: shouldFetch }
)
```

### useMutation - Correct Usage

```typescript
// ✅ CORRECT: Object syntax
const mutation = useMutation({
  mutationFn: (newTodo) => axios.post('/todos', newTodo),
  onSuccess: () => {
    // Handle success
  }
})
```

### useMutation - Incorrect Usage

```typescript
// ❌ INCORRECT: Function as first parameter syntax (deprecated in v5)
const mutation = useMutation(
  (newTodo) => axios.post('/todos', newTodo),
  { onSuccess: () => { /* success handling */ } }
)
```

## QueryClient Methods

This object syntax requirement also applies to QueryClient methods:

```typescript
// ✅ CORRECT
queryClient.invalidateQueries({
  queryKey: ['todos'],
  exact: true
})

// ❌ INCORRECT
queryClient.invalidateQueries(['todos'], { exact: true })
```

## Common Error Pattern

If you encounter this error:

```
Bad argument type. Starting with v5, only the "Object" form is allowed when calling query related functions.
```

Locate the affected query or mutation and convert it to the object syntax format.

## Benefits of the Object Syntax

- Easier to read and understand
- More consistent API across all functions
- Better TypeScript type inference
- Eliminates ambiguity with optional parameters
- Simplifies future API evolution

Following this standardized approach will prevent runtime errors and maintain compatibility with future React Query updates.
