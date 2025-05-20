
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/user';
import { ProfileEntity } from '@/types/profiles';
import { toast } from '@/hooks/use-toast';

/**
 * Custom hook for authentication operations
 */
const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  
  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('[useAuthOperations] Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('[useAuthOperations] Login error:', error);
        throw error;
      }

      // Fetch user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('[useAuthOperations] Profile fetch error:', profileError);
        throw profileError;
      }

      // Ensure profile is properly typed
      const profileData = profile as ProfileEntity;
      
      // Fetch merchant data if user is a merchant
      let merchantData = null;
      if (profileData && profileData.role === 'MERCHANT') {
        const { data: merchant, error: merchantError } = await supabase
          .from('merchants')
          .select('*')
          .eq('user_id', data.user.id)
          .maybeSingle();
          
        if (!merchantError && merchant) {
          merchantData = merchant;
        }
      }
      
      console.log('[useAuthOperations] Login successful, profile:', profileData);

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
          merchantId: merchantData?.id || null,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at
        } as User,
      };
    } catch (error: any) {
      console.error("[useAuthOperations] Authentication error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Register a new user with email and password
   */
  const register = async (email: string, password: string, firstName?: string, lastName?: string, role?: string) => {
    try {
      setLoading(true);
      console.log('[useAuthOperations] Registering new user:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || '',
            last_name: lastName || '',
            role: role || 'MERCHANT',
          },
        },
      });
      
      if (error) {
        console.error('[useAuthOperations] Register error:', error);
        throw error;
      }
      
      // Create merchant record if role is MERCHANT
      if (data?.user && (role === 'MERCHANT' || !role)) {
        try {
          const { error: merchantError } = await supabase
            .from('merchants')
            .insert({
              user_id: data.user.id,
              business_name: `${firstName || 'New'}'s Business`,
              subscription_tier: 'STARTER'
            });
            
          if (merchantError) {
            console.error('[useAuthOperations] Failed to create merchant record:', merchantError);
            // Non-blocking error - don't throw
          }
        } catch (err) {
          console.error('[useAuthOperations] Error creating merchant record:', err);
          // Non-blocking error - don't throw
        }
      }
      
      console.log('[useAuthOperations] Registration successful');
      return data;
    } catch (error: any) {
      console.error("[useAuthOperations] Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Logout the current user
   */
  const logout = async () => {
    try {
      setLoading(true);
      console.log('[useAuthOperations] Logging out user');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[useAuthOperations] Logout error:', error);
        throw error;
      }
      
      console.log('[useAuthOperations] Logout successful');
      return true;
    } catch (error: any) {
      console.error("[useAuthOperations] Logout error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password for an email
   */
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      console.log('[useAuthOperations] Requesting password reset for:', email);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        console.error('[useAuthOperations] Reset password error:', error);
        throw error;
      }
      
      console.log('[useAuthOperations] Password reset email sent');
      return true;
    } catch (error: any) {
      console.error("[useAuthOperations] Reset password error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    login,
    register,
    logout,
    resetPassword,
    loading
  };
};

export default useAuthOperations;
