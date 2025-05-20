
import React, { useEffect, useState } from "react";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number;
  breakpoints?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

interface WindowSize {
  width: number;
  height: number;
}

const defaultBreakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const useWindowSize = (): WindowSize => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = "",
  style = {},
  maxWidth,
  minHeight,
  maxHeight,
  aspectRatio,
  breakpoints = defaultBreakpoints,
}) => {
  const { width } = useWindowSize();
  const finalBreakpoints = { ...defaultBreakpoints, ...breakpoints };

  // Safely determine the current breakpoint
  const getBreakpoint = () => {
    if (width >= finalBreakpoints.xl) return "xl";
    if (width >= finalBreakpoints.lg) return "lg";
    if (width >= finalBreakpoints.md) return "md";
    if (width >= finalBreakpoints.sm) return "sm";
    return "xs";
  };

  const currentBreakpoint = getBreakpoint();
  
  // Calculate dimensions based on props and current breakpoint
  const containerStyle: React.CSSProperties = {
    maxWidth: maxWidth ? `${maxWidth}px` : "100%",
    minHeight: minHeight ? `${minHeight}px` : undefined,
    maxHeight: maxHeight ? `${maxHeight}px` : undefined,
    aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
    margin: "0 auto",
    ...style,
  };

  return (
    <div 
      className={`responsive-container ${className}`} 
      style={containerStyle}
      data-breakpoint={currentBreakpoint}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
