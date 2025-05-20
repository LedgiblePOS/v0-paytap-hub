
import { useState, useCallback } from 'react';
import { UserRole } from '@/types/user';

export const useFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | null>(null);
  
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleRoleChange = useCallback((value: UserRole | null) => {
    setRoleFilter(value);
  }, []);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return {
    searchTerm,
    setSearchTerm: handleSearchChange,
    activeTab,
    setActiveTab: handleTabChange,
    roleFilter,
    setRoleFilter: handleRoleChange,
  };
};
