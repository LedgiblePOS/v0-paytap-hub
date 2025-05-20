
import { validateRouteContent, hasVisibleContent } from '../routeContentValidator';

// Mock the document object since we're in a test environment
describe('Route Content Validator', () => {
  // Save original document.querySelector
  const originalQuerySelector = document.querySelector;
  const originalQueriesSelector = document.querySelectorAll;
  
  afterEach(() => {
    // Restore original methods after each test
    document.querySelector = originalQuerySelector;
    document.querySelectorAll = originalQueriesSelector;
  });
  
  it('should detect valid content when selectors match', () => {
    // Mock querySelector to simulate finding content
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === '[data-testid="dashboard-content"]') {
        return { classList: { contains: () => true } };
      }
      return null;
    });
    
    document.querySelectorAll = jest.fn().mockImplementation(() => [
      { offsetParent: {} }, // A visible element
    ]);
    
    const result = validateRouteContent('/dashboard');
    expect(result.isValid).toBeTruthy();
  });
  
  it('should detect invalid content when no selectors match', () => {
    // Mock querySelector to simulate finding no content
    document.querySelector = jest.fn().mockImplementation(() => null);
    document.querySelectorAll = jest.fn().mockImplementation(() => []);
    
    const result = validateRouteContent('/dashboard');
    expect(result.isValid).toBeFalsy();
  });
  
  it('should use fallback patterns when specific route is not defined', () => {
    // Mock querySelector to simulate finding placeholder content
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === '[data-testid="module-placeholder"]') {
        return { classList: { contains: () => true } };
      }
      return null;
    });
    
    const result = validateRouteContent('/unknown-route');
    expect(result.isValid).toBeTruthy();
  });
  
  it('should detect visible content in main element', () => {
    // Mock a main element with content
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === 'main') {
        return {
          clientHeight: 200,
          childElementCount: 3,
          children: [{}, {}, {}],
          innerText: 'Some content here'
        };
      }
      return null;
    });
    
    document.querySelectorAll = jest.fn().mockImplementation(() => [{}, {}, {}]);
    
    const result = hasVisibleContent();
    expect(result).toBeTruthy();
  });
  
  it('should detect no visible content in main element', () => {
    // Mock an empty main element
    document.querySelector = jest.fn().mockImplementation((selector) => {
      if (selector === 'main') {
        return {
          clientHeight: 0,
          childElementCount: 0,
          children: [],
          innerText: ''
        };
      }
      return null;
    });
    
    document.querySelectorAll = jest.fn().mockImplementation(() => []);
    
    const result = hasVisibleContent();
    expect(result).toBeFalsy();
  });
});
