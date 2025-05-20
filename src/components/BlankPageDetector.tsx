
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BlankPageDetector: React.FC = () => {
  const [isBlankPage, setIsBlankPage] = useState(false);
  const [detectionAttempts, setDetectionAttempts] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Run detection when component mounts and route changes
  useEffect(() => {
    console.log('[BlankPageDetector] Component mounted or route changed:', location.pathname);
    setIsBlankPage(false);
    setDetectionAttempts(0);
    
    // Mark we're running detection
    document.body.setAttribute('data-blank-detection-running', 'true');
    
    // Check for content after a delay to allow rendering
    const initialDelay = setTimeout(() => {
      checkForContent();
    }, 800);
    
    return () => {
      clearTimeout(initialDelay);
      document.body.removeAttribute('data-blank-detection-running');
    };
  }, [location.pathname]);
  
  const checkForContent = () => {
    const newAttempts = detectionAttempts + 1;
    setDetectionAttempts(newAttempts);
    
    // Comprehensive detection using multiple strategies
    const hasMainContent = document.querySelector('main')?.textContent?.trim().length > 0;
    const hasDashboard = document.querySelector('[data-testid="dashboard-content"]') !== null;
    const hasAuthForm = document.querySelector('form[data-auth-form]') !== null;
    const hasAnyContent = document.body.textContent?.trim().length > 50;
    const hasContentMarker = document.querySelector('[data-content-ready="true"]') !== null;
    
    console.log('[BlankPageDetector] Content check:', {
      attempt: newAttempts,
      hasMainContent,
      hasDashboard,
      hasAuthForm,
      hasAnyContent,
      hasContentMarker,
      pathname: location.pathname
    });
    
    // If we have content, we're good
    const hasContent = hasMainContent || hasDashboard || hasAuthForm || hasContentMarker || hasAnyContent;
    
    if (hasContent) {
      console.log('[BlankPageDetector] Content found, no blank page');
      setIsBlankPage(false);
      document.body.setAttribute('data-has-content', 'true');
      return;
    }
    
    // If we've checked multiple times and still no content
    if (newAttempts >= 3) {
      console.warn('[BlankPageDetector] No content detected after multiple attempts, showing recovery UI');
      setIsBlankPage(true);
      
      toast({
        title: "Content Loading Issue",
        description: "We're having trouble displaying the page content. Please try refreshing.",
        variant: "destructive",
      });
      
      return;
    }
    
    // Try again after a delay with exponential backoff
    const backoff = Math.min(1000 * Math.pow(1.5, newAttempts), 5000);
    console.log(`[BlankPageDetector] Retrying content check in ${backoff}ms`);
    
    setTimeout(checkForContent, backoff);
  };
  
  // Reload the page
  const handleRefresh = () => {
    window.location.reload();
  };
  
  // Navigate home
  const handleGoHome = () => {
    navigate('/');
    setIsBlankPage(false);
  };
  
  if (!isBlankPage) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center text-red-600 mb-4">
          <AlertCircle className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-semibold">Page Display Issue</h2>
        </div>
        
        <p className="text-gray-700 mb-6">
          We're having trouble displaying the content for this page. This could be due to a temporary loading issue with authentication or data fetching.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={handleRefresh}
            className="w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Page
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full flex items-center justify-center bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200 transition-colors"
          >
            Go to Home Page
          </button>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          Path: {location.pathname} | Detection attempts: {detectionAttempts}
        </div>
      </div>
    </div>
  );
};

export default BlankPageDetector;
