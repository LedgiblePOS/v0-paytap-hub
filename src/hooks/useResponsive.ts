
import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export interface UseResponsiveOptions {
  breakpoints?: Partial<BreakpointConfig>;
}

export interface ResponsiveOutput {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: Breakpoint;
  screenWidth: number | null;
  screenHeight: number | null;
  orientation: 'portrait' | 'landscape' | null;
  isBreakpoint: (breakpoint: Breakpoint) => boolean;
  isLargerThan: (breakpoint: Breakpoint) => boolean;
  isSmallerThan: (breakpoint: Breakpoint) => boolean;
}

/**
 * Hook for responsive design utilities
 */
export function useResponsive(options?: UseResponsiveOptions): ResponsiveOutput {
  const mergedBreakpoints = { ...defaultBreakpoints, ...options?.breakpoints };
  
  const [state, setState] = useState<{
    width: number | null;
    height: number | null;
    breakpoint: Breakpoint;
    orientation: 'portrait' | 'landscape' | null;
  }>({
    width: typeof window !== 'undefined' ? window.innerWidth : null,
    height: typeof window !== 'undefined' ? window.innerHeight : null,
    breakpoint: 'lg', // Default
    orientation: null
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const calculateValues = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const orientation = width > height ? 'landscape' : 'portrait';
      
      // Determine current breakpoint
      let breakpoint: Breakpoint = '2xl';
      if (width < mergedBreakpoints.sm) breakpoint = 'xs';
      else if (width < mergedBreakpoints.md) breakpoint = 'sm';
      else if (width < mergedBreakpoints.lg) breakpoint = 'md';
      else if (width < mergedBreakpoints.xl) breakpoint = 'lg';
      else if (width < mergedBreakpoints['2xl']) breakpoint = 'xl';
      
      setState({ width, height, breakpoint, orientation });
    };
    
    // Calculate initial values
    calculateValues();
    
    // Add resize listener
    window.addEventListener('resize', calculateValues);
    
    // Cleanup
    return () => window.removeEventListener('resize', calculateValues);
  }, [mergedBreakpoints]);
  
  const isBreakpoint = (breakpoint: Breakpoint): boolean => {
    return state.breakpoint === breakpoint;
  };
  
  const isLargerThan = (breakpoint: Breakpoint): boolean => {
    if (!state.width) return false;
    return state.width >= mergedBreakpoints[breakpoint];
  };
  
  const isSmallerThan = (breakpoint: Breakpoint): boolean => {
    if (!state.width) return false;
    return state.width < mergedBreakpoints[breakpoint];
  };
  
  return {
    isMobile: isSmallerThan('md'),
    isTablet: !isSmallerThan('md') && isSmallerThan('lg'),
    isDesktop: isLargerThan('lg'),
    currentBreakpoint: state.breakpoint,
    screenWidth: state.width,
    screenHeight: state.height,
    orientation: state.orientation,
    isBreakpoint,
    isLargerThan,
    isSmallerThan
  };
}
