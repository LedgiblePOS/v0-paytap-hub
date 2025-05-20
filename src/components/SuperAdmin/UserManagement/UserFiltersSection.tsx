
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCcw } from 'lucide-react';

interface UserFiltersSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setFilterRole: (role: string) => void;
  handleRefresh: () => void;
  isLoading: boolean;
  setNewUserOpen: (open: boolean) => void;
}

const UserFiltersSection: React.FC<UserFiltersSectionProps> = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  setFilterRole,
  handleRefresh,
  isLoading
}) => {
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFilterRole(tab);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeTab === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTabChange('')}
        >
          All
        </Button>
        <Button
          variant={activeTab === 'admin' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTabChange('admin')}
        >
          Admins
        </Button>
        <Button
          variant={activeTab === 'merchant' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTabChange('merchant')}
        >
          Merchants
        </Button>
        <Button
          variant={activeTab === 'user' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTabChange('user')}
        >
          Users
        </Button>
      </div>
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search users..."
          className="pl-8 pr-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default UserFiltersSection;
