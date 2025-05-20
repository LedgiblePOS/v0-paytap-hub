
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentSettings from '@/components/Payments/PaymentSettings';
import checkoutService from '@/services/checkout/checkoutService';

// Mock the checkout service
jest.mock('@/services/checkout/checkoutService', () => ({
  toggleBridgeMode: jest.fn(),
  toggleCBDCMode: jest.fn(),
  isBridgeEnabled: jest.fn().mockReturnValue(false),
  isCBDCEnabled: jest.fn().mockReturnValue(false)
}));

describe('PaymentSettings Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders payment settings with correct initial state', () => {
    render(
      <PaymentSettings 
        useBridge={false}
        useCBDC={false}
        isLoading={false}
        onToggleBridge={() => {}}
        onToggleCBDC={() => {}}
      />
    );
    
    // Check for the component title
    expect(screen.getByText(/payment settings/i)).toBeInTheDocument();
    
    // Check for switches/toggles
    const toggles = screen.getAllByRole('switch');
    expect(toggles.length).toBeGreaterThan(0);
    
    // Both should be off initially based on our mock
    toggles.forEach(toggle => {
      expect(toggle).not.toBeChecked();
    });
  });

  test('toggles bridge mode when switch is clicked', () => {
    const handleToggleBridge = jest.fn();
    
    render(
      <PaymentSettings 
        useBridge={false}
        useCBDC={false}
        isLoading={false}
        onToggleBridge={handleToggleBridge}
        onToggleCBDC={() => {}}
      />
    );
    
    // Find the bridge mode switch
    const bridgeToggle = screen.getAllByRole('switch')[1]; // Advanced settings section, first toggle
    
    // Click the toggle
    fireEvent.click(bridgeToggle);
    
    // Check if the handler function was called
    expect(handleToggleBridge).toHaveBeenCalledWith(true);
  });

  test('toggles CBDC mode when switch is clicked', () => {
    const handleToggleCBDC = jest.fn();
    
    render(
      <PaymentSettings 
        useBridge={false}
        useCBDC={false}
        isLoading={false}
        onToggleBridge={() => {}}
        onToggleCBDC={handleToggleCBDC}
      />
    );
    
    // Find the CBDC mode switch (in Payment Methods card)
    const cbdcToggle = screen.getAllByRole('switch')[2];
    
    // Click the toggle
    fireEvent.click(cbdcToggle);
    
    // Check if the handler function was called
    expect(handleToggleCBDC).toHaveBeenCalledWith(true);
  });
});
