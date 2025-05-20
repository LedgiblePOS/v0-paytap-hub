
import { User, UserRole } from '@/types';

export interface AuthContextProps {
  user: User | null;
  userModel: User | null; // For backward compatibility
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean; // For backward compatibility
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (updates: any) => Promise<void>;
  hasPermission: (permissions: string[]) => boolean;
  logout: () => Promise<void>; // Alias for signOut
  register: (email: string, password: string) => Promise<any>; // Alias for signUp
  error: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive?: boolean;
  merchantId?: string | null;
}
