
import { renderHook, act } from '@testing-library/react';
import { useUserDialogs } from '../useUserDialogs';

describe('useUserDialogs', () => {
  const mockUser = {
    id: '123',
    first_name: 'John',
    last_name: 'Doe',
    role: 'ADMIN',
    created_at: '2023-01-01T00:00:00Z',
    email: 'john@example.com'
  };

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUserDialogs());
    
    expect(result.current.selectedUser).toBeNull();
    expect(result.current.newUserOpen).toBe(false);
    expect(result.current.editUserOpen).toBe(false);
    expect(result.current.resetPasswordOpen).toBe(false);
    expect(result.current.deactivateUserOpen).toBe(false);
  });

  it('should open new user dialog', () => {
    const { result } = renderHook(() => useUserDialogs());
    
    act(() => {
      result.current.openNewUserDialog();
    });
    
    expect(result.current.newUserOpen).toBe(true);
  });

  it('should open edit user dialog and set selectedUser', () => {
    const { result } = renderHook(() => useUserDialogs());
    
    act(() => {
      result.current.openEditUserDialog(mockUser);
    });
    
    expect(result.current.editUserOpen).toBe(true);
    expect(result.current.selectedUser).toBe(mockUser);
  });

  it('should open reset password dialog and set selectedUser', () => {
    const { result } = renderHook(() => useUserDialogs());
    
    act(() => {
      result.current.openResetPasswordDialog(mockUser);
    });
    
    expect(result.current.resetPasswordOpen).toBe(true);
    expect(result.current.selectedUser).toBe(mockUser);
  });

  it('should open deactivate user dialog and set selectedUser', () => {
    const { result } = renderHook(() => useUserDialogs());
    
    act(() => {
      result.current.openDeactivateUserDialog(mockUser);
    });
    
    expect(result.current.deactivateUserOpen).toBe(true);
    expect(result.current.selectedUser).toBe(mockUser);
  });

  it('should close all dialogs', () => {
    const { result } = renderHook(() => useUserDialogs());
    
    // First open some dialogs
    act(() => {
      result.current.setNewUserOpen(true);
      result.current.setEditUserOpen(true);
      result.current.setResetPasswordOpen(true);
      result.current.setDeactivateUserOpen(true);
    });
    
    expect(result.current.newUserOpen).toBe(true);
    expect(result.current.editUserOpen).toBe(true);
    expect(result.current.resetPasswordOpen).toBe(true);
    expect(result.current.deactivateUserOpen).toBe(true);
    
    // Now close them all
    act(() => {
      result.current.closeAllDialogs();
    });
    
    expect(result.current.newUserOpen).toBe(false);
    expect(result.current.editUserOpen).toBe(false);
    expect(result.current.resetPasswordOpen).toBe(false);
    expect(result.current.deactivateUserOpen).toBe(false);
  });
});
