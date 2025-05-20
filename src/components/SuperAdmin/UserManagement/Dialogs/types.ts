
import { UserData, EditUserData } from "@/types/user";

export interface NewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userData: any) => Promise<boolean>;
  onCreateUser?: (userData: any) => Promise<any>;
  onCreate?: (userData: any) => Promise<any>;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isLoading?: boolean;
}

export interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: EditUserData;
  userData?: EditUserData;
  onUpdate?: (userData: EditUserData) => Promise<boolean>;
  onUpdateUser?: (userData: EditUserData) => Promise<any>;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export interface DeactivateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  onDeactivate?: () => Promise<boolean | void>;
}

export interface UserTableProps {
  users: UserData[];
  isLoading?: boolean;
  loading?: boolean;
  onEdit?: (user: UserData) => void;
  onEditUser?: (user: UserData) => void;
  onResetPassword?: (email: string) => void;
  onDeactivate?: (userId: string) => void;
  onDeactivateUser?: (userId: string) => void;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
  totalUsers?: number;
  totalPages?: number;
  handleEditUser?: (user: UserData) => void;
  handleResetPassword?: (email: string) => void;
  handleDeactivateUser?: (userId: string) => void;
}
