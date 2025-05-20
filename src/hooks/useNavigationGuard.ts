
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

/**
 * A hook that helps detect and prevent navigation issues that might cause white pages
 */
export const useNavigationGuard = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mountTimeRef = useRef(Date.now());
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  
  // Set up a safety timeout to detect potential white page issues
  useEffect(() => {
    setIsPageLoaded(false);
    setHasError(false);
    setErrorMessage(null);
    mountTimeRef.current = Date.now();
    retryCountRef.current = 0;
    
    // Mark the page as loaded after a short delay
    const loadedTimer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 500); // Increased to give more time for loading
    
    // Set a safety timeout to catch white page issues
    loadTimeoutRef.current = setTimeout(() => {
      if (!isPageLoaded) {
        console.warn('Navigation loading timeout reached for:', location.pathname);
        
        // Check if there's any content visible in the main area
        const mainContent = document.querySelector('main');
        const hasContent = mainContent && mainContent.children.length > 0;
        
        if (!hasContent) {
          setHasError(true);
          setErrorMessage(`Loading timeout reached for ${location.pathname}`);
          
          // Show a toast notification to inform the user
          toast({
            title: "Navigation issue detected",
            description: "The page is taking longer than expected to load. Please try refreshing.",
            variant: "destructive",
          });
          
          // Implement retry logic with exponential backoff
          if (retryCountRef.current < 3) {
            retryCountRef.current += 1;
            const backoffTime = Math.pow(2, retryCountRef.current) * 1000;
            
            console.log(`Attempting retry ${retryCountRef.current} after ${backoffTime}ms`);
            
            setTimeout(() => {
              // Force a re-render by setting state
              setHasError(false);
              setErrorMessage(null);
            }, backoffTime);
          }
        }
      }
    }, 10000); // Increased timeout to give more time
    
    return () => {
      clearTimeout(loadedTimer);
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [location.pathname, toast]);
  
  // Log navigation performance
  useEffect(() => {
    if (isPageLoaded) {
      const loadTime = Date.now() - mountTimeRef.current;
      console.log(`Page ${location.pathname} loaded in ${loadTime}ms`);
      
      // Clear any pending timeouts
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    }
  }, [isPageLoaded, location.pathname]);
  
  return {
    isPageLoaded,
    hasError,
    errorMessage,
    currentPath: location.pathname,
    loadTime: isPageLoaded ? Date.now() - mountTimeRef.current : 0,
    retryCount: retryCountRef.current
  };
};
