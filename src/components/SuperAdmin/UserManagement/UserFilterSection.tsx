import React from 'react';
import { UserRole } from '@/types/enums';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Search, Plus, X } from 'lucide-react';

export interface UserFilterSectionProps {
  roleFilter: UserRole | string | null;
  searchQuery?: string;
  onRoleChange: (role: string) => void;
  onSearchChange: (query: string) => void;
  handleRefresh?: () => void;
  isLoading?: boolean;
  setNewUserOpen?: (open: boolean) => void;
}

const UserFilterSection: React.FC<UserFilterSectionProps> = ({
  roleFilter,
  searchQuery = '',
  onRoleChange,
  onSearchChange,
  handleRefresh,
  isLoading = false,
  setNewUserOpen
}) => {
  const handleRoleChange = (value: string) => {
    onRoleChange(value === 'ALL' ? '' : value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleCreateUser = () => {
    if (setNewUserOpen) {
      setNewUserOpen(true);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="search-users" className="text-sm font-medium mb-2 block">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search-users"
                placeholder="Search by name or email..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="w-full md:w-[180px]">
            <label htmlFor="role-filter" className="text-sm font-medium mb-2 block">
              Filter by Role
            </label>
            <Select
              value={roleFilter || 'ALL'}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger id="role-filter">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value={UserRole.SUPER_ADMIN}>Super Admin</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.MERCHANT}>Merchant</SelectItem>
                <SelectItem value={UserRole.USER}>User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {handleRefresh && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                disabled={isLoading}
                aria-label="Refresh users"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            
            {setNewUserOpen && (
              <Button onClick={handleCreateUser} className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserFilterSection;
