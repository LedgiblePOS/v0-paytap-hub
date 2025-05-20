
import { useEffect, useRef, useState } from 'react';
import performanceBenchmark from '@/utils/performance/PerformanceBenchmark';

interface PerformanceStats {
  renderCount: number;
  lastRenderTime: number | null;
  averageRenderTime: number | null;
  totalRenderTime: number;
}

/**
 * Hook to monitor component render performance
 * @param componentName A unique name to identify this component
 * @returns Performance statistics for the component
 */
export function usePerformanceMonitor(componentName: string): PerformanceStats {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const startTimeRef = useRef<number | null>(null);
  
  const [stats, setStats] = useState<PerformanceStats>({
    renderCount: 0,
    lastRenderTime: null,
    averageRenderTime: null,
    totalRenderTime: 0
  });

  // Start measuring when component renders
  useEffect(() => {
    const name = `component-${componentName}`;
    startTimeRef.current = performance.now();
    
    // Capture render completion time on next tick
    const timeoutId = setTimeout(() => {
      if (startTimeRef.current === null) return;
      
      const endTime = performance.now();
      const renderTime = endTime - startTimeRef.current;
      
      renderCount.current += 1;
      renderTimes.current.push(renderTime);
      
      const totalTime = renderTimes.current.reduce((acc, time) => acc + time, 0);
      const avgTime = totalTime / renderTimes.current.length;
      
      setStats({
        renderCount: renderCount.current,
        lastRenderTime: renderTime,
        averageRenderTime: avgTime,
        totalRenderTime: totalTime
      });
      
      // Record in the benchmark system
      performanceBenchmark.start(name);
      performanceBenchmark.end(name);
    }, 0);
    
    return () => clearTimeout(timeoutId);
  });

  return stats;
}

export default usePerformanceMonitor;
