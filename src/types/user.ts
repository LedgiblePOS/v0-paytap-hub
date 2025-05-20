
export enum UserRole {
  ADMIN = "admin",
  VENDOR = "vendor",
  CUSTOMER = "customer"
}

// Database entity type (snake_case)
export interface UserData {
  id: string;
  email: string; // Added missing field
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean; // Added missing field
  merchant_id?: string; // Added missing field
  created_at: string;
  updated_at: string;
}

// UI model type (camelCase)
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  merchantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditUserData {
  id: string;
  firstName: string; // Required in EditUserData
  lastName: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  merchantId?: string;
}

export interface UserTableRow extends User {
  actions?: React.ReactNode;
}

// Convert from database entity to UI model
export function toUserModel(userData: UserData): User {
  return {
    id: userData.id,
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userData.role as UserRole,
    isActive: userData.is_active,
    merchantId: userData.merchant_id,
    createdAt: userData.created_at,
    updatedAt: userData.updated_at
  };
}

// Convert from UI model to database entity
export function toUserData(user: User): UserData {
  return {
    id: user.id,
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    role: user.role,
    is_active: user.isActive,
    merchant_id: user.merchantId,
    created_at: user.createdAt,
    updated_at: user.updatedAt
  };
}

// Convert from UserData or User to EditUserData
export function toEditUserData(user: User | UserData): EditUserData {
  if ('firstName' in user) {
    // It's already a User (camelCase)
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      merchantId: user.merchantId
    };
  } else {
    // It's a UserData (snake_case)
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role as UserRole,
      isActive: user.is_active,
      merchantId: user.merchant_id
    };
  }
}
