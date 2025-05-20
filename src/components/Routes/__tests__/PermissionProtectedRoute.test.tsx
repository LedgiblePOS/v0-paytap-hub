
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PermissionProtectedRoute from '../PermissionProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/utils/permissions/types';

// Mock the useAuth hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock the hasPermission utility
jest.mock('@/utils/permissions/permissionCheck', () => ({
  hasPermission: jest.fn(),
}));

// Setup test component
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

describe('PermissionProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders loading state when authentication is being checked', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: true,
      isAuthenticated: false,
      user: null,
    });
    
    render(
      <BrowserRouter>
        <PermissionProtectedRoute requiredPermission={Permission.VIEW_USERS}>
          <TestComponent />
        </PermissionProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByText('Checking permissions...')).toBeInTheDocument();
  });
  
  it('renders protected content when user has permission', () => {
    // Mock authentication and permission check
    (useAuth as jest.Mock).mockReturnValue({
      isLoading: false,
      isAuthenticated: true,
      user: { id: '1', role: 'SUPER_ADMIN' },
    });
    
    // Import and mock the hasPermission function
    const { hasPermission } = require('@/utils/permissions/permissionCheck');
    (hasPermission as jest.Mock).mockReturnValue(true);
    
    render(
      <BrowserRouter>
        <PermissionProtectedRoute requiredPermission={Permission.VIEW_USERS}>
          <TestComponent />
        </PermissionProtectedRoute>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
  
  // Note: Navigate redirects can't be fully tested without a more complex setup
  // This would typically be tested with a custom render function and memory router
});
