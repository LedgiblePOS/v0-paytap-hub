
import { User, UserRole } from '@/types/user';

// Type for user data from database (snake_case)
export interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  merchant_id?: string | null;
  created_at: string;
  updated_at?: string;
}

export type EditUserData = UserData;

/**
 * Converts database user data (snake_case) to frontend user model (camelCase)
 */
export const toUserModel = (userData: UserData): User => {
  return {
    id: userData.id,
    email: userData.email,
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userData.role as UserRole,
    isActive: userData.is_active,
    merchantId: userData.merchant_id || null,
    createdAt: userData.created_at,
    updatedAt: userData.updated_at || userData.created_at,
  };
};

/**
 * Converts frontend user model (camelCase) to database user data (snake_case)
 */
export const toUserData = (userModel: User): UserData => {
  return {
    id: userModel.id,
    email: userModel.email,
    first_name: userModel.firstName,
    last_name: userModel.lastName,
    role: userModel.role,
    is_active: userModel.isActive,
    merchant_id: userModel.merchantId || null,
    created_at: userModel.createdAt,
    updated_at: userModel.updatedAt
  };
};

export const toUserModels = (userData: UserData[]): User[] => {
  return userData.map(toUserModel);
};

export const toUserDatas = (userModels: User[]): UserData[] => {
  return userModels.map(toUserData);
};
