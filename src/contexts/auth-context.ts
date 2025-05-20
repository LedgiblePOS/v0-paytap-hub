
import { createContext } from 'react';
import { AuthContextProps } from '@/types/auth';

// Create the context with default undefined value
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Export the AuthProvider from the implementation file
export { AuthProvider } from './auth-context.tsx';
