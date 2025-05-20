
import { useCallback, useEffect, useState } from 'react';
import { useResponsive } from './useResponsive';

type ResponsiveValueMap<T> = {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

/**
 * Hook to get a value based on the current responsive breakpoint
 * @param values Responsive values mapped to breakpoints
 * @returns The value for the current breakpoint
 */
export function useResponsiveValue<T>(values: ResponsiveValueMap<T>): T | undefined {
  const { currentBreakpoint } = useResponsive();
  const [value, setValue] = useState<T | undefined>(values.base);
  
  const getValueForBreakpoint = useCallback(() => {
    // Breakpoint priority, from smallest to largest
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    const currentIndex = breakpoints.indexOf(currentBreakpoint);
    
    // Find the closest defined value for the current breakpoint or smaller
    for (let i = currentIndex; i >= 0; i--) {
      const breakpoint = breakpoints[i];
      if (values[breakpoint] !== undefined) {
        return values[breakpoint];
      }
    }
    
    // If no matching breakpoint is found, return the base value
    return values.base;
  }, [currentBreakpoint, values]);
  
  useEffect(() => {
    setValue(getValueForBreakpoint());
  }, [currentBreakpoint, getValueForBreakpoint]);
  
  return value;
}

export default useResponsiveValue;
