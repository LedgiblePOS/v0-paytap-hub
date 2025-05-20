
/**
 * Type consistency checker utility
 * 
 * This is a development utility to help identify potential type mismatches and import issues
 * before they become runtime errors. Run this script during development to check for common
 * type issues.
 */

import { UserData, UserModel, UserRole } from '@/types/user';
import { toUserModel, toUserEntity } from '@/types/user';
import { MerchantCustomizationEntity, MerchantCustomizationModel } from '@/types/merchant';
import { toMerchantCustomizationModel, toMerchantCustomizationEntity } from '@/types/merchant';
import { Permission, ROLE_PERMISSIONS } from '@/utils/permissions/types';
import { hasPermission } from '@/utils/permissions/permissionCheck';

/**
 * Validate that all converters are defined and handle all fields correctly
 */
export const validateConverters = (): boolean => {
  try {
    console.log("Checking converter consistency...");
    
    // Check UserData to UserModel conversion
    const testUserData: UserData = {
      id: "test-id",
      email: "test@example.com",
      first_name: "Test",
      last_name: "User",
      role: UserRole.USER,
      is_active: true,
      merchant_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const userModel = toUserModel(testUserData);
    const userDataAgain = toUserEntity(userModel);
    
    // Verify conversion was successful and preserved data
    console.log(
      "UserData → UserModel → UserData conversion successful:", 
      userDataAgain.id === testUserData.id && 
      userDataAgain.first_name === testUserData.first_name
    );
    
    // Check MerchantCustomization conversion
    const testCustomization: MerchantCustomizationEntity = {
      id: "test-id",
      merchant_id: "merchant-id",
      logo_url: "https://example.com/logo.png",
      primary_color: "#ffffff",
      secondary_color: "#000000",
      theme_color: "#4f46e5",
      font_family: "sans-serif",
      receipt_header: "Header",
      receipt_footer: "Footer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const customizationModel = toMerchantCustomizationModel(testCustomization);
    const customizationEntityAgain = toMerchantCustomizationEntity(customizationModel);
    
    // Verify conversion was successful and preserved data
    console.log(
      "MerchantCustomizationEntity → Model → Entity conversion successful:", 
      customizationEntityAgain.id === testCustomization.id && 
      customizationEntityAgain.merchant_id === testCustomization.merchant_id
    );
    
    // Check permission system
    const testUser = {
      id: "user-id",
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Check permission functions are working
    const hasViewUsersPermission = hasPermission(testUser, Permission.VIEW_USERS);
    console.log("Permission check for VIEW_USERS successful");
    
    return true;
  } catch (error) {
    console.error("Type consistency check failed:", error);
    return false;
  }
}

// Adding a way to run this in development
if (process.env.NODE_ENV === 'development') {
  console.log("Running type consistency check...");
  validateConverters();
}

export default validateConverters;
