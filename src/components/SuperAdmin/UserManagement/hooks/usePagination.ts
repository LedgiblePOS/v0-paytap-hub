
import { useState, useCallback } from 'react';

interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
}

interface UsePaginationReturn extends PaginationState {
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotal: (total: number) => void;
  totalPages: number;
  resetPagination: () => void;
}

export function usePagination(
  initialPage = 1,
  initialPageSize = 10,
  initialTotal = 0
): UsePaginationReturn {
  const [state, setState] = useState<PaginationState>({
    currentPage: initialPage,
    pageSize: initialPageSize,
    total: initialTotal
  });

  const setCurrentPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setState(prev => ({ ...prev, pageSize: size }));
  }, []);

  const setTotal = useCallback((total: number) => {
    setState(prev => ({ ...prev, total }));
  }, []);

  const resetPagination = useCallback(() => {
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const totalPages = Math.max(1, Math.ceil(state.total / state.pageSize));

  return {
    ...state,
    setCurrentPage,
    setPageSize,
    setTotal,
    totalPages,
    resetPagination
  };
}
