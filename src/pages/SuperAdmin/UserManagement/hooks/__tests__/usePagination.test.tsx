
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';

describe('usePagination', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePagination());
    
    expect(result.current.currentPage).toBe(1);
    expect(result.current.pageSize).toBe(10);
  });

  it('should initialize with custom values when provided', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 2, initialPageSize: 25 }));
    
    expect(result.current.currentPage).toBe(2);
    expect(result.current.pageSize).toBe(25);
  });

  it('should update current page when setCurrentPage is called', () => {
    const { result } = renderHook(() => usePagination());
    
    act(() => {
      result.current.setCurrentPage(3);
    });
    
    expect(result.current.currentPage).toBe(3);
  });

  it('should update page size when setPageSize is called', () => {
    const { result } = renderHook(() => usePagination());
    
    act(() => {
      result.current.setPageSize(50);
    });
    
    expect(result.current.pageSize).toBe(50);
  });

  it('should reset to page 1 when resetPagination is called', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 5 }));
    
    expect(result.current.currentPage).toBe(5);
    
    act(() => {
      result.current.resetPagination();
    });
    
    expect(result.current.currentPage).toBe(1);
    // Page size should remain unchanged
    expect(result.current.pageSize).toBe(10);
  });
});
