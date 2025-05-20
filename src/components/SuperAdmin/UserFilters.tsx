
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';
import { UserRole } from '@/types/enums';

export interface UserFiltersProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  roleFilter: string | null | UserRole;
  setRoleFilter: (role: string | null) => void;
  searchQuery: string; // Add this property
  onSearchChange: (query: string) => void;
  handleRefresh?: () => void;
  isLoading?: boolean;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  activeTab,
  setActiveTab,
  roleFilter,
  setRoleFilter,
  searchQuery,
  onSearchChange,
  handleRefresh,
  isLoading = false,
}) => {
  

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Tab buttons if activeTab and setActiveTab are provided */}
      {activeTab && setActiveTab && (
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('all')}
          >
            All Users
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'active' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'inactive' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('inactive')}
          >
            Inactive
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-1/3">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="w-full md:w-1/4">
          <Select 
            value={roleFilter || ''} 
            onValueChange={(value) => setRoleFilter(value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="MERCHANT">Merchant</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {handleRefresh && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="ml-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserFilters;
