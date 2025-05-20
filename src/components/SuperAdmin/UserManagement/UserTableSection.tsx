
import React from 'react';
import { UserData } from '@/types/user';
import UserTable from './UserTable';

interface UserTableSectionProps {
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
  handleEditUser?: (user: UserData) => void;
  handleResetPassword?: (email: string) => void;
  handleDeactivateUser?: (userId: string) => void;
}

const UserTableSection: React.FC<UserTableSectionProps> = (props) => {
  return <UserTable {...props} />;
};

export default UserTableSection;
