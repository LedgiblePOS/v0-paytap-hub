
import React from 'react';
import { UserData } from '@/types/user';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, RefreshCw, User, X } from 'lucide-react';
import { PaginationContainer } from './PaginationContainer';

export interface UserTableProps {
  users: UserData[];
  isLoading?: boolean;
  loading?: boolean;
  currentPage: number;
  pageSize: number;
  totalUsers: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  handleEditUser?: (user: UserData) => void;
  handleResetPassword?: (user: UserData) => void;
  handleDeactivateUser?: (user: UserData) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading = false,
  loading = false,
  currentPage,
  pageSize,
  totalUsers,
  totalPages,
  onPageChange,
  onPageSizeChange,
  handleEditUser,
  handleResetPassword,
  handleDeactivateUser
}) => {
  const actualLoading = isLoading || loading;

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actualLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-500" />
                  <span className="mt-2 block text-gray-500">Loading users...</span>
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <User className="h-10 w-10 mx-auto text-gray-300" />
                  <span className="mt-2 block text-gray-500">No users found</span>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id.slice(0, 8)}...</TableCell>
                  <TableCell>
                    {user.firstName || user.first_name} {user.lastName || user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role.toString().toLowerCase().replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active || user.isActive ? "default" : "secondary"}>
                      {user.is_active || user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser && handleEditUser(user)}
                        title="Edit User"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeactivateUser && handleDeactivateUser(user)}
                        title={user.is_active || user.isActive ? "Deactivate User" : "Activate User"}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationContainer
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default UserTable;
