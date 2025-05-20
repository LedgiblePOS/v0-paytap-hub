
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import errorMonitoringService, { ErrorSeverity } from '@/services/errorMonitoringService';
import { useAuth } from '@/hooks/useAuth';

const ErrorMonitoringInitializer: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Initialize error monitoring service
    errorMonitoringService.initialize({
      maxBufferSize: 50,
      autoSendInterval: 60000, // 1 minute
    });

    // Subscribe to critical errors to show toasts to user
    const unsubscribe = errorMonitoringService.subscribe((error) => {
      if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.ERROR) {
        toast({
          title: 'Application Error',
          description: 'An unexpected error occurred. Our team has been notified.',
          variant: 'destructive',
        });
      }
    });
    
    console.log('[ErrorMonitoring] Initialized and monitoring for errors');
    
    return () => {
      unsubscribe();
    };
  }, [toast]);
  
  // Pass user ID to error monitoring when user changes
  useEffect(() => {
    if (user?.id) {
      // Add user context to future error reports
      const originalTrackError = errorMonitoringService.trackError.bind(errorMonitoringService);
      errorMonitoringService.trackError = (errorData) => {
        originalTrackError({
          ...errorData,
          userId: user.id,
          metadata: {
            ...(errorData.metadata || {}),
            userRole: user.role
          }
        });
      };
    }
  }, [user]);
  
  // This component doesn't render anything
  return null;
};

export default ErrorMonitoringInitializer;
