
import React from 'react';
import { render, screen } from '@testing-library/react';
import { SuperAdminNavItems } from '../../navigation/SuperAdminNavItems';
import { MemoryRouter } from 'react-router-dom';

describe('SuperAdminNavItems', () => {
  it('should contain all required navigation items', () => {
    // Render each nav item in a simple component for testing
    const NavItemsTest = () => (
      <ul>
        {SuperAdminNavItems.map((item, index) => (
          <li key={index} data-testid={`nav-item-${index}`}>
            <span data-testid={`nav-title-${index}`}>{item.title}</span>
            <span data-testid={`nav-href-${index}`}>{item.href}</span>
          </li>
        ))}
      </ul>
    );
    
    render(
      <MemoryRouter>
        <NavItemsTest />
      </MemoryRouter>
    );
    
    // Verify essential super admin navigation items exist
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Merchant Reports')).toBeInTheDocument();
    expect(screen.getByText('Merchant Verifications')).toBeInTheDocument();
    expect(screen.getByText('Audit Logs')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    
    // Check that all items have the correct /super-admin prefix
    SuperAdminNavItems.forEach((_, index) => {
      const href = screen.getByTestId(`nav-href-${index}`).textContent;
      if (href && href !== '#') {
        expect(href.startsWith('/super-admin')).toBeTruthy();
      }
    });
  });
});
