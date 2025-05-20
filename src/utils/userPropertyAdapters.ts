
import { EditUserData, NewUserData } from "@/types/user";

// This file provides adapter functions to help components work with both
// snake_case database fields and camelCase frontend properties

export const getUserFirstName = (userData: EditUserData): string => {
  return userData.first_name || '';
};

export const getUserLastName = (userData: EditUserData): string => {
  return userData.last_name || '';
};

export const getUserIsActive = (userData: EditUserData): boolean => {
  return userData.is_active;
};

export const getUserFullName = (userData: EditUserData): string => {
  return `${getUserFirstName(userData)} ${getUserLastName(userData)}`;
};

export const getNewUserFirstName = (userData: NewUserData): string => {
  return userData.first_name || '';
};

export const getNewUserLastName = (userData: NewUserData): string => {
  return userData.last_name || '';
};

// Function to properly update user data with snake_case
export const prepareUpdateUserData = (userData: Partial<EditUserData>): Record<string, any> => {
  const updateData: Record<string, any> = {};
  
  if (userData.first_name !== undefined) updateData.first_name = userData.first_name;
  if (userData.last_name !== undefined) updateData.last_name = userData.last_name;
  if (userData.is_active !== undefined) updateData.is_active = userData.is_active;
  if (userData.email !== undefined) updateData.email = userData.email;
  if (userData.role !== undefined) updateData.role = userData.role;
  if (userData.merchant_id !== undefined) updateData.merchant_id = userData.merchant_id;
  
  return updateData;
};
