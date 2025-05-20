
# Type Consistency Guide

This guide establishes our best practices for ensuring type consistency throughout the application to prevent TypeScript errors.

## Core Principles

1. **Single Source of Truth for Types**
   - Define types in dedicated files (e.g., `types.ts`)
   - Reuse types across components with explicit imports
   - Use Pick, Omit, and Partial for derived types

2. **Prop Type Definitions**
   - Every component must have explicit prop interfaces
   - Use descriptive JSDoc comments for all props
   - For common prop patterns, use shared types

3. **Type-Safe Function Arguments**
   - All function parameters must have explicit types
   - Use default values to handle optional parameters
   - Handle type conversions at function boundaries

4. **Consistent Naming Conventions**
   - Component props: `ComponentNameProps`
   - Form values: `FormNameValues`
   - Context values: `ContextNameContext`
   - Hooks return values: Descriptive object property names

## Preventing Type Mismatches

### Component Props

```typescript
// Define in types.ts
export interface ButtonProps {
  /** Primary button content */
  children: React.ReactNode;
  /** Callback when button is clicked */
  onClick?: () => void;
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'outline';
}

// Use in component
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary'
}) => {
  // Implementation
};
```

### Array vs. Single Item Props

When a component expects an array but might receive a primitive type:

```typescript
// Always convert to array if needed
const items = Array.isArray(data) ? data : [data];

// Or use explicit type guard
function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
```

### Numeric Values from String Sources

When receiving numeric values that might be strings (e.g., from APIs):

```typescript
// Convert string to number safely
const count = typeof value === 'string' ? parseInt(value, 10) : value;

// With fallback
const safeCount = Number(value) || 0;
```

## Automatic Type-Safety Checks

Our codebase should implement these automatic checks:

1. **Component Size Limits**
   - Components exceeding 150 lines should be refactored
   - Complex prop interfaces (7+ props) should use composition

2. **Type Validation at Boundaries**
   - API/service layer
   - Props destructuring
   - User input processing

3. **Default Values**
   - Always provide default values for optional props
   - Use nullish coalescing for potentially undefined values

## Type-Safe Practices for Common Scenarios

### Forms

```typescript
// Define schema with zod
const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

// Derive type from schema
type FormValues = z.infer<typeof formSchema>;

// Use in form component
const { register, handleSubmit } = useForm<FormValues>({
  resolver: zodResolver(formSchema),
});
```

### API Responses

```typescript
// Define response types
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Type-safe response handling
async function fetchData<T>(): Promise<ApiResponse<T>> {
  try {
    const response = await api.get('/endpoint');
    return { data: response.data, error: null };
  } catch (err) {
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}
```

### Event Handlers

```typescript
// Type-safe event handlers
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Handle submission
};
```

## Type-Safety Review Checklist

When reviewing code, check for:

- [ ] Explicit type definitions for all components
- [ ] JSDoc comments for props and functions
- [ ] Default values for optional parameters
- [ ] Type guards for conditional logic
- [ ] Proper error handling with typed errors
- [ ] Consistent use of shared type definitions

By following these guidelines, we can prevent most type errors and maintain a consistent, type-safe codebase.
