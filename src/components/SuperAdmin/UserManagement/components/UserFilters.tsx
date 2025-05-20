
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';

export interface UserFiltersProps {
  roleFilter: string | null;
  onRoleChange: (role: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  handleRefresh?: () => Promise<void> | void;
  isLoading?: boolean;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  roleFilter,
  onRoleChange,
  searchQuery,
  onSearchChange,
  handleRefresh,
  isLoading = false
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
      <div className="flex gap-2">
        <Select 
          value={roleFilter || ''} 
          onValueChange={(value) => onRoleChange(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MERCHANT">Merchant</SelectItem>
            <SelectItem value="STAFF">Staff</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => handleRefresh && handleRefresh()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default UserFilters;
