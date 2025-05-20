
import { UserData, User, EditUserData } from '@/types/user';
import { UserRole } from '@/types/enums';

/**
 * Converts UserData (snake_case) to User (camelCase)
 */
export const convertToUserModel = (userData: UserData | any): User => {
  if (!userData) return null as unknown as User;
  
  return {
    id: userData.id || '',
    email: userData.email || '',
    firstName: userData.first_name || userData.firstName || '',
    lastName: userData.last_name || userData.lastName || '',
    role: userData.role || UserRole.USER,
    isActive: userData.is_active !== undefined ? userData.is_active : 
             userData.isActive !== undefined ? userData.isActive : true,
    merchantId: userData.merchant_id || userData.merchantId || null,
    createdAt: userData.created_at || userData.createdAt || new Date().toISOString(),
    updatedAt: userData.updated_at || userData.updatedAt || new Date().toISOString()
  };
};

/**
 * Converts User (camelCase) to UserData (snake_case)
 */
export const convertToUserData = (user: User | any): UserData => {
  if (!user) return null as unknown as UserData;
  
  return {
    id: user.id || '',
    email: user.email || '',
    first_name: user.firstName || user.first_name || '',
    last_name: user.lastName || user.last_name || '',
    role: user.role || UserRole.USER,
    is_active: user.isActive !== undefined ? user.isActive : 
              user.is_active !== undefined ? user.is_active : true,
    merchant_id: user.merchantId || user.merchant_id || null,
    created_at: user.createdAt || user.created_at || new Date().toISOString(),
    updated_at: user.updatedAt || user.updated_at || new Date().toISOString()
  };
};

/**
 * Converts UserData/User to EditUserData
 */
export const convertToEditUserData = (user: UserData | User | any): EditUserData => {
  if (!user) return null as unknown as EditUserData;

  return {
    id: user.id || '',
    email: user.email || '',
    firstName: user.firstName || user.first_name || '',
    lastName: user.lastName || user.last_name || '',
    role: user.role || UserRole.USER,
    isActive: user.isActive !== undefined ? user.isActive : 
             user.is_active !== undefined ? user.is_active : true,
    first_name: user.first_name || user.firstName || '',
    last_name: user.last_name || user.lastName || '',
    is_active: user.is_active !== undefined ? user.is_active : 
              user.isActive !== undefined ? user.isActive : true,
    merchantId: user.merchantId || user.merchant_id || null,
    merchant_id: user.merchant_id || user.merchantId || null
  };
};

/**
 * Type guards to check the format of user objects
 */
export const isUserData = (user: any): user is UserData => {
  return user && typeof user === 'object' && 'first_name' in user && 'last_name' in user;
};

export const isUserModel = (user: any): user is User => {
  return user && typeof user === 'object' && 'firstName' in user && 'lastName' in user;
};

/**
 * Helper function to ensure we have User format
 */
export const ensureUserModel = (user: UserData | User | any): User => {
  if (isUserModel(user)) return user;
  return convertToUserModel(user);
};

/**
 * Helper function to ensure we have UserData format
 */
export const ensureUserData = (user: UserData | User | any): UserData => {
  if (isUserData(user)) return user;
  return convertToUserData(user);
};

/**
 * Convert array of users
 */
export const convertToUserModels = (users: UserData[] | any[]): User[] => {
  return users.map(convertToUserModel);
};

export const convertToUserDatas = (users: User[] | any[]): UserData[] => {
  return users.map(convertToUserData);
};
