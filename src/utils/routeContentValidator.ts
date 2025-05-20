
/**
 * Route content validator to detect potential blank page issues
 */

// Expected selectors for common routes to detect proper content rendering
const routeContentSelectors: Record<string, string[]> = {
  '/dashboard': [
    '[data-testid="dashboard-content"]', 
    '.dashboard-stats', 
    '.dashboard-charts', 
    '.merchant-overview'
  ],
  '/inventory': [
    '[data-testid="inventory-module"]', 
    '[data-testid="inventory-content"]',
    '[data-inventory-page="true"]',
    '.inventory-table', 
    '.inventory-content'
  ],
  '/accounting': [
    '[data-testid="accounting-module"]', 
    '[data-testid="accounting-content"]',
    '.accounting-content'
  ],
  '/customers': [
    '[data-testid="customers-module"]', 
    '[data-testid="customers-content"]',
    '.customers-content'
  ],
  '/pos': [
    '[data-testid="point-of-sale-module"]', 
    '[data-testid="pos-content"]',
    '.pos-content'
  ],
  '/tax-reporting': [
    '[data-testid="tax-reporting-module"]', 
    '[data-testid="tax-content"]',
    '.tax-content'
  ],
  '/sales-projections': [
    '[data-testid="sales-projections-module"]', 
    '[data-testid="projections-content"]',
    '.projections-content'
  ],
  '/payments': [
    '[data-testid="payments-module"]', 
    '[data-testid="payments-content"]',
    '.payments-content'
  ],
  '/analytics': [
    '[data-testid="analytics-module"]', 
    '[data-testid="analytics-content"]',
    '.analytics-content'
  ],
  '/settings': [
    '[data-testid="settings-module"]', 
    '[data-testid="settings-content"]',
    '.settings-content'
  ],
  '/account': [
    '[data-testid="account-module"]', 
    '[data-testid="account-content"]',
    '.account-content'
  ],
  // Add a fallback for any route that might be using placeholders
  'placeholder': [
    '[data-testid="merchant-module-placeholder"]',
    '[data-testid="module-placeholder"]',
    '.route-content-wrapper',
    '.card',
    '[data-content-ready="true"]'
  ]
};

// Common issues that might cause white pages for different routes
const commonRouteIssues: Record<string, string[]> = {
  '/dashboard': [
    'Missing dashboard components',
    'Error in stats or chart rendering',
    'Authentication state not properly synchronized'
  ],
  '/inventory': [
    'Data fetch error in inventory table',
    'Missing inventory content wrapper',
    'Product data transformation error',
    'Type mismatch in inventory components'
  ],
  // Add other routes as needed
};

/**
 * Validates if a route has proper content rendered
 * @param path Current route path
 * @returns Validation result
 */
export const validateRouteContent = (path?: string) => {
  // Use provided path or current path
  const currentPath = path || window.location.pathname;
  
  // Extract the base route without query parameters
  const basePath = currentPath.split('?')[0];
  
  // Find the matching route (exact match or closest parent)
  let routePath = Object.keys(routeContentSelectors).find(route => 
    basePath === route || basePath.startsWith(`${route}/`) || 
    basePath.endsWith(route) || basePath.includes(route)
  );
  
  // If no specific route match found, check for placeholder content
  if (!routePath) {
    console.log("[validateRouteContent] No specific route match found, checking for placeholder content");
    
    // Check if any placeholder selectors exist in the DOM
    const hasPlaceholderContent = routeContentSelectors['placeholder'].some(selector => 
      document.querySelector(selector) !== null
    );
    
    if (hasPlaceholderContent) {
      console.log("[validateRouteContent] Found placeholder content");
      routePath = 'placeholder';
    } else {
      routePath = '/dashboard'; // Default to dashboard if no match
    }
  }
  
  // Get the selectors for this route
  const selectors = [...(routeContentSelectors[routePath] || []), ...routeContentSelectors['placeholder']];
  
  // Check if any of the expected selectors exist in the DOM
  const foundSelector = selectors.find(selector => 
    document.querySelector(selector) !== null
  );
  
  // Look for any ready content
  const readyContent = document.querySelector('[data-content-ready="true"]');
  
  // Also check for any visible card elements as a fallback
  const hasCards = document.querySelectorAll('.card, .card-content').length > 0;
  
  // Extract route name for logging
  const routeName = routePath.split('/').pop() || 'Dashboard';
  const routeNameCapitalized = routeName.charAt(0).toUpperCase() + routeName.slice(1);
  
  return {
    isValid: !!foundSelector || !!readyContent || hasCards,
    pageName: routeNameCapitalized,
    routePath,
    details: foundSelector 
      ? `Found valid content: ${foundSelector}`
      : readyContent
      ? `Found content marked as ready`
      : hasCards
      ? `Found card elements that should be visible`
      : `Missing content for ${routeName}. Expected any of: ${selectors.join(', ')}`,
    possibleIssues: commonRouteIssues[routePath] || ['Unknown issue with content rendering'],
  };
};

/**
 * Checks if the main content area has visible content
 */
export const hasVisibleContent = () => {
  const main = document.querySelector('main');
  if (!main) return false;
  
  // Check if main element has visible height
  const hasHeight = main.clientHeight > 50; // Reduced from 100 to 50 to catch smaller content
  
  // Check if there are visible children with content
  const children = main.querySelectorAll(':scope > *');
  const hasChildren = children.length > 0;
  
  // Check for text content
  const hasText = main.innerText && main.innerText.trim().length > 0;
  
  // Check for any elements with data-content-ready attribute
  const hasReadyContent = !!document.querySelector('[data-content-ready="true"]');
  
  // Check for any card elements (common UI pattern)
  const hasCardElements = document.querySelectorAll('.card, .card-content').length > 0;
  
  // Check for any route-specific content
  const hasRouteContent = Object.values(routeContentSelectors)
    .flat()
    .some(selector => document.querySelector(selector) !== null);
  
  return hasHeight || hasChildren || hasText || hasReadyContent || hasCardElements || hasRouteContent;
};

/**
 * Inspects and reports on the DOM state for debugging
 */
export const inspectRouteUI = () => {
  const main = document.querySelector('main');
  const currentPath = window.location.pathname;
  
  // Basic UI inspection
  const uiState = {
    mainExists: !!main,
    mainHeight: main?.clientHeight,
    childCount: main?.children.length || 0,
    childElementCount: main?.childElementCount || 0,
    hasText: main?.innerText && main.innerText.trim().length > 0,
    visibleChildrenCount: main ? Array.from(main.children).filter(el => 
      (el as HTMLElement).offsetParent !== null
    ).length : 0,
    path: currentPath,
    hasVisibleContent: hasVisibleContent(),
    hasReadyContent: !!document.querySelector('[data-content-ready="true"]'),
    hasRouteSpecificContent: false,
    attempt: 0 // This will be set by the calling component
  };
  
  // Check for route-specific content
  Object.entries(routeContentSelectors).forEach(([route, selectors]) => {
    if (currentPath.includes(route) || currentPath.endsWith(route)) {
      const hasContent = selectors.some(selector => !!document.querySelector(selector));
      if (hasContent) {
        uiState.hasRouteSpecificContent = true;
      }
    }
  });
  
  return uiState;
};

export default validateRouteContent;
