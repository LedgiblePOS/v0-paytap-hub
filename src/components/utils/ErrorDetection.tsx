
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import errorTrackingService from '@/services/errorTrackingService';
import performanceMonitoringService from '@/services/performanceMonitoringService';

/**
 * Component that detects errors and performance issues
 * and reports them to the monitoring services
 */
const ErrorDetection: React.FC = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Start monitoring performance
    performanceMonitoringService.startMonitoring();
    
    // Monitor for content not loading
    const checkContentLoaded = setTimeout(() => {
      const main = document.querySelector('main');
      if (main && !main.hasAttribute('data-content-ready') && !main.hasAttribute('data-has-error')) {
        console.error('Content detection: page content not loaded within timeout');
        errorTrackingService.trackError(
          new Error('Potential blank screen detected - content not loaded within timeout'),
          { location: window.location.pathname }
        );
        
        // Add an error marker to prevent duplicate reports
        main.setAttribute('data-has-error', 'true');
        
        // Show a toast to the user
        toast({
          title: 'Page Loading Issue',
          description: 'Some content is taking longer than expected to load.',
          variant: 'destructive',
        });
      }
    }, 10000); // 10 second timeout
    
    return () => {
      clearTimeout(checkContentLoaded);
    };
  }, [toast]);
  
  // This component doesn't render anything
  return null;
};

export default ErrorDetection;
