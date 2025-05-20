
import { supabase } from "@/integrations/supabase/client";
import { User, UserRole } from "@/types";
import enhancedAuditService, { AuditSeverity } from "@/services/enhancedAuditService";

/**
 * Validate JWT token and extract user information
 */
export const validateToken = async (token: string): Promise<User | null> => {
  if (!token) {
    return null;
  }
  
  try {
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return null;
    }
    
    // Fetch user profile data
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
      
    if (!profileData) {
      return null;
    }
    
    // Construct user object with correct type
    return {
      id: data.user.id,
      email: data.user.email || '',
      first_name: profileData.first_name || '',
      last_name: profileData.last_name || '',
      role: profileData.role as UserRole, // Add type assertion to ensure UserRole type
      created_at: profileData.created_at || new Date().toISOString(),
      updated_at: profileData.updated_at || new Date().toISOString(),
    };
  } catch (error) {
    enhancedAuditService.logSecurityEvent({
      action: 'TOKEN_VALIDATION_ERROR',
      description: 'Error validating token',
      userId: null,
      severity: AuditSeverity.WARNING,
      metadata: { error: String(error) }
    });
    
    return null;
  }
};

/**
 * Check if a token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Extract payload from JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    // Check expiration
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    // If token can't be parsed, consider it expired
    return true;
  }
};

/**
 * Refresh token if it's about to expire
 */
export const refreshTokenIfNeeded = async (): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return null;
    }
    
    // Calculate expiry time
    const expiresAt = new Date(session.expires_at || 0);
    const thirtyMinutesFromNow = new Date(Date.now() + 30 * 60 * 1000);
    
    // If token expires in less than 30 minutes, refresh it
    if (expiresAt < thirtyMinutesFromNow) {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        return null;
      }
      
      return data.session.access_token;
    }
    
    return session.access_token;
  } catch (error) {
    return null;
  }
};
