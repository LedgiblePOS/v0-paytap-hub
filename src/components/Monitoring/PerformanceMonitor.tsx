
import { useEffect, useState } from 'react';
import { useMonitoring } from './MonitoringProvider';
import logger from '@/utils/logging';

interface PerformanceMetrics {
  pageLoads: number[];
  apiCalls: Record<string, number[]>;
  componentRenders: Record<string, number[]>;
  memoryUsage: number[];
  longTasks: number;
}

/**
 * Component that monitors application performance
 */
const PerformanceMonitor = () => {
  const { isMonitoringEnabled } = useMonitoring();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoads: [],
    apiCalls: {},
    componentRenders: {},
    memoryUsage: [],
    longTasks: 0
  });
  
  // Calculate percentile
  const getPercentile = (values: number[], percentile: number): number => {
    if (values.length === 0) return 0;
    if (values.length === 1) return values[0];
    
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  };
  
  useEffect(() => {
    if (!isMonitoringEnabled) return;
    
    // Setup performance observer
    if ('PerformanceObserver' in window) {
      // Long task observer
      try {
        const longTaskObserver = new PerformanceObserver((entries) => {
          setMetrics(prev => ({
            ...prev,
            longTasks: prev.longTasks + entries.getEntries().length
          }));
        });
        
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        
        // Navigation observer
        const navObserver = new PerformanceObserver((entries) => {
          const navigationEntries = entries.getEntries() as PerformanceNavigationTiming[];
          if (navigationEntries.length > 0) {
            const navigationTime = navigationEntries[0].domComplete - navigationEntries[0].startTime;
            
            setMetrics(prev => ({
              ...prev,
              pageLoads: [...prev.pageLoads, navigationTime]
            }));
            
            if (navigationTime > 3000) {
              logger.warn('Slow page load detected', { 
                time: navigationTime,
                page: window.location.pathname
              });
            }
          }
        });
        
        navObserver.observe({ entryTypes: ['navigation'] });
        
        // Resource observer
        const resourceObserver = new PerformanceObserver((entries) => {
          const resourceEntries = entries.getEntries() as PerformanceResourceTiming[];
          resourceEntries.forEach(entry => {
            if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
              const duration = entry.duration;
              const url = new URL(entry.name).pathname;
              
              setMetrics(prev => ({
                ...prev,
                apiCalls: {
                  ...prev.apiCalls,
                  [url]: [...(prev.apiCalls[url] || []), duration]
                }
              }));
              
              if (duration > 1000) {
                logger.warn('Slow API call detected', { 
                  url, 
                  duration,
                  time: new Date().toISOString()
                });
              }
            }
          });
        });
        
        resourceObserver.observe({ entryTypes: ['resource'] });
        
        // Cleanup
        return () => {
          longTaskObserver.disconnect();
          navObserver.disconnect();
          resourceObserver.disconnect();
        };
      } catch (error) {
        console.error('Error setting up performance observers:', error);
      }
    }
  }, [isMonitoringEnabled]);
  
  // Report metrics periodically
  useEffect(() => {
    if (!isMonitoringEnabled) return;
    
    const reportInterval = setInterval(() => {
      if (metrics.pageLoads.length === 0) return;
      
      // Memory usage reporting
      if (performance && (performance as any).memory) {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: [...prev.memoryUsage, memory.usedJSHeapSize]
        }));
      }
      
      // Calculate key performance metrics
      const p95PageLoad = getPercentile(metrics.pageLoads, 95);
      
      // Report metrics
      if (p95PageLoad > 3000) {
        logger.warn('Poor page load performance detected', {
          p95PageLoad,
          samplesCount: metrics.pageLoads.length,
          longTasks: metrics.longTasks
        });
      }
      
      // Report slow API endpoints
      Object.entries(metrics.apiCalls).forEach(([endpoint, durations]) => {
        const p95ApiCall = getPercentile(durations, 95);
        if (p95ApiCall > 1000) {
          logger.warn('Poor API performance detected', {
            endpoint,
            p95ApiCall,
            samplesCount: durations.length
          });
        }
      });
      
      // Memory leaks detection
      const memoryReadings = metrics.memoryUsage;
      if (memoryReadings.length >= 5) {
        const firstThree = memoryReadings.slice(0, 3);
        const lastThree = memoryReadings.slice(-3);
        
        const firstThreeAvg = firstThree.reduce((sum, value) => sum + value, 0) / firstThree.length;
        const lastThreeAvg = lastThree.reduce((sum, value) => sum + value, 0) / lastThree.length;
        
        const increase = lastThreeAvg / firstThreeAvg;
        
        if (increase > 1.5) {
          logger.warn('Potential memory leak detected', {
            increaseRatio: increase,
            initialMemory: firstThreeAvg,
            currentMemory: lastThreeAvg
          });
        }
      }
    }, 60000); // Report every minute
    
    return () => clearInterval(reportInterval);
  }, [isMonitoringEnabled, metrics]);
  
  // This is a monitoring component that doesn't render anything
  return null;
};

export default PerformanceMonitor;
