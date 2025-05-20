
# Authentication Component Refactoring Guide

This guide outlines our approach to maintaining clean, type-safe authentication components through automatic refactoring.

## Refactoring Triggers

Our code should be automatically refactored when:

1. A component reaches 150+ lines of code
2. Similar logic is duplicated across multiple files
3. Type inconsistencies emerge between related components
4. Props become overly complex or numerous

## Refactoring Pattern for Auth Components

### 1. Component Extraction

Extract related functionality into focused components:

```tsx
// Before: Large monolithic component
const LoginForm = () => { /* 200+ lines */ }

// After: Extracted components
const PasswordField = () => { /* 30 lines */ }
const EmailField = () => { /* 30 lines */ }
const RememberMeToggle = () => { /* 20 lines */ }
const LoginForm = () => { /* 70 lines, uses extracted components */ }
```

### 2. Wrapper Components

Create wrapper components for consistent UI patterns:

```tsx
// LoginFormWrapper.tsx
const LoginFormWrapper = ({ title, description, children }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

// Usage
const Login = () => (
  <LoginFormWrapper 
    title="Sign in" 
    description="Enter your credentials">
    <LoginForm />
  </LoginFormWrapper>
);
```

### 3. Shared Types and Validation

Maintain type definitions in a centralized location:

```tsx
// types.ts
export interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  defaultEmail?: string;
  showRegisterLink?: boolean;
  redirectPath?: string;
  userType?: 'merchant' | 'admin';
}
```

### 4. Custom Hooks for Logic

Extract business logic into custom hooks:

```tsx
// useLoginForm.ts
export const useLoginForm = (options: LoginFormOptions) => {
  // Authentication logic
  return { 
    handleSubmit, 
    isLoading, 
    errors 
  };
};

// Usage
const LoginForm = (props) => {
  const { handleSubmit, isLoading } = useLoginForm(props);
  // UI implementation
};
```

## Automatic Refactoring Checklist

When making changes to auth components, always:

- [ ] Check component line count - refactor if > 150 lines
- [ ] Extract repeated patterns into reusable components
- [ ] Ensure props use centralized type definitions
- [ ] Extract business logic into custom hooks
- [ ] Maintain consistent naming conventions
- [ ] Ensure all states have proper type definitions
- [ ] Verify all callbacks have proper error handling

By following this guide, we maintain clean, maintainable, and type-safe authentication components.
