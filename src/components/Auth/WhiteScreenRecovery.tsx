
import React, { useEffect } from 'react';

const WhiteScreenRecovery: React.FC = () => {
  useEffect(() => {
    // Set a timer to check for white screen after the page loads
    const timer = setTimeout(() => {
      if (document.body.textContent?.trim().length === 0 || 
          document.body.children.length === 0) {
        console.error('White screen detected, attempting recovery');
        triggerRecovery();
      }
    }, 3000);

    // Check if the auth element is visible and properly styled
    const ensureAuthContentIsVisible = () => {
      const authElements = document.querySelectorAll('[data-auth-page], .auth-page, form[data-auth-form]');
      
      authElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.display = 'block';
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.setAttribute('data-recovered', 'true');
        }
      });

      // Make sure body has proper visibility
      document.body.style.display = 'block';
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      document.body.setAttribute('data-recovered', 'true');
    };

    // Recovery function to attempt to fix white screen
    const triggerRecovery = () => {
      // Log the recovery attempt
      console.log('Triggering white screen recovery');
      
      // Force body to be visible
      document.body.style.display = 'block';
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      
      // Add recovery message if nothing else is visible
      if (document.body.textContent?.trim().length === 0) {
        const recoveryDiv = document.createElement('div');
        recoveryDiv.innerHTML = `
          <div style="padding: 20px; text-align: center; max-width: 400px; margin: 100px auto; border: 1px solid #ddd; border-radius: 8px; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3>Recovering your session</h3>
            <p>We detected a loading issue and are trying to recover your session.</p>
            <button onclick="location.reload()" style="padding: 8px 16px; background: #4a6cf7; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Refresh Page</button>
          </div>
        `;
        document.body.appendChild(recoveryDiv);
      }
      
      // Ensure auth content is visible
      ensureAuthContentIsVisible();
      
      // Attempt to force re-render of React components
      window.dispatchEvent(new Event('resize'));
    };

    // Set up multiple checks to handle timing issues
    const checks = [500, 1500, 3000, 5000].map(delay => 
      setTimeout(ensureAuthContentIsVisible, delay)
    );

    // Clean up
    return () => {
      clearTimeout(timer);
      checks.forEach(clearTimeout);
    };
  }, []);

  // No visible output, this is just a recovery mechanism
  return null;
};

export default WhiteScreenRecovery;
