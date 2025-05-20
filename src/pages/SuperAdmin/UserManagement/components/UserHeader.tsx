
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface UserHeaderProps {
  onAddUser: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onAddUser }) => {
  return (
    <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <div>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage system users and their permissions.</CardDescription>
      </div>
      <Button 
        onClick={onAddUser}
        className="mt-4 sm:mt-0"
        size="sm"
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add User
      </Button>
    </CardHeader>
  );
};

export default UserHeader;
