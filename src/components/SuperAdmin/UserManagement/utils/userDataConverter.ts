
import { UserData, UserRole, User, EditUserData } from '@/types';

// Add NewUserData interface for CreateUserDialog
export interface NewUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
}

export const toEditUserData = (userData: UserData | User): EditUserData => {
  return {
    id: 'id' in userData ? userData.id : '',
    email: 'email' in userData ? userData.email : '',
    firstName: 'first_name' in userData ? userData.first_name : 
               'firstName' in userData ? userData.firstName : '',
    lastName: 'last_name' in userData ? userData.last_name :
              'lastName' in userData ? userData.lastName : '',
    role: ('role' in userData ? userData.role : UserRole.MERCHANT) as UserRole,
    isActive: 'is_active' in userData ? userData.is_active :
              'isActive' in userData ? userData.isActive : true,
    merchantId: 'merchantId' in userData ? userData.merchantId : 
                'merchant_id' in userData ? userData.merchant_id : null,
    createdAt: 'created_at' in userData ? userData.created_at :
               'createdAt' in userData ? userData.createdAt : new Date().toISOString(),
    updatedAt: 'updated_at' in userData ? userData.updated_at :
               'updatedAt' in userData ? userData.updatedAt : new Date().toISOString()
  };
};

export const toUserData = (editData: EditUserData): Partial<UserData> => {
  return {
    id: editData.id,
    email: editData.email,
    first_name: editData.firstName,
    last_name: editData.lastName,
    role: editData.role,
    is_active: editData.isActive,
    merchant_id: editData.merchantId,
    created_at: editData.createdAt || new Date().toISOString(),
    updated_at: editData.updatedAt || new Date().toISOString(),
    // Also add camelCase versions
    firstName: editData.firstName,
    lastName: editData.lastName,
    isActive: editData.isActive,
    merchantId: editData.merchantId,
    createdAt: editData.createdAt || new Date().toISOString(),
    updatedAt: editData.updatedAt || new Date().toISOString()
  };
};

export const toUserModel = (userData: UserData): User => {
  return {
    id: userData.id,
    email: userData.email,
    firstName: userData.first_name || userData.firstName || '',
    lastName: userData.last_name || userData.lastName || '',
    role: userData.role as UserRole,
    isActive: userData.is_active !== undefined ? userData.is_active : 
              userData.isActive !== undefined ? userData.isActive : true,
    createdAt: userData.created_at || userData.createdAt || new Date().toISOString(),
    updatedAt: userData.updated_at || userData.updatedAt || new Date().toISOString(),
    merchantId: userData.merchant_id || userData.merchantId || null,
    merchantName: userData.merchant_name || userData.merchantName || null
  };
};

// Add mapping functions for EditUserData
export const mapToEditUserData = toEditUserData;
export const mapEditUserDataToUserData = toUserData;

// Re-export types for convenience
export type { UserData, EditUserData };
