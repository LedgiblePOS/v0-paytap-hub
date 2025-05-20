
import { UserData, EditUserData } from "@/types/user";

export interface UserTableSectionProps {
  users: UserData[];
  isLoading?: boolean;
  loading?: boolean;
  onEdit?: (user: UserData) => void;
  onResetPassword?: (email: string) => void;
  onDeactivate?: (userId: string) => void;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
  totalUsers?: number;
  totalPages?: number;
  onEditUser?: (user: UserData) => void;
  onDeactivateUser?: (user: UserData) => void;
  handleEditUser?: (user: UserData) => void;
  handleResetPassword?: (email: string) => void;
  handleDeactivateUser?: (user: UserData) => void;
}

export interface UserDialogsSectionProps {
  isCreateDialogOpen: boolean;
  setCreateDialogOpen: (open: boolean) => void;
  isResetPasswordDialogOpen: boolean;
  setResetPasswordDialogOpen: (open: boolean) => void;
  selectedUserEmail: string;
  setSelectedUserEmail: (email: string) => void;
  isDeleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  selectedUserId: string;
  setSelectedUserId: (id: string) => void;
  handleCreateUser: (userData: any) => Promise<void>;
  handleResetPassword: () => Promise<void>;
  handleDeleteUser: () => Promise<void>;
  isLoading?: boolean;
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
