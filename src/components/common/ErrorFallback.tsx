
import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  error?: Error | null;
  showDetail?: boolean;
  onRetry?: () => void;
}

/**
 * A fallback UI component shown when errors are caught by error boundaries
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = 'Something went wrong',
  message = 'There was a problem loading this content',
  error,
  showDetail = false,
  onRetry
}) => {
  const navigate = useNavigate();
  
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  
  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <div className="rounded-full bg-red-100 p-3 mb-4">
        <AlertCircle className="h-6 w-6 text-red-600" />
      </div>
      
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      {showDetail && error && (
        <div className="bg-gray-100 p-4 rounded mb-6 max-w-full overflow-auto text-left">
          <p className="text-sm font-mono text-red-700 mb-2">{error.message}</p>
          {error.stack && (
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
              {error.stack.split('\n').slice(1, 6).join('\n')}
            </pre>
          )}
        </div>
      )}
      
      <div className="flex space-x-4">
        <button
          onClick={handleRetry}
          className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
        
        <button
          onClick={handleGoHome}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
        >
          <Home className="h-4 w-4 mr-2" />
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;
