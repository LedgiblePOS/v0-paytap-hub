
import { UserData, EditUserData } from '@/types/user';

export interface UserTableSectionProps {
  users: UserData[];
  isLoading?: boolean;
  loading?: boolean; // Keep both for backward compatibility
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onEdit: (user: UserData) => void;
  onDeactivate?: (userId: string) => void; // Optional for compatibility
  onDeactivateUser?: (userId: string) => void; // Optional for compatibility
  onResetPassword: (email: string) => void;
  totalUsers?: number; // Added for compatibility with components that expect it
}

export interface UserFilterSectionProps {
  roleFilter: string | null;
  searchQuery: string;
  onRoleChange: (role: string) => void;
  onSearchChange: (query: string) => void;
}
