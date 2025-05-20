
/**
 * Jest setup file for security testing
 */

// Mock crypto API for tests
global.crypto = {
  randomUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  // Add other required crypto methods as needed
  subtle: {
    // Mock implementations as needed
  } as any,
  getRandomValues: (arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }
} as any;

// Mock fetch for API tests
global.fetch = jest.fn().mockImplementation((url, options) => {
  // Default successful response
  return Promise.resolve({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: () => Promise.resolve({ success: true }),
    headers: new Headers({
      'strict-transport-security': 'max-age=31536000; includeSubDomains',
      'x-frame-options': 'DENY',
      'x-content-type-options': 'nosniff',
      'content-security-policy': "default-src 'self'",
      'referrer-policy': 'strict-origin-when-cross-origin'
    })
  });
});

// Mock supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            access_token: 'mock-token',
            user: { id: 'mock-user-id' }
          }
        }
      }),
      getUser: jest.fn().mockResolvedValue({
        data: {
          user: { id: 'mock-user-id', email: 'test@example.com' }
        },
        error: null
      })
    },
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              id: 'mock-user-id',
              first_name: 'Test',
              last_name: 'User',
              role: 'MERCHANT'
            },
            error: null
          })
        })
      })
    })
  }
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
