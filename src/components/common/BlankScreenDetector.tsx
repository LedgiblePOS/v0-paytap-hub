
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw, Home } from 'lucide-react';

const BlankScreenDetector: React.FC = () => {
  const [isBlankScreen, setIsBlankScreen] = useState(false);
  const [detectionAttempts, setDetectionAttempts] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    // Reset detection state on route change
    setIsBlankScreen(false);
    setDetectionAttempts(0);
    
    // Mark this component as loaded
    document.body.setAttribute('data-blank-detector-loaded', 'true');
    
    // Set up content detection with progressive checking
    const checkForContent = () => {
      // Content detection strategies
      const hasMainContent = document.querySelector('main')?.textContent?.trim().length > 50;
      const hasDashboardContent = document.querySelector('[data-testid="dashboard-content"]') !== null;
      const hasModuleContent = document.querySelector('[data-module-content]') !== null;
      const hasExplicitMarker = document.querySelector('[data-content-ready="true"]') !== null;
      const hasBodyMarker = document.body.getAttribute('data-content-ready') === 'true';
      
      // Log detection attempts for debugging
      console.log(`[BlankScreenDetector] Content check #${detectionAttempts + 1}:`, {
        path: location.pathname,
        hasMainContent,
        hasDashboardContent,
        hasModuleContent,
        hasExplicitMarker,
        hasBodyMarker
      });
      
      const hasContent = hasMainContent || hasDashboardContent || hasModuleContent || 
                        hasExplicitMarker || hasBodyMarker;
      
      if (hasContent) {
        // Content found, no blank screen
        setIsBlankScreen(false);
        return;
      }
      
      // For the first few attempts, continue checking without showing the error
      if (detectionAttempts < 3) {
        setDetectionAttempts(prev => prev + 1);
        
        // Progressive delay with backoff
        const delay = Math.min(1000 * (detectionAttempts + 1), 5000);
        setTimeout(checkForContent, delay);
        return;
      }
      
      // After multiple attempts with no content, show the error
      setIsBlankScreen(true);
      console.error('[BlankScreenDetector] No content detected on page');
    };
    
    // Initial check with delay to allow content to render
    const initialTimer = setTimeout(checkForContent, 800);
    
    return () => {
      clearTimeout(initialTimer);
    };
  }, [location.pathname, detectionAttempts]);
  
  if (!isBlankScreen) {
    return null;
  }
  
  // The recovery UI when a blank screen is detected
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-background z-50">
      <div className="w-full max-w-md">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Content Loading Issue</AlertTitle>
          <AlertDescription>
            <p className="mb-4">We're having trouble showing content on this page.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  // Force page reload with cache bust parameter
                  window.location.href = `${window.location.pathname}?t=${Date.now()}`;
                }}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh Page
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  // Navigate to dashboard with cache bust parameter
                  window.location.href = `/?t=${Date.now()}`;
                }}
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default BlankScreenDetector;
