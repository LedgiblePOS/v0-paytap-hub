
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SuperAdminRoutes from '../SuperAdminRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the pages that would be loaded through routes
jest.mock('@/pages/SuperAdmin/Index', () => ({
  __esModule: true,
  default: () => <div data-testid="super-admin-dashboard">Super Admin Dashboard</div>
}));

jest.mock('@/pages/SuperAdmin/UserManagement/Index', () => ({
  __esModule: true,
  default: () => <div data-testid="user-management">User Management</div>
}));

jest.mock('@/pages/SuperAdmin/Security', () => ({
  __esModule: true,
  default: () => <div data-testid="security-page">Security Page</div>
}));

jest.mock('@/utils/errorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

jest.mock('@/components/common/LoadingFallback', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>
}));

jest.mock('@/pages/NotFound', () => ({
  __esModule: true,
  default: () => <div data-testid="not-found">Not Found</div>
}));

describe('SuperAdminRoutes Component', () => {
  const createWrapper = (path = '/') => {
    const queryClient = new QueryClient();
    
    return ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={[`/super-admin${path}`]}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </MemoryRouter>
    );
  };
  
  it('renders with data-testid attribute for content detection', () => {
    render(<SuperAdminRoutes />, { wrapper: createWrapper() });
    
    expect(screen.getByTestId('super-admin-routes')).toBeInTheDocument();
    expect(screen.getByTestId('super-admin-routes')).toHaveAttribute('data-content-ready', 'true');
  });
  
  it('renders the dashboard at root route', () => {
    render(<SuperAdminRoutes />, { wrapper: createWrapper('/') });
    
    // Verify dashboard component is rendered
    expect(screen.getByTestId('super-admin-dashboard')).toBeInTheDocument();
  });
  
  it('renders the user management page at /users route', () => {
    render(<SuperAdminRoutes />, { wrapper: createWrapper('/users') });
    
    // Verify user management component is rendered
    expect(screen.getByTestId('user-management')).toBeInTheDocument();
  });
  
  it('renders the security page at /security route', () => {
    render(<SuperAdminRoutes />, { wrapper: createWrapper('/security') });
    
    // Verify security component is rendered
    expect(screen.getByTestId('security-page')).toBeInTheDocument();
  });
  
  // Additional tests for other routes could be added here
});
