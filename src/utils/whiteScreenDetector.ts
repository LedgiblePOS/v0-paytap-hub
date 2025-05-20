
/**
 * Utility to detect and recover from white screens
 */

// Detection timeout in milliseconds
const DETECTION_TIMEOUT = 5000;

// Attributes to look for to confirm content is loaded
const CONTENT_ATTRIBUTES = [
  'data-content-ready',
  'data-render-state',
  'data-testid'
];

/**
 * Initializes white screen detection and recovery
 */
export const initWhiteScreenDetection = () => {
  // Wait for initial render
  setTimeout(checkForWhiteScreen, DETECTION_TIMEOUT);
  
  // Set up the MutationObserver to monitor DOM changes
  const observer = new MutationObserver(() => {
    // Reset the timeout on significant DOM changes
    clearTimeout(window.whiteScreenTimeout);
    window.whiteScreenTimeout = setTimeout(checkForWhiteScreen, 2000);
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: CONTENT_ATTRIBUTES
  });
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    observer.disconnect();
    clearTimeout(window.whiteScreenTimeout);
  });
};

/**
 * Checks if the screen is white/empty and attempts recovery
 */
const checkForWhiteScreen = () => {
  // Don't run during initial page load
  if (document.readyState !== 'complete') return;
  
  console.log('[WhiteScreenDetector] Checking for white screen...');
  
  // Get visible elements (ignore hidden elements)
  const visibleElements = Array.from(document.querySelectorAll('*'))
    .filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0';
    });
  
  // Check if there are any visible content elements
  const hasVisibleContent = visibleElements.length > 10;
  
  // Check for known content markers
  const hasContentMarkers = CONTENT_ATTRIBUTES.some(attr => 
    document.querySelector(`[${attr}]`) !== null
  );
  
  // Determine if we have a white screen
  const isWhiteScreen = !hasVisibleContent && !hasContentMarkers;
  
  // Log detection results
  console.log('[WhiteScreenDetector] Detection results:', {
    visibleElements: visibleElements.length,
    hasContentMarkers,
    isWhiteScreen,
    pathname: window.location.pathname
  });
  
  // If it looks like a white screen, attempt recovery
  if (isWhiteScreen) {
    console.warn('[WhiteScreenDetector] White screen detected! Attempting recovery...');
    attemptRecovery();
  }
};

/**
 * Attempts to recover from a white screen
 */
const attemptRecovery = () => {
  // Check current page path
  const currentPath = window.location.pathname;
  
  // Display recovery UI
  showRecoveryUI(currentPath);
  
  // Attempt to reload the page after a short delay
  setTimeout(() => {
    console.log('[WhiteScreenDetector] Forced reload to recover from white screen');
    window.location.reload();
  }, 8000);
};

/**
 * Shows a minimal recovery UI when white screen is detected
 */
const showRecoveryUI = (currentPath: string) => {
  // Create recovery container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.right = '0';
  container.style.bottom = '0';
  container.style.backgroundColor = 'white';
  container.style.zIndex = '99999';
  container.style.padding = '2rem';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  
  // Create message
  const message = document.createElement('div');
  message.style.fontSize = '1.25rem';
  message.style.marginBottom = '1rem';
  message.textContent = 'Loading application...';
  
  // Create spinner
  const spinner = document.createElement('div');
  spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
  spinner.style.borderRadius = '50%';
  spinner.style.borderTop = '4px solid #3498db';
  spinner.style.width = '40px';
  spinner.style.height = '40px';
  spinner.style.animation = 'spin 1s linear infinite';
  
  // Create style for spinner animation
  const style = document.createElement('style');
  style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
  
  // Create info text
  const info = document.createElement('div');
  info.style.marginTop = '1rem';
  info.style.fontSize = '0.9rem';
  info.style.color = '#666';
  info.textContent = `Recovering page: ${currentPath}`;
  
  // Append elements
  container.appendChild(message);
  container.appendChild(spinner);
  container.appendChild(info);
  document.head.appendChild(style);
  document.body.appendChild(container);
};

// Add type definition for window
declare global {
  interface Window {
    whiteScreenTimeout: ReturnType<typeof setTimeout>;
  }
}
