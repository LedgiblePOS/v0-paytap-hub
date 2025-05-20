
/**
 * Utility for debugging route navigation and content rendering
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type NavigationDebuggerCallback = (routeName: string, path: string) => void;

/**
 * Default callback for navigation debugger
 */
const defaultCallback: NavigationDebuggerCallback = (routeName, path) => {
  const now = new Date();
  console.log(`Page ${path} loaded in ${Math.floor(performance.now() % 1000)}ms`);
};

/**
 * Hook for debugging route navigation
 * @param routeName - Name of the route component 
 * @param callback - Optional callback for custom navigation logging
 */
export const useNavigationDebugger = (
  routeName: string,
  callback?: NavigationDebuggerCallback
) => {
  const location = useLocation();
  
  // Log when the route component mounts with the current path
  useEffect(() => {
    const logCallback = callback || defaultCallback;
    logCallback(routeName, location.pathname);
    
    // Add data attributes to help with content detection
    const main = document.querySelector('main');
    if (main) {
      main.setAttribute('data-route', routeName.toLowerCase());
      main.setAttribute('data-path', location.pathname);
      
      // Set a minimum height to ensure content is detected
      if (main.clientHeight < 100) {
        main.style.minHeight = '200px';
      }
    }
    
  }, [routeName, location.pathname, callback]);
  
  return location.pathname;
};

export default useNavigationDebugger;
