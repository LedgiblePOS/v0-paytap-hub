
import { User, UserRole } from './user';

export interface AuthContextProps {
  user: User | null;
  currentUser: User | null; // For backward compatibility
  loading: boolean;
  isLoading: boolean; // For backward compatibility
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>; // For backward compatibility
  logout: () => Promise<any>;
  signOut: () => Promise<any>; // For backward compatibility
  register: (email: string, password: string, firstName?: string, lastName?: string, role?: string) => Promise<any>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, role?: string) => Promise<any>; // For backward compatibility
  resetPassword: (email: string) => Promise<any>;
  hasPermission: (role: UserRole | UserRole[]) => boolean;
}
