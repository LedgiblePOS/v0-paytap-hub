
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/types/enums';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthState {
  user: AuthUser | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  error: null
};

export type AuthAction =
  | { type: 'AUTH_STATE_CHANGE'; payload: { user: AuthUser | null; session: any | null } }
  | { type: 'AUTH_LOADING'; payload: boolean }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' };

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_STATE_CHANGE':
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        isLoading: false,
      };
    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        session: null,
        isLoading: false,
      };
    default:
      return state;
  }
};
