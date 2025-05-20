import { UserRole } from '@/types/enums';

// Define the Permission enum here to resolve the import issue
export enum Permission {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
  ADMIN = 'ADMIN',
  
  // User permissions
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USER = 'CREATE_USER',
  EDIT_USER = 'EDIT_USER',
  DELETE_USER = 'DELETE_USER',
  MANAGE_USERS = 'MANAGE_USERS',
  
  // Additional permissions as needed
  // ... other permissions
  VIEW_DASHBOARD = 'VIEW_DASHBOARD',
  VIEW_REPORTS = 'VIEW_REPORTS',
  EDIT_SETTINGS = 'EDIT_SETTINGS',
  MANAGE_PRODUCTS = 'MANAGE_PRODUCTS',
  PROCESS_PAYMENTS = 'PROCESS_PAYMENTS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_MERCHANTS = 'MANAGE_MERCHANTS',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  VIEW_INVENTORY = 'VIEW_INVENTORY',
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  VIEW_SYSTEM_SETTINGS = 'VIEW_SYSTEM_SETTINGS',
  VERIFY_MERCHANT = 'VERIFY_MERCHANT'
}

// Define role-based permissions
const rolePermissions = {
  [UserRole.SUPER_ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.MANAGE_USERS,
    Permission.VIEW_REPORTS,
    Permission.EDIT_SETTINGS,
    Permission.MANAGE_PRODUCTS,
    Permission.PROCESS_PAYMENTS,
    Permission.VIEW_ANALYTICS,
    Permission.MANAGE_MERCHANTS,
    Permission.SYSTEM_ADMIN,
    Permission.CREATE_USER,
    Permission.VIEW_USERS,
    Permission.EDIT_USER,
    Permission.DELETE_USER,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_SYSTEM_SETTINGS,
    Permission.VERIFY_MERCHANT
  ],
  [UserRole.ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.MANAGE_USERS,
    Permission.VIEW_REPORTS,
    Permission.EDIT_SETTINGS,
    Permission.MANAGE_PRODUCTS,
    Permission.PROCESS_PAYMENTS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_SETTINGS
  ],
  [UserRole.MERCHANT]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_REPORTS,
    Permission.MANAGE_PRODUCTS,
    Permission.PROCESS_PAYMENTS,
    Permission.VIEW_INVENTORY
  ],
  [UserRole.STAFF]: [
    Permission.VIEW_DASHBOARD,
    Permission.PROCESS_PAYMENTS,
    Permission.VIEW_INVENTORY
  ],
  [UserRole.USER]: [
    Permission.VIEW_DASHBOARD
  ],
  [UserRole.CUSTOMER]: [
    // Minimal permissions for customers
  ]
};

// Check if a role has a specific permission
export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  if (!role || !permission) return false;
  return rolePermissions[role]?.includes(permission) || false;
};

// Get all permissions for a role
export const getRolePermissions = (role: UserRole): Permission[] => {
  if (!role) return [];
  return rolePermissions[role] || [];
};

// Additional functions needed by authApi
export const checkUserPermission = hasPermission;
export const hasRequiredRole = (role: UserRole, requiredRole: UserRole): boolean => {
  return role === requiredRole;
};
export const hasMinimumRole = (role: UserRole, minimumRole: UserRole): boolean => {
  return getRolePriority(role) >= getRolePriority(minimumRole);
};
export const getRolePriority = (role: UserRole): number => {
  const priorities = {
    [UserRole.SUPER_ADMIN]: 5,
    [UserRole.ADMIN]: 4,
    [UserRole.MERCHANT]: 3,
    [UserRole.STAFF]: 2,
    [UserRole.USER]: 1,
    [UserRole.CUSTOMER]: 0
  };
  return priorities[role] || 0;
};

export default { hasPermission, getRolePermissions };
