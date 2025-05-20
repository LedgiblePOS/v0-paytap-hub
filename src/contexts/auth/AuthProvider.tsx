import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { AuthState, AuthAction, authReducer, initialAuthState } from './AuthState';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { UserRole } from '@/types/enums';
import { toUserModel } from '@/utils/modelConversions/userConverter';

interface AuthContextProps {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const login = async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING', payload: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const userDetails = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userDetails.data) {
          const authUser = toUserModel(userDetails.data);

          dispatch({
            type: 'AUTH_STATE_CHANGE',
            payload: { user: authUser, session: data.session },
          });
        } else {
          throw new Error('User details not found');
        }
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'AUTH_LOADING', payload: false });
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string, role: UserRole) => {
    dispatch({ type: 'AUTH_LOADING', payload: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
          },
        },
      });

      if (error) {
        throw error;
      }

     if (data.user) {
        const userDetails = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (userDetails.data) {
          const authUser = toUserModel(userDetails.data);

          dispatch({
            type: 'AUTH_STATE_CHANGE',
            payload: { user: authUser, session: data.session },
          });
        } else {
          throw new Error('User details not found');
        }
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      dispatch({ type: 'AUTH_LOADING', payload: false });
    }
  };
  
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error instanceof Error ? error.message : 'Unknown error during logout' 
      });
    }
  };

  const signOut = logout;

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          try {
            const userDetails = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (userDetails.data) {
              const authUser = toUserModel(userDetails.data);
              dispatch({
                type: 'AUTH_STATE_CHANGE',
                payload: { user: authUser, session: session },
              });
            } else {
              throw new Error('User details not found');
            }
          } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
          }
        } else {
          dispatch({ type: 'AUTH_STATE_CHANGE', payload: { user: null, session: null } });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    state,
    login,
    register,
    logout,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
