
import { useState } from 'react';
import { User } from '@/types/user';
import { AppError, ErrorType, ErrorSeverity } from '@/utils/appErrorHandler';

export const useAuthState = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

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

  return {
    currentUser,
    setCurrentUser,
    isLoading,
    setIsLoading,
    error,
    setError: handleError,
    loading: isLoading,
  };
};

export default useAuthState;
