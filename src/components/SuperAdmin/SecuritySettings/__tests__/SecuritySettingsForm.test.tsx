
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SecuritySettingsForm from '../../SecuritySettings/SecuritySettingsForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn()
}));

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockImplementation(() => ({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          error: null
        })
      }),
      insert: jest.fn().mockResolvedValue({
        error: null
      })
    })),
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: {
          user: { id: 'test-user-id' }
        }
      })
    }
  }
}));

jest.mock('../../Security/SecurityNotice', () => ({
  __esModule: true,
  default: () => <div data-testid="security-notice">Security Notice</div>
}));

describe('SecuritySettingsForm Component', () => {
  const mockDefaultValues = {
    password_min_length: 8,
    password_require_special_chars: true,
    password_require_numbers: true,
    max_login_attempts: 5,
    session_timeout: 60
  };
  
  const mockOnSettingsSaved = jest.fn();
  const mockToast = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });
  
  it('renders with default values', () => {
    render(
      <SecuritySettingsForm 
        defaultValues={mockDefaultValues}
        onSettingsSaved={mockOnSettingsSaved}
      />
    );
    
    expect(screen.getByText('Security Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Password Minimum Length')).toHaveValue(8);
    expect(screen.getByTestId('security-notice')).toBeInTheDocument();
  });
  
  it('calls onSettingsSaved when form is submitted successfully', async () => {
    render(
      <SecuritySettingsForm 
        defaultValues={mockDefaultValues}
        onSettingsSaved={mockOnSettingsSaved}
      />
    );
    
    // Submit the form without changing values
    fireEvent.click(screen.getByText('Save Settings'));
    
    await waitFor(() => {
      expect(mockOnSettingsSaved).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Security settings updated",
      }));
    });
  });
  
  it('shows error toast when update fails', async () => {
    // Mock a failed update
    (supabase.from as jest.Mock).mockImplementationOnce(() => ({
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          error: { message: 'Update failed' }
        })
      })
    }));
    
    render(
      <SecuritySettingsForm 
        defaultValues={mockDefaultValues}
        onSettingsSaved={mockOnSettingsSaved}
      />
    );
    
    fireEvent.click(screen.getByText('Save Settings'));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: "Error",
        variant: "destructive"
      }));
      expect(mockOnSettingsSaved).not.toHaveBeenCalled();
    });
  });
});
