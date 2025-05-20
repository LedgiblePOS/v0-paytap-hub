
import { renderHook, act } from '@testing-library/react';
import { useUserActions } from '../useUserActions';
import { useToast } from '@/hooks/use-toast';

// Mock the dependencies
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn().mockReturnValue({
    toast: jest.fn()
  })
}));

describe('useUserActions', () => {
  const mockUser = {
    id: '123',
    first_name: 'John',
    last_name: 'Doe',
    role: 'ADMIN',
    created_at: '2023-01-01T00:00:00Z',
    email: 'john@example.com'
  };

  const mockUsers = [mockUser];
  const mockRefreshUsers = jest.fn().mockResolvedValue(undefined);
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('should initialize with actionLoading as false', () => {
    const { result } = renderHook(() => useUserActions(mockRefreshUsers));
    
    expect(result.current.actionLoading).toBe(false);
  });

  it('should return the user when handleEditUser is called', () => {
    const { result } = renderHook(() => useUserActions(mockRefreshUsers));
    
    const returnedUser = result.current.handleEditUser(mockUser);
    
    expect(returnedUser).toBe(mockUser);
  });

  it('should find and return user when handleResetPassword is called with valid email', () => {
    const { result } = renderHook(() => useUserActions(mockRefreshUsers));
    
    const returnedUser = result.current.handleResetPassword('john@example.com', mockUsers);
    
    expect(returnedUser).toBe(mockUser);
  });

  it('should show error toast and return null when handleResetPassword is called with invalid email', () => {
    const { result } = renderHook(() => useUserActions(mockRefreshUsers));
    
    const returnedUser = result.current.handleResetPassword('nonexistent@example.com', mockUsers);
    
    expect(returnedUser).toBeNull();
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'User not found',
      variant: 'destructive',
    });
  });

  it('should find and return user when handleDeactivateUser is called with valid id', () => {
    const { result } = renderHook(() => useUserActions(mockRefreshUsers));
    
    const returnedUser = result.current.handleDeactivateUser('123', mockUsers);
    
    expect(returnedUser).toBe(mockUser);
  });

  it('should show error toast and return null when handleDeactivateUser is called with invalid id', () => {
    const { result } = renderHook(() => useUserActions(mockRefreshUsers));
    
    const returnedUser = result.current.handleDeactivateUser('999', mockUsers);
    
    expect(returnedUser).toBeNull();
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Error',
      description: 'User not found',
      variant: 'destructive',
    });
  });

  it('should execute deactivate user action and refresh users', async () => {
    const { result } = renderHook(() => useUserActions(mockRefreshUsers));
    
    await act(async () => {
      await result.current.executeDeactivateUser(mockUser);
    });
    
    expect(mockToast).toHaveBeenCalledWith({
      title: 'User Deactivated',
      description: 'John Doe has been deactivated.',
    });
    expect(mockRefreshUsers).toHaveBeenCalledTimes(1);
  });
});
