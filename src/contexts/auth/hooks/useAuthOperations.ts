
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/user';
import { ProfileEntity } from '@/types/profiles';

interface AuthOperationsReturn {
  isLoading: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  logout: () => Promise<any>;
  signUp: () => Promise<any>;
  register: () => Promise<any>;
  resetUserPassword: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updateUserProfile: () => Promise<any>;
  updateProfile: (data: Partial<User>) => Promise<any>;
}

export const useAuthOperations = (): AuthOperationsReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;

      // Ensure profile is properly typed
      const profileData = profile as ProfileEntity;

      // Return the combined user and profile data
      return {
        user: data.user,
        profile: {
          id: profileData.id,
          firstName: profileData.first_name || '',
          lastName: profileData.last_name || '',
          email: data.user.email || '',
          role: profileData.role as UserRole,
          isActive: profileData.is_active !== false,
          merchantId: profileData.merchant_id || null,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at
        } as User,
      };
    } catch (error: any) {
      console.error("Authentication error:", error);
      return { user: null, profile: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        return { success: false, error: signOutError.message };
      }
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during sign out';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // Add resetPassword method since it's referenced in AuthProvider
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Add updateProfile method referenced in AuthProvider
  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // Convert camelCase to snake_case for database
      const profileData: Record<string, any> = {};
      if (userData.firstName !== undefined) profileData.first_name = userData.firstName;
      if (userData.lastName !== undefined) profileData.last_name = userData.lastName;
      if (userData.role !== undefined) profileData.role = userData.role;
      if (userData.isActive !== undefined) profileData.is_active = userData.isActive;
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userData.id);
        
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    loading: isLoading, // For backward compatibility
    signIn,
    login: signIn, // Alias for backward compatibility
    signOut,
    logout: signOut, // Alias for backward compatibility
    signUp: async () => ({}), // Placeholder
    register: async () => ({}), // Placeholder
    resetUserPassword: async () => ({}), // Placeholder
    resetPassword, // Implemented method
    updateUserProfile: async () => ({}), // Placeholder
    updateProfile, // Implemented method
  };
};

export default useAuthOperations;
