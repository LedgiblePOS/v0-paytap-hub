
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { UserRole } from '@/types/enums';

export interface UserFiltersProps {
  roleFilter: string | null;
  searchQuery: string;
  onRoleChange: (role: string) => void;
  onSearchChange: (query: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  handleRefresh?: () => void;
  isLoading?: boolean;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  roleFilter,
  searchQuery,
  onRoleChange,
  onSearchChange,
  handleRefresh,
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="w-full md:w-[200px]">
        <Select
          value={roleFilter || ''}
          onValueChange={(value) => onRoleChange(value === '' ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value={UserRole.USER}>User</SelectItem>
            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
            <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {handleRefresh && (
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      )}
    </div>
  );
};

export default UserFilters;
