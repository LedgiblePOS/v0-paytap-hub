
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserFilters from '../UserFilters';

describe('UserFilters', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: jest.fn(),
    roleFilter: null,
    setRoleFilter: jest.fn(),
    activeTab: 'all',
    setActiveTab: jest.fn(),
    handleRefresh: jest.fn(),
  };

  it('renders search input and role filter', () => {
    render(<UserFilters {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument();
    expect(screen.getByText('All Roles')).toBeInTheDocument();
  });

  it('calls onSearchChange when search input changes', () => {
    render(<UserFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search users...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Allow for debounce
    setTimeout(() => {
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test');
    }, 400);
  });

  it('calls setRoleFilter when role filter changes', () => {
    render(<UserFilters {...defaultProps} />);
    
    // Open dropdown
    fireEvent.click(screen.getByText('All Roles'));
    
    // Click on a role
    fireEvent.click(screen.getByText('Admin'));
    
    expect(defaultProps.setRoleFilter).toHaveBeenCalledWith('ADMIN');
  });

  it('calls handleRefresh when refresh button is clicked', () => {
    render(<UserFilters {...defaultProps} />);
    
    // Find and click refresh button (look for button with refresh icon)
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);
    
    expect(defaultProps.handleRefresh).toHaveBeenCalled();
  });

  it('changes tab when tab is clicked', () => {
    render(<UserFilters {...defaultProps} />);
    
    // Click inactive tab
    fireEvent.click(screen.getByRole('tab', { name: /inactive/i }));
    
    expect(defaultProps.setActiveTab).toHaveBeenCalledWith('inactive');
  });
});
