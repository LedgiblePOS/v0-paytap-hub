
/**
 * Common utility types used across the application
 */

// Generic pagination params
export interface PaginationParams {
  page: number;
  limit: number;
}

// Generic pagination response
export interface PaginatedResponse<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Generic API response
export interface ApiResponse<T> {
  status: 'success' | 'error' | 'warning';
  message?: string;
  data?: T;
  error?: {
    code?: string;
    message: string;
    details?: any;
  };
}

// Date range
export interface DateRange {
  startDate: string;
  endDate: string;
}

// ID parameter
export interface IdParam {
  id: string;
}

// Generic sorting parameters
export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

// Generic filter parameters
export type FilterParams = Record<string, any>;

// Generic query parameters
export interface QueryParams {
  pagination?: PaginationParams;
  sort?: SortParams;
  filters?: FilterParams;
  search?: string;
  dateRange?: DateRange;
}

// Common props for all components
export interface BaseComponentProps {
  className?: string;
  id?: string;
  testId?: string;
}
