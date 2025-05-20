import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/user';
import { useToast } from '@/hooks/use-toast';

/**
 * Repair merchant account by checking if they have the correct role and merchant ID
 * @param userEmail Email of the user to check/repair
 * @returns Object with success status and message
 */
export const repairMerchantAccount = async (userEmail: string): Promise<{ success: boolean, message: string }> => {
  try {
    // First get the user data
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', userEmail)
      .single();
    
    if (userError || !userData) {
      return { 
        success: false, 
        message: `Could not find user with email ${userEmail}` 
      };
    }
    
    // Check the user role
    if (userData.role !== UserRole.MERCHANT) {
      // Update to merchant role if needed
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: UserRole.MERCHANT })
        .eq('id', userData.id);
        
      if (updateError) {
        return {
          success: false,
          message: `Failed to update user role: ${updateError.message}`
        };
      }
    }
    
    // Check if merchant record exists
    const { data: merchantData, error: merchantError } = await supabase
      .from('merchants')
      .select('*')
      .eq('user_id', userData.id);
      
    if (merchantError) {
      return {
        success: false,
        message: `Error checking merchant data: ${merchantError.message}`
      };
    }
    
    // If no merchant record, create one
    if (!merchantData || merchantData.length === 0) {
      const { error: createError } = await supabase
        .from('merchants')
        .insert({
          user_id: userData.id,
          business_name: `${userData.first_name || 'New'}'s Business`,
          subscription_tier: 'STARTER',
          product_limit: 10,
          product_count: 0
        });
        
      if (createError) {
        return {
          success: false,
          message: `Failed to create merchant record: ${createError.message}`
        };
      }
      
      return {
        success: true,
        message: 'Created new merchant record for user'
      };
    }
    
    return {
      success: true,
      message: 'Merchant account is correctly set up'
    };
  } catch (error) {
    console.error("Error repairing merchant account:", error);
    return {
      success: false,
      message: `Unknown error: ${(error as Error).message}`
    };
  }
};

/**
 * Check if a user exists and has the super admin role
 * @param email Email to check
 * @returns Boolean indicating if the user exists as super admin
 */
export const validateSuperAdminAccount = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('email', email)
      .single();
      
    if (error || !data) {
      console.error("Error validating super admin account:", error);
      return false;
    }
    
    return data.role === UserRole.SUPER_ADMIN;
  } catch (error) {
    console.error("Exception validating super admin account:", error);
    return false;
  }
};

/**
 * Ensure a merchant exists for a user
 * @param userId The user ID to check
 * @returns Object containing success status and merchant ID if created
 */
export const ensureMerchantExists = async (userId: string): Promise<{
  success: boolean;
  merchantId?: string;
  message: string;
}> => {
  try {
    // First check if merchant already exists
    const { data: existingMerchant, error: fetchError } = await supabase
      .from('merchants')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (fetchError) {
      return {
        success: false,
        message: `Error checking merchant: ${fetchError.message}`
      };
    }
    
    if (existingMerchant) {
      return {
        success: true,
        merchantId: existingMerchant.id,
        message: 'Merchant record already exists'
      };
    }
    
    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      return {
        success: false,
        message: `Error fetching profile: ${profileError.message}`
      };
    }
    
    // Create new merchant record
    const { data: newMerchant, error: createError } = await supabase
      .from('merchants')
      .insert({
        user_id: userId,
        business_name: `${profile.first_name || 'New'}'s Business`,
        subscription_tier: 'STARTER',
        product_limit: 10,
        product_count: 0
      })
      .select('id')
      .single();
      
    if (createError) {
      return {
        success: false,
        message: `Failed to create merchant: ${createError.message}`
      };
    }
    
    return {
      success: true,
      merchantId: newMerchant.id,
      message: 'New merchant record created'
    };
  } catch (error) {
    console.error("Error ensuring merchant exists:", error);
    return {
      success: false,
      message: `Unknown error: ${(error as Error).message}`
    };
  }
};

/**
 * Helper function to log user in with fixed role if needed
 */
export const loginWithRoleCheck = async (email: string, password: string): Promise<{ success: boolean, message: string }> => {
  try {
    // Regular login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return {
        success: false,
        message: error.message
      };
    }
    
    if (!data.user) {
      return {
        success: false,
        message: "Login succeeded but no user returned"
      };
    }
    
    // Log user permissions for debugging
    const user = {
      id: data.user.id,
      email: data.user.email || '',
      role: (data.user.user_metadata.role as UserRole) || UserRole.USER,
      isActive: true,
      firstName: data.user.user_metadata.first_name,
      lastName: data.user.user_metadata.last_name,
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at
    };
    
    logUserPermissionDetails(user);
    
    return {
      success: true,
      message: "Login successful with role check"
    };
  } catch (error) {
    return {
      success: false,
      message: `Login failed: ${(error as Error).message}`
    };
  }
};

/**
 * Add this function to login forms to help users debug role issues
 */
export const addRoleCheckToLoginForm = () => {
  // Add this to login forms to check if account roles need repair
  const checkAccountCallback = async (email: string) => {
    if (email === 'sectscells@gmail.com') {
      const result = await repairMerchantAccount(email);
      if (result.success) {
        toast({
          title: "Account Verified",
          description: "Your merchant account is set up correctly",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Account Verification Issue",
          description: result.message,
        });
      }
    } else if (email === 'damionmiller.caricompanies@gmail.com') {
      const isValid = await validateSuperAdminAccount(email);
      toast({
        title: isValid ? "Admin Account Verified" : "Admin Account Issue",
        description: isValid 
          ? "Your super admin account is set up correctly" 
          : "Your account may not have super admin permissions",
        variant: isValid ? "default" : "destructive",
      });
    }
  };
  
  return { checkAccountCallback };
};
