
import { UserRole } from '@/types/enums';

export interface UserFiltersProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  roleFilter: string | null | UserRole;
  setRoleFilter: (role: string | null) => void;
  searchQuery?: string;
  searchTerm?: string;  // Keeping for backward compatibility
  onSearchChange: (query: string) => void;
  handleRefresh?: () => void;
  isLoading?: boolean;
}
