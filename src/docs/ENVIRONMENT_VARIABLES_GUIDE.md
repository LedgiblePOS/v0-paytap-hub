
# Environment Variables Guide

This document provides a comprehensive guide for managing environment variables across different deployment environments.

## Environment Variables Structure

Our application uses the following environment variables structure:

```
VITE_API_URL=https://api.example.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Environment Variable Configurations

### Local Development Environment

For local development, you should:
1. Use Supabase's native secrets integration for local development
2. Set default values in your code when appropriate

### Staging Environment

For staging deployment, configure these variables in your staging environment:

```
VITE_API_URL=https://staging-api.example.com
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=staging-anon-key
VITE_APP_ENV=staging
```

### Production Environment

For production deployment, configure these variables in your production environment:

```
VITE_API_URL=https://api.example.com
VITE_SUPABASE_URL=https://production-project.supabase.co
VITE_SUPABASE_ANON_KEY=production-anon-key
VITE_APP_ENV=production
```

## Required Environment Variables

The following environment variables are required for the application to function properly:

| Variable | Description | Required | Example Value |
|----------|-------------|----------|--------------|
| `VITE_API_URL` | Base URL for API requests | Yes | `https://api.example.com` |
| `VITE_SUPABASE_URL` | Supabase project URL | Yes | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key | Yes | `eyJhbGciOiJIUzI1...` |
| `VITE_APP_ENV` | Current environment | No | `development`, `staging`, or `production` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | No | `true` or `false` |
| `VITE_LOG_LEVEL` | Logging verbosity | No | `debug`, `info`, `warn`, or `error` |

## Environment Variable Usage in Code

Use environment variables in your code like this:

```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_URL;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use with fallback values
const logLevel = import.meta.env.VITE_LOG_LEVEL || 'info';
const isProduction = import.meta.env.VITE_APP_ENV === 'production';

// Initialize services with environment variables
const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Feature Flags

Use environment variables for feature flags:

```typescript
// Feature flag usage
const isNewFeatureEnabled = import.meta.env.VITE_ENABLE_NEW_FEATURE === 'true';

// Conditional rendering based on feature flags
{isNewFeatureEnabled && <NewFeatureComponent />}
```

## Environment Detection

Detect the current environment:

```typescript
// Environment detection helper
export const getEnvironment = () => {
  return import.meta.env.VITE_APP_ENV || 'development';
};

export const isProduction = () => getEnvironment() === 'production';
export const isStaging = () => getEnvironment() === 'staging';
export const isDevelopment = () => getEnvironment() === 'development';
```

## Configuring CI/CD Pipeline

Our deployment workflow uses GitHub Actions to securely manage environment variables:

1. **Setting Environment Variables in GitHub Actions**

   ```yaml
   jobs:
     deploy:
       runs-on: ubuntu-latest
       env:
         VITE_API_URL: ${{ secrets.API_URL }}
         VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
         VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
       steps:
         # Deployment steps
   ```

2. **Environment-Specific Variables**

   ```yaml
   jobs:
     deploy-production:
       if: github.ref == 'refs/heads/main'
       environment: production
       # Environment variables from production environment

     deploy-staging:
       if: github.ref == 'refs/heads/staging'
       environment: staging
       # Environment variables from staging environment
   ```

## Security Best Practices

1. **Never commit sensitive environment variables to source control**
2. **Use GitHub Secrets or other secure stores for sensitive values**
3. **Limit access to production environment variables**
4. **Rotate keys and secrets regularly**
5. **Use different keys for different environments**
6. **Audit environment variable access**

## Troubleshooting

If your environment variables aren't working:

1. Verify they are properly set in your deployment environment
2. Check that they are prefixed with `VITE_` (required for client-side access)
3. Confirm they are being properly injected during the build process
4. Check for typos in variable names
5. Verify the correct environment is being detected

Following these guidelines ensures secure and consistent environment variable management across all deployment environments.
