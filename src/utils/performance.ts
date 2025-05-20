
/**
 * Performance utilities for measuring and improving application performance
 */
import performanceMonitoringService from '@/services/monitoring/performanceMonitoringService';

// Custom performance metrics collector
export const measurePerformance = (name: string, fn: () => any): any => {
  performanceMonitoringService.mark(name);
  const result = fn();
  performanceMonitoringService.measure(name, name);
  return result;
};

// Image optimization helper
export const getOptimizedImageUrl = (url: string, width?: number): string => {
  if (!url) return '';
  
  // Don't process data URLs
  if (url.startsWith('data:')) return url;
  
  // Don't process already optimized URLs
  if (url.includes('?optimize=true')) return url;
  
  // Add width parameter if specified
  const sizeParam = width ? `&width=${width}` : '';
  
  // Add optimization parameters
  return `${url}?optimize=true${sizeParam}&quality=80`;
};

// Helper to detect slow renders
export const detectSlowRender = (componentName: string, threshold = 16): void => {
  const start = performance.now();
  
  return () => {
    const duration = performance.now() - start;
    if (duration > threshold) {
      console.warn(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`);
    }
  };
};
