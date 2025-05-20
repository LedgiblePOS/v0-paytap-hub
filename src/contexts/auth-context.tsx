
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserRole } from '@/types/user';
import { AuthContextProps } from '@/types/auth';

// Create the context with proper initial value
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    console.error('useAuth was called outside of AuthProvider - this is a critical error');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Effect to handle auth state changes
  useEffect(() => {
    // Track the active session
    let activeSession = false;

    console.log('[AuthProvider] Setting up auth state listener');
    
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthProvider] Auth state changed:', event);
        
        // Basic setup without fetching profile to avoid circular calls
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            firstName: '',
            lastName: '',
            role: UserRole.USER, // Default role, will be updated when profile is fetched
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          
          // Fetch profile in a non-blocking way
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
        
        setLoading(false);
        activeSession = !!session;
      }
    );

    // Check for existing session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthProvider] Initial session check:', !!session);
      
      if (session?.user && !activeSession) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          firstName: '',
          lastName: '',
          role: UserRole.USER,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        // Fetch profile in a non-blocking way
        setTimeout(() => {
          fetchUserProfile(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    }).catch(err => {
      console.error('[AuthProvider] Error checking session:', err);
      setError('Failed to check authentication status');
      setLoading(false);
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('[AuthProvider] Error fetching profile:', profileError);
        return;
      }

      if (profile) {
        console.log('[AuthProvider] Profile fetched:', profile);
        setUser(prev => prev ? {
          ...prev,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          role: profile.role as UserRole || UserRole.USER,
          isActive: profile.is_active !== false,
        } : null);
      }
    } catch (err) {
      console.error('[AuthProvider] Profile fetch error:', err);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      console.error('[AuthProvider] Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, firstName?: string, lastName?: string, role?: string) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName || '',
            last_name: lastName || '',
            role: role || 'USER',
          },
        },
      });
      
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      console.error('[AuthProvider] Register error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      return true;
    } catch (err: any) {
      console.error('[AuthProvider] Logout error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      return true;
    } catch (err: any) {
      console.error('[AuthProvider] Reset password error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if user has required role
  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  // Context value
  const value: AuthContextProps = {
    user,
    currentUser: user, // For backward compatibility
    loading,
    isLoading: loading, // For backward compatibility
    error,
    isAuthenticated: !!user,
    login,
    signIn: login, // For backward compatibility
    logout,
    signOut: logout, // For backward compatibility
    register,
    signUp: register, // For backward compatibility
    resetPassword,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
