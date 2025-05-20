
// Mock props for testing UserFilters component
export const getMockUserFiltersProps = () => ({
  activeTab: 'all',
  setActiveTab: jest.fn(),
  roleFilter: null,
  setRoleFilter: jest.fn(),
  searchQuery: '',
  onRoleChange: jest.fn(),
  onSearchChange: jest.fn()
});
