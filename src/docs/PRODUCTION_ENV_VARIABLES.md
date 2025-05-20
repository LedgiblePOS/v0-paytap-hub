
# Production Environment Variables Guide

This guide outlines the environment variables required for deploying the application to production.

## Required Environment Variables

The following environment variables are required for production deployment:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APP_ENV` | Current environment | `production` |
| `VITE_API_URL` | Base URL for API requests | `https://api.example.com` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `VITE_LOG_LEVEL` | Minimum log level to capture | `error` |

## Feature Flags

Feature flags can be enabled or disabled via environment variables:

| Variable | Description | Values |
|----------|-------------|--------|
| `VITE_FEATURE_NEW_DASHBOARD` | Enable new dashboard UI | `true` or `false` |
| `VITE_FEATURE_ADVANCED_ANALYTICS` | Enable advanced analytics features | `true` or `false` |

## Monitoring Configuration

Environment variables for monitoring and error tracking:

| Variable | Description | Values |
|----------|-------------|--------|
| `VITE_MONITORING_ENABLED` | Enable application monitoring | `true` or `false` |
| `VITE_MONITORING_SAMPLE_RATE` | Percentage of events to sample (0.01-1.0) | `0.1` |
| `VITE_ERROR_REPORTING_ENABLED` | Send error reports to monitoring services | `true` or `false` |

## Payment Gateway Configuration

For production payment processing:

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_PAYMENT_GATEWAY_URL` | URL for payment gateway API | `https://api.paymentprovider.com` |
| `VITE_PAYMENT_WEBHOOK_URL` | Webhook URL for payment callbacks | `https://yourapp.com/api/payment-webhook` |

## Performance Optimization

Variables for performance tuning:

| Variable | Description | Values |
|----------|-------------|--------|
| `VITE_ENABLE_QUERY_CACHING` | Enable React Query caching | `true` or `false` |
| `VITE_QUERY_STALE_TIME` | Time in ms before data is considered stale | `60000` |
| `VITE_QUERY_CACHE_TIME` | Time in ms to keep unused data in cache | `300000` |
| `VITE_ENABLE_LAZY_LOADING` | Enable component lazy loading | `true` or `false` |

## Environment-Specific Configuration

The following environment files should be maintained:

1. `.env.development` - Development environment configuration
2. `.env.staging` - Staging environment configuration 
3. `.env.production` - Production environment configuration

## Setting Environment Variables in Deployment Platforms

### Vercel

```bash
# CLI setup
vercel env add VITE_APP_ENV production
vercel env add VITE_API_URL https://api.example.com
# Additional variables...
```

### Netlify

Environment variables can be set in the Netlify UI under:
Settings > Build & Deploy > Environment

Or using netlify.toml:

```toml
[context.production.environment]
  VITE_APP_ENV = "production"
  VITE_API_URL = "https://api.example.com"
  # Additional variables...
```

### Docker

When deploying with Docker, set environment variables in your Dockerfile:

```dockerfile
ENV VITE_APP_ENV=production
ENV VITE_API_URL=https://api.example.com
# Additional variables...
```

Or pass them when running the container:

```bash
docker run -e VITE_APP_ENV=production -e VITE_API_URL=https://api.example.com your-image
```

## Validating Environment Variables

Before deploying to production, ensure all required environment variables are set:

```typescript
// src/utils/validateEnv.ts
export function validateEnv() {
  const requiredEnvVars = [
    'VITE_API_URL',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missing = requiredEnvVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
}
```

## Secrets Management

Never commit sensitive environment variables to source control. Use your deployment platform's secrets management system to securely store and provide these values during deployment.

## Rotating Credentials

Regular rotation of API keys and secrets is recommended. Update your environment variables according to this schedule:

1. Generate new credentials
2. Deploy the new credentials alongside the existing ones
3. Verify functionality with the new credentials
4. Remove the old credentials
