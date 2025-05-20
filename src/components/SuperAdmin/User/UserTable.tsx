
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';
import { UserData } from '@/utils/modelConversions/userConverters';

export interface UserTableSectionProps {
  users: UserData[];
  totalUsers: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  handleEditUser: (user: UserData) => void;
  handleResetPassword: (user: UserData) => void;
  handleDeactivateUser: (user: UserData) => void;
}

const UserTable: React.FC<UserTableSectionProps> = ({
  users,
  loading,
  handleEditUser,
  handleResetPassword,
  handleDeactivateUser
}) => {
  if (loading) {
    return <div className="py-8 text-center">Loading users...</div>;
  }

  if (!users || users.length === 0) {
    return <div className="py-8 text-center">No users found</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{user.role}</Badge>
              </TableCell>
              <TableCell>
                {user.is_active ? (
                  <Badge variant="default" className="bg-green-500">Active</Badge>
                ) : (
                  <Badge variant="outline" className="text-red-500">Inactive</Badge>
                )}
              </TableCell>
              <TableCell>{formatDate(user.created_at)}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResetPassword(user)}
                >
                  Reset Password
                </Button>
                <Button
                  variant={user.is_active ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleDeactivateUser(user)}
                >
                  {user.is_active ? "Deactivate" : "Activate"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
