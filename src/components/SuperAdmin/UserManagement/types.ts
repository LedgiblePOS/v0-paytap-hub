
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
}

export interface UserTableSectionProps {
  users: any[];
  loading: boolean;
  isLoading?: boolean;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  totalItems?: number;
  totalUsers: number;
  totalPages: number;
  onEditUser?: (user: any) => void;
  onEdit?: (user: any) => Promise<void>;
  onDeactivateUser?: (user: any) => void;
  onDeactivate?: (user: any) => Promise<void>;
  onResetPassword?: (email: string) => Promise<void>;
  onResetPasswordUser?: (email: string) => void;
  handleEditUser?: (user: any) => void;
  handleResetPassword?: (email: string) => void;
  handleDeactivateUser?: (user: any) => void;
}

export interface UserFiltersProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  searchQuery: string;
  searchTerm?: string;  // Keeping for backward compatibility
  onSearchChange: (query: string) => void;
  handleRefresh?: () => void;
  isLoading?: boolean;
  onRoleChange?: (role: string | null) => void;
}
