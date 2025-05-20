
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Enhanced global component that detects and recovers from blank/white pages
 */
const BlankScreenRecovery: React.FC = () => {
  const [isBlankScreen, setIsBlankScreen] = useState(false);
  const [detectionAttempt, setDetectionAttempt] = useState(0);
  const [contentCheckResult, setContentCheckResult] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Reset and run detection when route changes
  useEffect(() => {
    // Reset state when route changes
    setIsBlankScreen(false);
    setDetectionAttempt(0);
    setContentCheckResult(null);
    
    // Check if this is an auth page that should skip initial detection
    const isAuthPage = location.pathname.includes('/login') || 
                      location.pathname.includes('/register') || 
                      location.pathname.includes('/auth') ||
                      location.pathname.includes('/admin-login');
    
    // For auth pages, check for auth-specific markers first before skipping detection
    if (isAuthPage) {
      const authPageHasMarkers = document.body.hasAttribute('data-auth-page-loaded') || 
                               document.body.hasAttribute('data-page-ready') ||
                               document.body.hasAttribute('data-auth-content');
      
      if (authPageHasMarkers) {
        console.log('[BlankScreenRecovery] Auth page with markers detected, skipping detection');
        return;
      } else {
        // Only do delayed check for auth pages without markers
        console.log('[BlankScreenRecovery] Auth page without markers, running delayed detection');
        setTimeout(() => {
          runDetection();
        }, 1500); // Longer delay for auth pages
        return;
      }
    }
    
    // Initial detection with slightly longer delay for non-auth pages
    const initialTimer = setTimeout(() => {
      console.log('[BlankScreenRecovery] Starting detection for non-auth page:', location.pathname);
      runDetection();
    }, 1800); // Slightly longer delay for non-auth pages
    
    return () => clearTimeout(initialTimer);
  }, [location.pathname]);

  // Enhanced detection logic with better content checks
  const runDetection = () => {
    const currentAttempt = detectionAttempt + 1;
    setDetectionAttempt(currentAttempt);
    
    console.info(`[BlankScreenRecovery] Detection attempt ${currentAttempt} started for ${location.pathname}`);
    
    // Skip additional detections for auth pages that now have markers
    const isAuthPage = location.pathname.includes('/login') || 
                     location.pathname.includes('/register') || 
                     location.pathname.includes('/auth') ||
                     location.pathname.includes('/admin-login');
    
    const authPageHasMarkers = document.body.hasAttribute('data-auth-page-loaded') || 
                             document.body.hasAttribute('data-page-ready') ||
                             document.body.hasAttribute('data-auth-content') ||
                             document.body.hasAttribute('data-force-content-ready');
    
    if (isAuthPage && authPageHasMarkers) {
      console.log('[BlankScreenRecovery] Auth page markers found, stopping detection');
      setIsBlankScreen(false);
      return;
    }
    
    // Use exponential backoff for checking with a cap
    const backoff = Math.min(300 * Math.pow(1.5, currentAttempt - 1), 2000);
    
    setTimeout(() => {
      console.info(`[BlankScreenRecovery] Running detection check after ${backoff}ms backoff`);
      
      // Multiple content detection strategies
      
      // 1. Direct DOM inspection for any visible content
      const mainElement = document.querySelector('main');
      const hasMainContent = mainElement && 
                          mainElement.children.length > 0 && 
                          window.getComputedStyle(mainElement).display !== 'none';
      
      // 2. Check specifically for module placeholders
      const hasPlaceholder = !!document.querySelector('[data-testid="merchant-module-placeholder"]');
      
      // 3. Check if the root has been marked with content
      const rootMarked = document.querySelector('#root[data-has-content="true"]');
      
      // 4. Look for any marked content-ready elements
      const hasReadyContent = !!document.querySelector('[data-content-ready="true"]');
      
      // 5. Check for dashboard content specifically
      const hasDashboardContent = !!document.querySelector('[data-testid="dashboard-content"]');
      
      // 6. Check for auth-specific content
      const hasAuthContent = !!document.querySelector('[data-testid="auth-login"]') || 
                           !!document.querySelector('[data-auth-content="ready"]') ||
                           !!document.querySelector('[data-public-route="loaded"]') ||
                           !!document.querySelector('.auth-content-wrapper');
      
      // 7. Check for any auth page markers
      const authPageLoaded = document.body.hasAttribute('data-auth-page-loaded') || 
                           document.body.hasAttribute('data-page-ready') ||
                           document.body.hasAttribute('data-auth-content') ||
                           document.body.hasAttribute('data-force-content-ready');
      
      // 8. Check for any login form elements
      const hasLoginElements = !!document.querySelector('form input[type="email"]') ||
                             !!document.querySelector('form input[type="password"]');
      
      // Update the content check result
      const enhancedContentCheck = {
        hasMainContent,
        hasPlaceholder,
        rootMarked: !!rootMarked,
        hasReadyContent,
        hasDashboardContent,
        hasAuthContent,
        isAuthPage,
        authPageLoaded,
        hasLoginElements,
        attempt: currentAttempt,
      };
      
      // Store the result for debugging
      const result = {
        ...enhancedContentCheck,
        pathChecked: location.pathname,
        combinedContentResult: hasMainContent || 
                              hasPlaceholder || 
                              !!rootMarked || 
                              hasReadyContent || 
                              hasDashboardContent ||
                              hasAuthContent ||
                              (isAuthPage && authPageLoaded) ||
                              hasLoginElements
      };
      
      console.info('[BlankScreenRecovery] Content check result:', result);
      setContentCheckResult(result);
      
      // If we have visible content by ANY method, we're good
      if (result.combinedContentResult) {
        console.info('[BlankScreenRecovery] Content found, no blank screen detected');
        setIsBlankScreen(false);
        return;
      }
      
      // For auth pages, wait longer before showing the error
      const maxAttempts = isAuthPage ? 8 : 4;
      
      // If this is our final attempt and still no content by any detection method, mark as blank screen
      if (currentAttempt >= maxAttempts && !result.combinedContentResult) {
        console.warn('[BlankScreenRecovery] Blank screen detected after multiple attempts');
        setIsBlankScreen(true);
        
        // Show a toast notification - make it less alarming
        toast({
          title: "Content loading issue",
          description: "We're having trouble showing content on this page. You can try refreshing.",
          variant: "default",
        });
        return;
      }
      
      // Try again if we haven't reached our limit
      if (currentAttempt < 10) { // Increased from 8 to 10 attempts for auth pages
        runDetection();
      }
    }, backoff);
  };

  // Handle refresh action
  const handleRefresh = () => {
    window.location.reload();
  };

  // Handle navigation to dashboard
  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
    setIsBlankScreen(false);
  };

  // Handle navigation back
  const handleGoBack = () => {
    navigate(-1);
    setIsBlankScreen(false);
  };

  // Only show recovery UI if we've detected a blank screen
  if (!isBlankScreen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/95 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 border border-muted">
        <div className="flex items-center space-x-2 text-amber-600 mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Content Display Issue</h2>
        </div>
        
        <p className="text-gray-700 mb-4">
          We're having trouble displaying the content for this page. This could be due to a temporary loading issue.
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={handleRefresh}
            className="flex items-center justify-center w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Page
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
          
          <button
            onClick={handleNavigateToDashboard}
            className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          Page: {location.pathname} | Attempt: {detectionAttempt}
        </div>
      </div>
    </div>
  );
};

export default BlankScreenRecovery;
