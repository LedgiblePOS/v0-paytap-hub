
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export interface UserManagementHeaderProps {
  onCreateNew: () => void;
  isLoading: boolean;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({
  onCreateNew,
  isLoading
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          Add, edit, and manage user accounts and permissions.
        </p>
      </div>
      <Button onClick={onCreateNew} disabled={isLoading}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Create User
      </Button>
    </div>
  );
};

export default UserManagementHeader;
