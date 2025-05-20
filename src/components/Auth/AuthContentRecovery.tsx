
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Specialized blank screen recovery for authentication pages
 * Enhanced with more reliable detection strategies
 */
const AuthContentRecovery: React.FC = () => {
  const [isBlankScreen, setIsBlankScreen] = useState(false);
  const [detectionAttempt, setDetectionAttempt] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAuthPage = location.pathname.includes('/login') || 
                    location.pathname.includes('/register') || 
                    location.pathname.includes('/admin-login');

  // Only run on auth pages with improved early detection 
  useEffect(() => {
    if (!isAuthPage) return;

    // For debugging purposes - log essential information
    console.log('[AuthContentRecovery] Monitoring auth page:', location.pathname);
    document.body.setAttribute('data-auth-recovery-monitoring', 'true');
    setIsBlankScreen(false);
    setDetectionAttempt(0);
    
    // Check if page already has auth markers to avoid unnecessary checks
    const hasAuthMarkersAlready = document.body.hasAttribute('data-auth-page-loaded') || 
                               document.documentElement.hasAttribute('data-auth-ready') ||
                               document.body.classList.contains('auth-page-loaded');
    
    if (hasAuthMarkersAlready) {
      console.log('[AuthContentRecovery] Auth markers already present, skipping detection');
      return;
    }
    
    // Initial detection with strategy based on path
    const initialDelay = location.pathname.includes('login') ? 900 : 1200;
    const timer = setTimeout(() => {
      checkForAuthContent();
    }, initialDelay);
    
    return () => clearTimeout(timer);
  }, [location.pathname, isAuthPage]);

  // Specialized check for auth content with enhanced detection strategies
  const checkForAuthContent = () => {
    if (!isAuthPage) return;
    
    const currentAttempt = detectionAttempt + 1;
    setDetectionAttempt(currentAttempt);
    
    console.log(`[AuthContentRecovery] Auth content check attempt ${currentAttempt}`);
    
    // Comprehensive detection strategy
    
    // 1. Check for explicit auth markers
    const hasAuthAttributes = document.body.hasAttribute('data-auth-page-loaded') || 
                           document.body.hasAttribute('data-auth-content') ||
                           document.body.hasAttribute('data-page-type') ||
                           document.documentElement.hasAttribute('data-auth-ready');
    
    // 2. Check for auth-specific class markers
    const hasAuthClasses = document.body.classList.contains('auth-page-loaded') ||
                         document.documentElement.classList.contains('auth-ready');
    
    // 3. Look for auth form elements - very specific to login forms
    const hasAuthForm = document.querySelector('input[type="email"]') || 
                       document.querySelector('input[type="password"]') ||
                       document.querySelector('form button[type="submit"]');
    
    // 4. Check auth-specific elements by testid
    const hasAuthTestId = document.querySelector('[data-testid="auth-login"]') ||
                         document.querySelector('[data-testid="auth-register"]') ||
                         document.querySelector('[data-testid="auth-admin-login"]');
    
    // 5. Check login-specific links
    const hasAuthLinks = document.querySelector('a[href="/register"]') ||
                        document.querySelector('a[href="/login"]');
    
    // 6. Check main content area
    const main = document.querySelector('main');
    const hasMainContent = main && main.clientHeight > 50 && 
                         main.innerText && 
                         main.innerText.trim().length > 0;
    
    // 7. Form element detection - specifically for the login page
    const hasLoginForm = document.querySelector('form') && 
                        (document.querySelector('form').innerText.toLowerCase().includes('sign in') ||
                         document.querySelector('form').innerText.toLowerCase().includes('login'));
    
    // Any detection method succeeds
    if (hasAuthAttributes || hasAuthClasses || hasAuthForm || hasAuthTestId || 
        hasAuthLinks || hasMainContent || hasLoginForm) {
      console.log('[AuthContentRecovery] Auth content detected via:', 
                 hasAuthAttributes ? 'attributes' : 
                 hasAuthClasses ? 'classes' : 
                 hasAuthForm ? 'form elements' : 
                 hasAuthTestId ? 'test IDs' : 
                 hasAuthLinks ? 'auth links' :
                 hasMainContent ? 'main content' : 'login form');
      
      setIsBlankScreen(false);
      
      // If detected through alternative means, add the markers for future checks
      if (!hasAuthAttributes) {
        document.body.setAttribute('data-auth-page-loaded', 'true');
        document.body.setAttribute('data-recovery-detected', 'true');
      }
      
      return;
    }
    
    // Progressive backoff with faster initial checks
    const maxAttempts = 6; // Reduced from 8
    
    if (currentAttempt >= maxAttempts) {
      console.warn('[AuthContentRecovery] Auth page blank screen detected after', maxAttempts, 'attempts');
      setIsBlankScreen(true);
      
      toast({
        title: "Authentication Page Issue",
        description: "We're having trouble displaying the login form. Please try refreshing.",
        variant: "destructive",
      });
      
      return;
    }
    
    // Progressive backoff for next attempts
    const backoff = Math.min(1500, 300 * Math.pow(1.3, currentAttempt - 1));
    console.log(`[AuthContentRecovery] Auth content not found, retrying in ${backoff}ms (attempt ${currentAttempt}/${maxAttempts})`);
    setTimeout(checkForAuthContent, backoff);
  };

  // Refresh the page
  const handleRefresh = () => {
    window.location.reload();
  };

  // Navigate to dashboard or home
  const handleGoHome = () => {
    navigate('/');
    setIsBlankScreen(false);
  };

  if (!isBlankScreen || !isAuthPage) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 border border-border">
        <div className="flex items-center space-x-2 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Authentication Issue</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          We're having trouble displaying the login form. This might be due to a temporary loading issue.
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
            Go to Home
          </button>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          If this issue persists, please clear your browser cache or try a different browser.
        </div>
      </div>
    </div>
  );
};

export default AuthContentRecovery;
