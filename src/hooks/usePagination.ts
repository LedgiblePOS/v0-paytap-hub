
import { useState, useCallback } from 'react';

interface PaginationHookResult {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotal: (total: number) => void;
  resetPagination: () => void;
}

export const usePagination = (initialPage = 1, initialSize = 10): PaginationHookResult => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [total, setTotal] = useState(0);

  const resetPagination = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    currentPage,
    pageSize,
    total,
    totalPages,
    setCurrentPage,
    setPageSize,
    setTotal,
    resetPagination
  };
};

export default usePagination;
