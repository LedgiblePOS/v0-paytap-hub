
import { useState, useCallback } from 'react';

export function useUserFilters() {
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleRoleChange = useCallback((role: string) => {
    setRoleFilter(role === '' ? null : role);
  }, []);
  
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
  return {
    roleFilter,
    searchQuery,
    handleRoleChange,
    handleSearchChange,
    setRoleFilter,
    setSearchQuery
  };
}
