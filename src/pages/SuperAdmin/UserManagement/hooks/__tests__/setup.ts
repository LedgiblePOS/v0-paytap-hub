// Setup file for tests
import '@testing-library/jest-dom';

// Mock ResizeObserver which isn't available in the test environment
global.ResizeObserver = class ResizeObserver {
  observe() {
    // Do nothing
  }
  unobserve() {
    // Do nothing
  }
  disconnect() {
    // Do nothing
  }
};

// Mock matchMedia which isn't available in the test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  
  constructor(
    private callback: IntersectionObserverCallback,
    private options?: IntersectionObserverInit
  ) {}
  
  observe() { return; }
  unobserve() { return; }
  disconnect() { return; }
  takeRecords(): IntersectionObserverEntry[] { return []; }
}

// Assign the mock implementation to the global object
global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Add a helper to warn about console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    args[0].includes('Warning: An update to')
  ) {
    return; // Ignore React act warnings
  }
  originalConsoleError(...args);
};

// Add a global afterEach hook to check for unmocked functions
afterEach(() => {
  jest.restoreAllMocks();
});

// Other common test setup can be included here
beforeAll(() => {
  // Set up any global test configurations
  jest.useFakeTimers();
});

afterAll(() => {
  // Clean up any global test configurations
  jest.useRealTimers();
});
