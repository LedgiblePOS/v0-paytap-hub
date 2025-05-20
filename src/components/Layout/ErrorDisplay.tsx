
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export interface ErrorDisplayProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  resetErrorBoundary,
  title = 'Something went wrong',
  message = 'An unexpected error occurred',
  onRetry
}) => {
  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center border rounded-lg bg-destructive/5">
      <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">
        {error?.message || message}
      </p>
      <Button onClick={handleRetry} variant="outline">
        Try again
      </Button>
    </div>
  );
};

export default ErrorDisplay;
