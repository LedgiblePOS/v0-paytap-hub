
export interface UserFiltersProps {
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  handleRefresh?: () => void;
  isLoading?: boolean;
}
