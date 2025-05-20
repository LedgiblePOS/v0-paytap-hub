
# Authentication & Authorization Best Practices

This document outlines best practices for implementing authentication and authorization in our application.

## Authentication Principles

### 1. Token-based Authentication

We use JWT tokens with Supabase for authentication:

```typescript
// Token validation
const { data, error } = await supabase.auth.getUser(token);
```

Best practices:
- Store tokens securely (preferably in memory or secure storage)
- Implement automatic token refresh
- Set appropriate expiration times
- Clear tokens on logout

### 2. Session Management

Our session system includes:
- Automatic session timeout for inactivity
- Grace period with warning before timeout
- Session refresh on activity
- Audit logging for session events

Implementation:
```typescript
// Session timeout warning
const showTimeoutWarning = () => {
  setWarningShown(true);
  const warningDuration = 2 * 60; // 2 minutes warning
  setRemainingTime(warningDuration);
  // ... warning implementation
};
```

## Authorization Framework

### 1. Role-Based Access Control (RBAC)

User roles determine base permissions:

```typescript
export const verifyRole = (user: User | null, requiredRoles: UserRole[]): boolean => {
  if (!user) return false;
  return requiredRoles.includes(user.role);
};
```

### 2. Permission-Based Access Control

Fine-grained permissions supplement roles:

```typescript
export const authorizeAction = async (
  user: User | null,
  requiredPermissions: Permission[],
  resourceId?: string
): Promise<void> => {
  // ... authorization logic
};
```

### 3. Resource-Level Authorization

For operations on specific resources:

```typescript
// Check if user has access to specific resource
hasPermission(user, permission, resourceId);
```

## Security Event Logging

All authentication and authorization events should be logged:

```typescript
await enhancedAuditService.logSecurityEvent({
  action: 'UNAUTHORIZED_ACCESS',
  description: `User attempted to access resource requiring permissions: ${permissions.join(', ')}`,
  userId: user.id,
  severity: AuditSeverity.WARNING,
  metadata: { resourceId, requiredPermissions }
});
```

## Common Authentication Errors and Solutions

### 1. Type Errors in Auth Functions

Problem: Missing required properties in security event objects.

Solution: Create factory functions or type guards:

```typescript
function createSecurityEvent(
  action: string,
  description: string,
  userId: string | null,
  severity: AuditSeverity,
  metadata?: Record<string, any>
): SecurityEvent {
  return { action, description, userId, severity, metadata };
}
```

### 2. Role Type Mismatches

Problem: String values not matching UserRole enum.

Solution: Use explicit type validation:

```typescript
function isValidUserRole(role: string): role is UserRole {
  return ['SUPER_ADMIN', 'MERCHANT', 'USER'].includes(role);
}
```

## Authentication Testing

Best practices for testing authentication:

1. Mock authentication services in tests
2. Test both successful and failed auth scenarios
3. Verify proper error handling
4. Test session timeout behavior
5. Test permission validation logic

## Security Checklist

For each authenticated endpoint:

- [ ] Proper token validation
- [ ] Role and permission checks
- [ ] Rate limiting implementation
- [ ] CSRF protection
- [ ] Audit logging
- [ ] Error handling without information leakage
