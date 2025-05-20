
# Production Deployment Guide

This guide outlines the step-by-step process for deploying the application to production environments.

## Hosting Configuration

We recommend a combination of Vercel for frontend hosting and Supabase for backend services.

### Frontend Deployment (Vercel)

1. **Initial Setup**
   - Connect your GitHub repository to Vercel
   - Configure build settings:
     ```
     Build Command: npm run build
     Output Directory: dist
     Install Command: npm install
     ```

2. **Environment Variables**
   - Set the following environment variables in Vercel:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

3. **Domain Configuration**
   - Set up a custom domain in Vercel settings
   - Configure DNS settings with your domain provider
   - Enable HTTPS and automatic SSL certificate renewal

### Backend Configuration (Supabase)

1. **Project Setup**
   - Upgrade to a Production tier Supabase project
   - Configure database backups (daily with 7-day retention)
   - Enable Point-in-Time Recovery

2. **Security Configuration**
   - Verify all Row Level Security policies
   - Set up IP allow lists for database access
   - Enable SSL enforcement for all connections

## CI/CD Pipeline Setup

### GitHub Actions Configuration

Create a file at `.github/workflows/ci-cd.yml` with the following content:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint

  build:
    needs: [test, lint]
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Backup Strategy

### Database Backups

1. **Automated Backups**
   - Enable daily backups in Supabase
   - Set retention period to at least 7 days
   - Test restoration process quarterly

2. **Manual Backup Procedure**
   - Export database using Supabase dashboard
   - Store exports in secure cloud storage
   - Document the restoration process

### Code and Configuration Backups

1. **Source Code**
   - Maintain GitHub repository with protected main branch
   - Create tagged releases for each production deployment

2. **Environment Configuration**
   - Regularly export and securely store environment variables
   - Document all external service integrations

## Monitoring Setup

1. **Application Monitoring**
   - Set up Sentry for error tracking
   - Configure alerts for critical errors
   - Implement performance monitoring

2. **Infrastructure Monitoring**
   - Monitor Supabase database performance
   - Set up alerts for high resource usage
   - Configure uptime monitoring for frontend

## Scaling Considerations

1. **Horizontal Scaling**
   - Configure Vercel for automatic scaling
   - Implement database connection pooling
   - Use edge caching for static assets

2. **Database Scaling**
   - Monitor database performance metrics
   - Set up read replicas for reporting queries
   - Plan for database sharding if needed
