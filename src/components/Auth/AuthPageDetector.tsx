
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A specialized component for auth pages that ensures content is properly detected
 * Uses multiple detection strategies to prevent blank screens
 */
const AuthPageDetector: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname.includes('/login') || 
                    location.pathname.includes('/register') || 
                    location.pathname.includes('/admin-login');
  const detectionRef = useRef<boolean>(false);
  const mountTimeRef = useRef<number>(Date.now());

  // Skip if not an auth page
  if (!isAuthPage) return null;
  
  // Apply aggressive content detection for auth pages
  useEffect(() => {
    if (!isAuthPage || detectionRef.current) return;
    
    console.log('[AuthPageDetector] Initializing auth page detection for:', location.pathname);
    detectionRef.current = true;
    
    // Mark content as ready using multiple strategies
    const markAuthPageAsLoaded = () => {
      console.log('[AuthPageDetector] Marking auth page as loaded');
      
      // Strategy 1: Mark body with multiple data attributes
      document.body.setAttribute('data-auth-page-loaded', 'true');
      document.body.setAttribute('data-page-type', 'auth');
      document.body.setAttribute('data-content-ready', 'true');
      document.body.setAttribute('data-content-type', 'auth');
      
      // Strategy 2: Mark the document element
      document.documentElement.setAttribute('data-auth-ready', 'true');
      
      // Strategy 3: Mark main content area
      const main = document.querySelector('main');
      if (main) {
        main.setAttribute('data-auth-content', 'loaded');
        main.setAttribute('data-content-ready', 'true');
      }
      
      // Strategy 4: Add auth-specific class to body
      document.body.classList.add('auth-page-loaded');
      
      // Strategy 5: Dispatch custom events
      try {
        window.dispatchEvent(new CustomEvent('auth-page-loaded', { 
          detail: { path: location.pathname, loadTime: Date.now() - mountTimeRef.current } 
        }));
        
        document.dispatchEvent(new CustomEvent('content-ready', { 
          detail: { page: 'auth', path: location.pathname } 
        }));
      } catch (err) {
        console.error('[AuthPageDetector] Error dispatching events:', err);
      }
      
      // Verify content has been properly marked
      const isMarked = document.body.hasAttribute('data-auth-page-loaded');
      console.log('[AuthPageDetector] Content marked status:', isMarked);
    };
    
    // Execute marking immediately and with multiple timeouts
    markAuthPageAsLoaded();
    
    // Additional timeouts for race condition handling
    const timeouts = [50, 200, 500, 1000, 2000].map(delay => 
      setTimeout(() => {
        if (document.body && !document.body.hasAttribute('data-auth-page-loaded')) {
          console.log(`[AuthPageDetector] Re-marking content after ${delay}ms`);
          markAuthPageAsLoaded();
        }
      }, delay)
    );
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isAuthPage, location.pathname]);

  // This component doesn't render anything visible
  return null;
};

export default AuthPageDetector;
