
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, RefreshCcw } from 'lucide-react';
import { UserRole } from '@/types/enums';
import { debounce } from 'lodash';

interface UserFiltersProps {
  searchQuery: string;
  searchTerm?: string;  // For backward compatibility
  onSearchChange: (query: string) => void;
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onRoleChange?: (role: string | null) => void;
  handleRefresh?: () => void;
  isLoading?: boolean;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchQuery,
  onSearchChange,
  roleFilter,
  setRoleFilter,
  activeTab = 'all',
  setActiveTab = () => {},
  handleRefresh,
  isLoading = false
}) => {
  const debouncedSearch = debounce(onSearchChange, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleRoleChange = (value: string) => {
    const role = value === 'all' ? null : value;
    setRoleFilter(role);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Handle different tabs (e.g., active/inactive users)
    if (value === 'active') {
      // Logic for active users
    } else if (value === 'inactive') {
      // Logic for inactive users
    } else {
      // All users logic
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            defaultValue={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={roleFilter || 'all'}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
              <SelectItem value={UserRole.MERCHANT}>Merchant</SelectItem>
              <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
              <SelectItem value={UserRole.USER}>User</SelectItem>
              <SelectItem value={UserRole.CUSTOMER}>Customer</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default UserFilters;
