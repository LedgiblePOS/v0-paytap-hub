
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import useSalesProjections from '@/hooks/useSalesProjections';
import salesProjector from '@/services/projections/salesProjector';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/services/projections/salesProjector');
jest.mock('sonner');

describe('useSalesProjections Hook', () => {
  // Mock data
  const mockUser = {
    id: 'user-1',
    merchant_id: 'merchant-1'
  };
  
  const mockProjections = [
    {
      period: 'January 2025',
      projectedSales: 10000,
      confidenceLevel: 'medium' as const,
      growthRate: 0.05
    },
    {
      period: 'February 2025',
      projectedSales: 12000,
      confidenceLevel: 'medium' as const,
      growthRate: 0.05
    }
  ];
  
  // Setup mocks
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useAuth to return the mock user
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    
    // Mock projectMonthlySales to return mock projections
    (salesProjector.projectMonthlySales as jest.Mock).mockResolvedValue(mockProjections);
  });
  
  test('should load projections on mount', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSalesProjections());
    
    // Initially should be loading
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the projections to load
    await waitForNextUpdate();
    
    // Now should have projections and not be loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.projections).toEqual(mockProjections);
    
    // Should have calculated the derived values correctly
    expect(result.current.totalProjectedRevenue).toBe(22000); // Sum of all projections
    expect(result.current.averageMonthlyRevenue).toBe(11000); // Average
    expect(result.current.confidenceLevel).toBe('medium');
    
    // Should have called projectMonthlySales with the merchant ID and default timeframe (6 months)
    expect(salesProjector.projectMonthlySales).toHaveBeenCalledWith('merchant-1', 6);
  });
  
  test('should regenerate projections with new options', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useSalesProjections());
    
    // Wait for initial load
    await waitForNextUpdate();
    
    // Change options
    act(() => {
      result.current.regenerateProjections({
        timeframe: '12months',
        growthAdjustment: 10,
        useSeasonalAdjustments: false
      });
    });
    
    // Should be loading again
    expect(result.current.isLoading).toBe(true);
    
    // Wait for the new projections to load
    await waitForNextUpdate();
    
    // Should have called projectMonthlySales with the new timeframe (12 months)
    expect(salesProjector.projectMonthlySales).toHaveBeenCalledWith('merchant-1', 12);
  });
  
  test('handles errors properly', async () => {
    // Make the service throw an error
    const error = new Error('Failed to load projections');
    (salesProjector.projectMonthlySales as jest.Mock).mockRejectedValue(error);
    
    const { result, waitForNextUpdate } = renderHook(() => useSalesProjections());
    
    // Wait for the error to be processed
    await waitForNextUpdate();
    
    // Should not be loading and should have the error
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(error);
    
    // Should have shown a toast with the error
    expect(toast.error).toHaveBeenCalledWith("Failed to load sales projections");
  });
});
