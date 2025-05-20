
import React from 'react';
import { UserData, toEditUserData } from '@/types/user';

export interface UserTableProps {
  users: UserData[];
  isLoading?: boolean;
  loading?: boolean;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onEdit: (user: UserData) => void;
  onDeactivateUser: (userId: string) => void;
  onResetPassword: (email: string) => void;
  totalUsers?: number;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  onEdit,
  onDeactivateUser,
  onResetPassword,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange
}) => {
  // Implement the table UI component
  return (
    <div>
      {/* Your user table implementation here */}
      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.first_name} {user.last_name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <button onClick={() => onEdit(user)}>Edit</button>
                <button onClick={() => onResetPassword(user.email)}>Reset Password</button>
                <button onClick={() => onDeactivateUser(user.id)}>Deactivate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
