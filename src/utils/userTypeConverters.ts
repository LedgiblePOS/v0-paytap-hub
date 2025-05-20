
import { UserData, UserModel, EditUserData, UserRole } from '@/types';

/**
 * Converts a database user entity to a frontend user model
 */
export const mapUserDataToUserModel = (userData: UserData): UserModel => {
  return {
    id: userData.id,
    email: userData.email || '',
    firstName: userData.first_name,
    lastName: userData.last_name,
    role: userData.role as UserRole,
    isActive: userData.is_active,
    merchantId: userData.merchant_id,
    createdAt: userData.created_at,
    updatedAt: userData.updated_at
  };
};

/**
 * Converts a frontend user model to a database user entity
 */
export const mapUserModelToUserData = (userModel: UserModel): UserData => {
  return {
    id: userModel.id,
    email: userModel.email,
    first_name: userModel.firstName,
    last_name: userModel.lastName,
    role: userModel.role,
    is_active: userModel.isActive,
    merchant_id: userModel.merchantId,
    created_at: userModel.createdAt,
    updated_at: userModel.updatedAt
  };
};

/**
 * Batch conversion from user data to user models
 */
export const mapUserDataToUserModels = (userDataArray: UserData[]): UserModel[] => {
  return userDataArray.map(mapUserDataToUserModel);
};

/**
 * Converts user data or user model to edit user data
 */
export const mapToEditUserData = (user: UserData | UserModel): EditUserData => {
  if ('first_name' in user) {
    // It's UserData format
    return {
      id: user.id,
      email: user.email || '',
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role as UserRole,
      isActive: user.is_active,
      merchantId: user.merchant_id,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  } else {
    // It's UserModel format
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      merchantId: user.merchantId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
};

/**
 * Converts edit user data to user model
 */
export const mapEditUserDataToUserModel = (editData: EditUserData): UserModel => {
  return {
    id: editData.id,
    email: editData.email,
    firstName: editData.firstName,
    lastName: editData.lastName,
    role: editData.role,
    isActive: editData.isActive,
    merchantId: editData.merchantId,
    createdAt: editData.createdAt || new Date().toISOString(),
    updatedAt: editData.updatedAt || new Date().toISOString()
  };
};

/**
 * Converts edit user data to user data
 */
export const mapEditUserDataToUserData = (editData: EditUserData): UserData => {
  return {
    id: editData.id,
    email: editData.email,
    first_name: editData.firstName,
    last_name: editData.lastName,
    role: editData.role,
    is_active: editData.isActive,
    merchant_id: editData.merchantId,
    created_at: editData.createdAt || new Date().toISOString(),
    updated_at: editData.updatedAt || new Date().toISOString()
  };
};

/**
 * Type guard to check if object is in UserModel format
 */
export const isUserModel = (user: any): user is UserModel => {
  return user && 
    typeof user === 'object' && 
    'firstName' in user && 
    'lastName' in user && 
    'isActive' in user;
};

/**
 * Type guard to check if object is in UserData format
 */
export const isUserData = (user: any): user is UserData => {
  return user && 
    typeof user === 'object' && 
    'first_name' in user && 
    'last_name' in user && 
    'is_active' in user;
};
