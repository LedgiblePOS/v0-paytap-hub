
# Application Documentation

## Type System

This application uses a consistent Entity-Model pattern for handling data between the database (snake_case) and UI (camelCase) layers. See `TYPE_SYSTEM_GUIDE.md` for details.

## Authentication

The authentication system is built on Supabase and provides role-based access control. See `AUTH_TYPE_HANDLING.md` for guidance on working with authentication.

## Common Error Prevention

Review these guides to prevent common errors:

- `PREVENTING_BUILD_ERRORS.md` - Tips to prevent build errors
- `TYPESCRIPT_IMPORT_PATTERNS.md` - Best practices for imports
- `TYPE_CONVERSION_SOLUTION.md` - Solutions for type conversion issues

## Working with Components

- `EXPORT_IMPORT_BEST_PRACTICES.md` - Guidelines for consistent exports and imports
- `COMPONENT_IMPORT_FIXING_ERRORS.md` - How to fix component import errors
- `TYPESCRIPT_ERROR_RESOLUTION_GUIDE.md` - Structured approach to fixing TypeScript errors

## Getting Started

1. Start by understanding the Entity-Model pattern in `TYPE_SYSTEM_GUIDE.md`
2. Reference specific guides when encountering issues
3. Follow consistent patterns for new code
4. When in doubt, use conversion utilities to transform data between formats

## Troubleshooting

If you encounter issues:

1. Check import paths and export statements
2. Verify correct conversion between UserData and UserModel types
3. Ensure enum values are imported from a single source
4. Review component props carefully for type expectations

By following these guidelines, you can maintain a consistent, type-safe codebase.
