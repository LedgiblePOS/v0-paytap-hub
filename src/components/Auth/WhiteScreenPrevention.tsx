
import { useEffect } from 'react';

/**
 * This component adds various attributes to the body to help
 * detect and recover from white screen issues
 */
const WhiteScreenPrevention: React.FC = () => {
  useEffect(() => {
    // Add a flag to indicate component mounted
    document.body.setAttribute('data-app-loaded', 'true');
    
    // Log that the component has mounted
    console.log('[WhiteScreenPrevention] Component mounted, added data-app-loaded attribute');
    
    // Add heartbeat to check if the app is still responding
    const heartbeatInterval = setInterval(() => {
      const timestamp = new Date().toISOString();
      document.body.setAttribute('data-heartbeat', timestamp);
      console.log('[WhiteScreenPrevention] Heartbeat check:', timestamp);
    }, 30000); // Check every 30 seconds

    return () => {
      document.body.removeAttribute('data-app-loaded');
      document.body.removeAttribute('data-heartbeat');
      clearInterval(heartbeatInterval);
      console.log('[WhiteScreenPrevention] Component unmounted, cleanup complete');
    };
  }, []);

  return null;
};

export default WhiteScreenPrevention;
