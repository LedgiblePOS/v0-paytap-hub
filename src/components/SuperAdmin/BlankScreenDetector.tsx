
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { hasVisibleContent } from '@/utils/routeContentValidator';

/**
 * Component that detects blank screens specifically in super admin pages
 * and provides recovery options
 */
const BlankScreenDetector: React.FC = () => {
  const [isBlank, setIsBlank] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for content after the page has loaded
  useEffect(() => {
    // Reset state when the route changes
    setIsBlank(false);
    setAttempts(0);
    
    // Add a small delay to allow content to render
    const initialTimer = setTimeout(() => {
      checkForContent();
    }, 2000);
    
    return () => clearTimeout(initialTimer);
  }, [location.pathname]);
  
  // Function to check if the page has content
  const checkForContent = () => {
    // Check if we're actually in a super admin route
    if (!location.pathname.startsWith('/super-admin')) {
      return;
    }
    
    const hasContent = hasVisibleContent();
    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);
    
    // If there's content, we're good
    if (hasContent) {
      setIsBlank(false);
      return;
    }
    
    // If we've checked multiple times and still no content
    if (currentAttempts >= 3) {
      console.warn(`[SuperAdmin] Blank screen detected at ${location.pathname} after ${currentAttempts} attempts`);
      setIsBlank(true);
      
      toast({
        title: "Content Loading Issue",
        description: "The super admin page content isn't loading correctly.",
        variant: "destructive",
      });
      
      return;
    }
    
    // Try again after exponential backoff
    const delay = Math.min(1000 * (2 ** currentAttempts), 8000); // Max 8 seconds
    setTimeout(checkForContent, delay);
  };
  
  // Refresh the current page
  const handleRefresh = () => {
    window.location.reload();
  };
  
  // Navigate back to super admin dashboard
  const handleBackToDashboard = () => {
    navigate('/super-admin');
    setIsBlank(false);
  };
  
  if (!isBlank) {
    return null;
  }
  
  // Render a recovery UI if we detect a blank screen
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full p-6 border border-border">
        <div className="flex items-center space-x-2 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Super Admin Content Issue</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          There was a problem loading the super admin content for this page.
          This might be due to a temporary loading issue or connection problem.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="w-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded"
            data-testid="refresh-button"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </button>
          
          <button
            onClick={handleBackToDashboard}
            className="w-full flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded"
            data-testid="dashboard-button"
          >
            Return to Dashboard
          </button>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          Path: {location.pathname}
        </div>
      </div>
    </div>
  );
};

export default BlankScreenDetector;
