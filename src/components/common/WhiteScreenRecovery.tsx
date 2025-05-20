
import { useEffect } from 'react';

/**
 * Enhanced white screen detection and recovery
 * This component helps recover from white screens that can occur during authentication
 */
const WhiteScreenRecovery: React.FC = () => {
  useEffect(() => {
    console.log('[WhiteScreenRecovery] Component mounted');
    
    // Check if content is loaded after a delay
    const contentCheckTimeout = setTimeout(() => {
      const isBlankScreen = document.body.textContent?.trim().length === 0 || 
                          !document.querySelector('main') ||
                          document.querySelectorAll(':not(script):not(head):not(style)').length < 10;
                          
      if (isBlankScreen) {
        console.warn('[WhiteScreenRecovery] Blank screen detected, attempting recovery');
        
        // Mark data attributes for CSS fixes
        document.body.setAttribute('data-blank-screen-recovery', 'true');
        document.body.setAttribute('data-content-recovery', 'active');
        
        // Force visibility of root and app containers
        const rootEl = document.getElementById('root');
        if (rootEl) {
          rootEl.style.display = 'block';
          rootEl.style.visibility = 'visible';
          rootEl.style.opacity = '1';
        }
        
        // Check for auth content specifically (common cause of white screens)
        const authRelatedElements = document.querySelectorAll('[data-auth], form, .auth-form, .login-form');
        authRelatedElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = 'block';
            el.style.visibility = 'visible';
            el.style.opacity = '1';
          }
        });
        
        // Add a safety reload mechanism
        const reloadTimeout = setTimeout(() => {
          if (document.body.textContent?.trim().length === 0) {
            console.log('[WhiteScreenRecovery] Still blank after recovery attempt, reloading page');
            window.location.reload();
          }
        }, 5000);
        
        return () => clearTimeout(reloadTimeout);
      }
    }, 2000);
    
    return () => {
      clearTimeout(contentCheckTimeout);
    };
  }, []);

  // Component doesn't render anything visible
  return null;
};

export default WhiteScreenRecovery;
