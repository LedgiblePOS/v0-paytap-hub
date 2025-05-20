
import { renderHook, act } from '@testing-library/react';
import { useUserFilters } from '../useUserFilters';

describe('useUserFilters', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUserFilters());
    
    expect(result.current.roleFilter).toBeNull();
    expect(result.current.searchQuery).toBe('');
  });

  it('should update role filter when handleRoleChange is called', () => {
    const { result } = renderHook(() => useUserFilters());
    
    act(() => {
      result.current.handleRoleChange('ADMIN');
    });
    
    expect(result.current.roleFilter).toBe('ADMIN');
  });

  it('should update search query when handleSearchChange is called', () => {
    const { result } = renderHook(() => useUserFilters());
    
    act(() => {
      result.current.handleSearchChange('john');
    });
    
    expect(result.current.searchQuery).toBe('john');
  });

  it('should set roleFilter to null when cleared', () => {
    const { result } = renderHook(() => useUserFilters());
    
    // First set a value
    act(() => {
      result.current.handleRoleChange('ADMIN');
    });
    
    expect(result.current.roleFilter).toBe('ADMIN');
    
    // Then clear it
    act(() => {
      result.current.handleRoleChange(null);
    });
    
    expect(result.current.roleFilter).toBeNull();
  });
});
