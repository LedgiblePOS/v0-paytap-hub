
# Module Development Workflow

This document outlines our standard workflow for developing new modules or enhancing existing ones to prevent common errors we've encountered.

## Module Development Process

### 1. Initial Setup and Planning

Before starting implementation:
- Define clear module boundaries and responsibilities
- Document required components, hooks, and services
- Create a dependency diagram to visualize relationships
- Review existing modules for patterns to follow

### 2. File Organization

Maintain a consistent file structure:

```
src/
├── components/
│   ├── ModuleName/
│   │   ├── ComponentName.tsx
│   │   ├── index.ts (exports all components)
├── hooks/
│   ├── useModuleName.ts
├── services/
│   ├── moduleNameService.ts
├── pages/
│   ├── ModuleName/
│   │   ├── Index.tsx
│   │   ├── components/
│   │   ├── hooks/
```

### 3. Implementation Sequence

Follow this order to prevent dependency errors:

1. Create and test service functions first
2. Implement custom hooks that use these services
3. Build UI components that use the hooks
4. Integrate components into pages
5. Update routes to include the new pages

### 4. Code Isolation

- Keep each file focused on a single responsibility
- Avoid adding unrelated code to existing files
- Never mix service, hook, component, or routing logic in one file
- Use explicit imports and exports

### 5. Error Prevention Checklist

Before committing code:

- [ ] File ends properly (no trailing partial code)
- [ ] All XML/JSX tags are properly closed
- [ ] All functions have proper return types
- [ ] Imports reference existing files and exports
- [ ] No commented-out code blocks remain
- [ ] Consistent naming conventions used
- [ ] No content from one file accidentally copied to another

### 6. Common Pitfalls to Avoid

#### File Content Mixing

**❌ WRONG:**
```typescript
// In inventoryService.ts
export const getInventoryItems = async () => {
  // Service logic...
};

// Accidentally adding React component code here
const MerchantRoutes: React.FC = () => {
  // Component logic that doesn't belong here
};
```

**✅ CORRECT:**
Keep services separate from components:
```typescript
// In inventoryService.ts
export const getInventoryItems = async () => {
  // Only service logic here
};

// In a separate MerchantRoutes.tsx file
const MerchantRoutes: React.FC = () => {
  // Component logic in its own file
};
```

#### Accidental Block Insertion

When editing multiple files, be careful not to paste content from file A into file B.

Use VSCode's split editor feature to prevent confusion between files.

### 7. Testing Strategy

- Test each layer in isolation before integration
- Create simple test pages for components before adding to main UI
- Use console logging liberally during development
- Verify route changes work as expected

## Tooling and Automation

Consider these tools to prevent errors:

- ESLint rules to enforce file organization
- Pre-commit hooks to run type checking
- IDE extensions that highlight file boundaries
- Automated tests to verify module functionality

## Documentation Requirements

For each new module:

- Update module status in documentation
- Document component props and requirements
- Add usage examples for reusable components
- Document data flow and state management

By following this workflow consistently across all modules, we can prevent errors like file content mixing and ensure a maintainable codebase.
