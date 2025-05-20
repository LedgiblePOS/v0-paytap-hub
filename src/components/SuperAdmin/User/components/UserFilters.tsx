
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RefreshCw, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserFiltersProps } from '@/components/SuperAdmin/UserManagement/types';

const UserFilters: React.FC<UserFiltersProps> = ({
  roleFilter,
  setRoleFilter,
  searchQuery = '',
  searchTerm = '',
  onSearchChange,
  handleRefresh,
  isLoading = false,
  activeTab = 'all',
  setActiveTab,
}) => {
  // Handle search changes
  const handleSearch = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    }
  };
  
  // Use either searchQuery or searchTerm, preferring searchQuery
  const searchValue = searchQuery || searchTerm;

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-6">
      <div className="w-full md:w-1/3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Select
          value={roleFilter || ''}
          onValueChange={(value) => setRoleFilter(value || null)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MERCHANT">Merchant</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
          </SelectContent>
        </Select>
        
        {handleRefresh && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserFilters;
