
import { UserData, EditUserData, UserRole } from '@/types/user';

export const toEditUserData = (userData: UserData): EditUserData => {
  return {
    id: userData.id,
    email: userData.email,
    firstName: userData.first_name || userData.firstName || '',
    lastName: userData.last_name || userData.lastName || '',
    role: userData.role,
    isActive: userData.is_active !== undefined ? userData.is_active : 
              userData.isActive !== undefined ? userData.isActive : false,
    merchantId: userData.merchant_id || userData.merchantId || null
  };
};

export const toUserData = (editUserData: EditUserData): UserData => {
  return {
    id: editUserData.id,
    email: editUserData.email,
    first_name: editUserData.firstName || '',
    last_name: editUserData.lastName || '',
    role: editUserData.role,
    is_active: editUserData.isActive || false,
    merchant_id: editUserData.merchantId || null,
    firstName: editUserData.firstName || '',
    lastName: editUserData.lastName || '',
    isActive: editUserData.isActive || false,
    merchantId: editUserData.merchantId || null,
    created_at: editUserData.createdAt || new Date().toISOString(),
    updated_at: editUserData.updatedAt || new Date().toISOString(),
    createdAt: editUserData.createdAt || new Date().toISOString(),
    updatedAt: editUserData.updatedAt || new Date().toISOString()
  };
};
