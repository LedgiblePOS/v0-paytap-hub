
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Enhanced component for detecting and recovering from blank screens
 * This is a specialized version for specific routes and scenarios
 */
const BlankScreenRecovery: React.FC = () => {
  const [isBlankScreen, setIsBlankScreen] = useState(false);
  const [detectionAttempt, setDetectionAttempt] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Run detection checks when route changes
  useEffect(() => {
    setIsBlankScreen(false);
    setDetectionAttempt(0);
    
    // Initial detection with delay
    const timer = setTimeout(() => {
      checkForContent();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Check if the page has visible content
  const checkForContent = () => {
    const currentAttempt = detectionAttempt + 1;
    setDetectionAttempt(currentAttempt);
    
    // Check if main content area exists and has content
    const main = document.querySelector('main');
    const hasContent = main && (
      main.clientHeight > 200 && 
      main.querySelectorAll(':scope > *').length > 0 &&
      main.innerText && 
      main.innerText.trim().length > 0
    );
    
    if (hasContent) {
      setIsBlankScreen(false);
      return;
    }
    
    // If we've checked multiple times and still no content, mark as blank
    if (currentAttempt >= 3) {
      console.warn('[Enhanced BlankScreenRecovery] Blank screen detected on', location.pathname);
      setIsBlankScreen(true);
      
      toast({
        title: "Content Loading Issue",
        description: "We're having trouble displaying this page. Please try refreshing.",
        variant: "destructive",
      });
      
      return;
    }
    
    // Try again after a delay
    const backoff = 1000 * Math.min(2, currentAttempt);
    setTimeout(checkForContent, backoff);
  };

  // Refresh the page
  const handleRefresh = () => {
    window.location.reload();
  };

  // Navigate to dashboard
  const handleGoHome = () => {
    navigate('/dashboard');
    setIsBlankScreen(false);
  };

  if (!isBlankScreen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 border border-border">
        <div className="flex items-center space-x-2 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Page Display Issue</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          We're having trouble displaying content on this page. This might be due to a temporary loading issue.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded"
          >
            Go to Dashboard
          </button>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          If this issue persists, please contact support for assistance.
        </div>
      </div>
    </div>
  );
};

export default BlankScreenRecovery;
