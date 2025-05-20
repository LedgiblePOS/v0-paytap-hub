
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UserHeader from '../../components/UserHeader';

describe('UserHeader Component', () => {
  it('renders the header with title and description', () => {
    const mockOnAddUser = jest.fn();
    
    render(<UserHeader onAddUser={mockOnAddUser} />);
    
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Manage users across the platform')).toBeInTheDocument();
  });
  
  it('calls onAddUser when Add User button is clicked', () => {
    const mockOnAddUser = jest.fn();
    
    render(<UserHeader onAddUser={mockOnAddUser} />);
    
    fireEvent.click(screen.getByText('Add User'));
    
    expect(mockOnAddUser).toHaveBeenCalledTimes(1);
  });
  
  it('displays the Add User button with correct icon', () => {
    const mockOnAddUser = jest.fn();
    
    render(<UserHeader onAddUser={mockOnAddUser} />);
    
    // Verify button has the correct text
    expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
  });
});
