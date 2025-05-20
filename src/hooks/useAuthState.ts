
import { useState } from 'react';
import { User, UserRole } from '@/types/user';
import { AppError, ErrorType, ErrorSeverity } from '@/utils/appErrorHandler';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | string | null>(null);

  const handleError = (error: unknown) => {
    if (error instanceof AppError) {
      setError(error);
    } else if (error instanceof Error) {
      setError(new AppError(
        error.message,
        ErrorType.AUTHENTICATION,
        ErrorSeverity.ERROR,
        error
      ));
    } else {
      setError(new AppError(
        'An unknown error occurred',
        ErrorType.UNKNOWN,
        ErrorSeverity.ERROR
      ));
    }
  };

  // Create a user model from database response
  const createUserFromDbResponse = (data: any): User | null => {
    if (!data) return null;
    
    // Handle database entity format (snake_case)
    if (data.first_name !== undefined) {
      return {
        id: data.id,
        email: data.email || '',
        firstName: data.first_name || '',
        lastName: data.last_name || '',
        role: (data.role || 'USER') as UserRole,
        isActive: data.is_active !== false,
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString(),
        merchantId: data.merchant_id || null
      };
    } 
    // Handle model format (camelCase)
    else {
      return {
        id: data.id,
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        role: (data.role || 'USER') as UserRole,
        isActive: data.isActive !== false,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
        merchantId: data.merchantId || null
      };
    }
  };

  return {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    error,
    setError: handleError,
    loading: isLoading,
    user: currentUser,
    setUser: setCurrentUser,
    createUserFromDbResponse
  };
};

export default useAuthState;
