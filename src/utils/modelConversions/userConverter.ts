
import { User, UserData, UserRole } from '@/types/user';

/**
 * Converts database user data (snake_case) to frontend user model (camelCase)
 */
export const toUserModel = (userData: UserData): User => {
  return {
    id: userData.id,
    firstName: userData.first_name || userData.firstName || '',
    lastName: userData.last_name || userData.lastName || '',
    email: userData.email,
    role: userData.role,
    isActive: userData.is_active !== undefined ? userData.is_active : 
              userData.isActive !== undefined ? userData.isActive : true,
    merchantId: userData.merchant_id || userData.merchantId || null,
    merchantName: userData.merchant_name || userData.merchantName || null,
    createdAt: userData.created_at || userData.createdAt || new Date().toISOString(),
    updatedAt: userData.updated_at || userData.updatedAt || new Date().toISOString()
  };
};

/**
 * Converts frontend user model (camelCase) to database user data (snake_case)
 */
export const toUserData = (user: User): UserData => {
  return {
    id: user.id,
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    role: user.role,
    is_active: user.isActive,
    merchant_id: user.merchantId || null,
    merchant_name: user.merchantName || null,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    // Also add camelCase versions for compatibility
    firstName: user.firstName,
    lastName: user.lastName,
    isActive: user.isActive,
    merchantId: user.merchantId || null,
    merchantName: user.merchantName || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};

/**
 * Batch conversions
 */
export const toUserModels = (userDataArray: UserData[]): User[] => {
  return userDataArray.map(toUserModel);
};

export const toUserDatas = (userModels: User[]): UserData[] => {
  return userModels.map(toUserData);
};

// For backward compatibility
export const toUserEntities = toUserDatas;
