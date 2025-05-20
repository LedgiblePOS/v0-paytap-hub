
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface UserHeaderProps {
  onAddUser: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onAddUser }) => {
  return (
    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage user accounts, permissions and roles.
        </CardDescription>
      </div>
      <Button onClick={onAddUser} className="mt-4 sm:mt-0">
        <Plus className="mr-2 h-4 w-4" />
        Add User
      </Button>
    </CardHeader>
  );
};

export default UserHeader;
