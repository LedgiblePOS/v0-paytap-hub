
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import salesProjector, { SalesProjection } from '@/services/projections/salesProjector';
import { toast } from 'sonner';

export type ProjectionTimeframe = '3months' | '6months' | '12months';

export interface ProjectionOptions {
  timeframe: ProjectionTimeframe;
  growthAdjustment: number; // -50 to +50 percentage points
  useSeasonalAdjustments: boolean;
}

export interface UseSalesProjectionsReturn {
  projections: SalesProjection[];
  isLoading: boolean;
  error: Error | null;
  regenerateProjections: (options: ProjectionOptions) => Promise<void>;
  totalProjectedRevenue: number;
  averageMonthlyRevenue: number;
  confidenceLevel: 'low' | 'medium' | 'high';
}

/**
 * Hook for managing sales projections
 */
export const useSalesProjections = (
  initialOptions: ProjectionOptions = {
    timeframe: '6months',
    growthAdjustment: 0,
    useSeasonalAdjustments: true
  }
): UseSalesProjectionsReturn => {
  const { user } = useAuth();
  const [projections, setProjections] = useState<SalesProjection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [options, setOptions] = useState<ProjectionOptions>(initialOptions);
  
  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true);
  
  // Use refs to prevent additional renders
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Derived values using memoization pattern with useCallback
  const calculateTotalProjectedRevenue = useCallback(() => {
    return projections.reduce((sum, proj) => sum + proj.projectedSales, 0);
  }, [projections]);
  
  const calculateAverageMonthlyRevenue = useCallback(() => {
    return projections.length > 0 ? calculateTotalProjectedRevenue() / projections.length : 0;
  }, [projections, calculateTotalProjectedRevenue]);
  
  const determineConfidenceLevel = useCallback((): 'low' | 'medium' | 'high' => {
    return projections.length > 0 ? projections[0].confidenceLevel : 'low';
  }, [projections]);

  // Load projections based on current options
  const loadProjections = useCallback(async () => {
    if (!user || !isMountedRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use user.id as the merchantId if no merchant_id is available
      const merchantId = user?.id || "demo-merchant"; // Use user ID or fallback
      const months = options.timeframe === "3months" ? 3 : options.timeframe === "6months" ? 6 : 12;
      
      // Apply growth adjustment and seasonal adjustments to the projections
      const projectionData = await salesProjector.projectMonthlySales(merchantId, months);
      
      // Only update state if still mounted
      if (!isMountedRef.current) return;
      
      // Apply growth adjustment if it's not zero
      if (options.growthAdjustment !== 0) {
        const adjustmentFactor = options.growthAdjustment / 100;
        const adjustedProjections = projectionData.map(proj => ({
          ...proj,
          projectedSales: proj.projectedSales * (1 + adjustmentFactor),
          growthRate: proj.growthRate + adjustmentFactor
        }));
        setProjections(adjustedProjections);
      } else {
        setProjections(projectionData);
      }
    } catch (err) {
      console.error("Error loading sales projections:", err);
      if (isMountedRef.current) {
        setError(err instanceof Error ? err : new Error('Failed to load projections'));
        toast.error("Failed to load sales projections");
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [user, options.timeframe, options.growthAdjustment, options.useSeasonalAdjustments]);

  // Regenerate projections with new options
  const regenerateProjections = useCallback(async (newOptions: ProjectionOptions) => {
    setOptions(newOptions);
    // We'll reload projections when options change via useEffect
  }, []);

  // Load projections on mount and when options change
  useEffect(() => {
    // Reset mount flag
    isMountedRef.current = true;
    
    loadProjections();
    
    // Clean up
    return () => {
      isMountedRef.current = false;
    };
  }, [user, options.timeframe, options.growthAdjustment, options.useSeasonalAdjustments, loadProjections]);

  // Calculate derived values once when data changes
  const totalProjectedRevenue = calculateTotalProjectedRevenue();
  const averageMonthlyRevenue = calculateAverageMonthlyRevenue();
  const confidenceLevel = determineConfidenceLevel();

  return {
    projections,
    isLoading,
    error,
    regenerateProjections,
    totalProjectedRevenue,
    averageMonthlyRevenue,
    confidenceLevel
  };
};

export default useSalesProjections;
