
# Common Component Import Errors & How to Fix Them

## 1. Module has no exported member 'X'

### Error Example:
```
error TS2614: Module '"./merchant/PlaceholderRoutes"' has no exported member 'PlaceholderRoutes'. 
Did you mean to use 'import PlaceholderRoutes from "./merchant/PlaceholderRoutes"' instead?
```

### Cause:
This error occurs when trying to use named imports (`import { X } from 'Y'`) with a default export.

### Solution:
- Check how the component is exported in the source file:
  - For default exports: `import ComponentName from './path'`
  - For named exports: `import { ComponentName } from './path'`

### Best Practice:
- Be consistent with export patterns across your codebase
- Use default exports for primary components
- Use named exports for utility functions, hooks, and secondary components

## 2. Missing Required Props

### Error Example:
```
error TS2741: Property 'children' is missing in type '{}' but required in type 'ProtectedMerchantLayoutProps'.
```

### Cause:
This occurs when a required prop isn't provided to a component.

### Solution:
- Always pass all required props to components
- For route-level components with Outlet, pass at least an empty element: `<Component children={null} />`

### Best Practice:
- Consider making props optional with default values where appropriate
- Document required props clearly in the component's interface

## 3. Incompatible Property Types

### Error Example:
```
error TS2322: Type '{ children: string; as: ForwardRefExoticComponent<LinkProps & RefAttributes<HTMLAnchorElement>>; to: string; }' 
is not assignable to type 'IntrinsicAttributes & Omit<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>>...'.
Property 'as' does not exist on type...
```

### Cause:
This happens when passing props that don't match the component's interface, often when mixing component libraries or using incorrect prop patterns.

### Solution:
- Check the component's documentation or type definitions for correct props
- For shadcn/ui components, check for specific composition patterns:
  - Instead of `<Component as={Link} to="/path">Text</Component>`
  - Use `<Component><Link to="/path">Text</Link></Component>`

### Best Practice:
- Reference component documentation
- Check type definitions when unsure about prop requirements
- Be consistent with composition patterns

## 4. Incorrect Nesting of Components

### Error Example:
```
Type '{ children: Element; }' is not assignable to type 'IntrinsicAttributes & BreadcrumbLinkProps'.
Property 'children' does not exist on type...
```

### Cause:
This occurs when nesting components incorrectly, often when using composition patterns.

### Solution:
- Check the component's composition pattern in documentation
- For shadcn/ui components like BreadcrumbLink, check if they expect children as a prop or as nested elements

## Prevention Checklist

When adding new components:
1. ✅ Verify correct import style (default vs named)
2. ✅ Provide all required props
3. ✅ Check prop types match component interface
4. ✅ Follow the library's composition patterns
5. ✅ Test the component after implementation

Following these guidelines will prevent common component import and prop errors in your React application.
