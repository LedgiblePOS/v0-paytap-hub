
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface AuthErrorProps {
  error: string;
  onRetry?: () => void;
}

const AuthErrorHandler: React.FC<AuthErrorProps> = ({ error, onRetry }) => {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 text-sm underline hover:no-underline"
        >
          Try again
        </button>
      )}
    </Alert>
  );
};

export default AuthErrorHandler;
