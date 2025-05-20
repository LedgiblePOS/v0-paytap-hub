
import React, { useState, useEffect } from 'react';
import performanceBenchmark from '@/utils/performance/PerformanceBenchmark';

interface LazyRenderProps {
  children: React.ReactNode;
  id: string;
  priority?: 'high' | 'medium' | 'low';
  placeholder?: React.ReactNode;
  threshold?: number;
  clientOnly?: boolean;
  triggerOnIntersection?: boolean;
}

/**
 * LazyRender component for optimizing critical rendering path
 * - Delays rendering of non-critical components
 * - Can render on intersection (when scrolled into view)
 * - Benchmarks rendering performance
 */
export const LazyRender: React.FC<LazyRenderProps> = ({
  children,
  id,
  priority = 'medium',
  placeholder,
  threshold = 0.1,
  clientOnly = false,
  triggerOnIntersection = false,
}) => {
  const [shouldRender, setShouldRender] = useState(!triggerOnIntersection && !clientOnly);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  // Component priority determines render timing
  useEffect(() => {
    if (clientOnly || triggerOnIntersection) return;
    
    let timeout: number;
    
    const renderTimeouts = {
      high: 0,       // Immediate rendering for important components
      medium: 100,   // Slightly delayed rendering
      low: 500,      // Delayed rendering for non-critical components
    };
    
    timeout = window.setTimeout(() => {
      performanceBenchmark.start(`render-${id}`);
      setShouldRender(true);
    }, renderTimeouts[priority]);
    
    return () => clearTimeout(timeout);
  }, [id, priority, clientOnly, triggerOnIntersection]);

  // Setup intersection observer for rendering when visible
  useEffect(() => {
    if (!triggerOnIntersection || !containerRef) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            performanceBenchmark.start(`render-${id}`);
            setShouldRender(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );
    
    observer.observe(containerRef);
    
    return () => observer.disconnect();
  }, [containerRef, id, threshold, triggerOnIntersection]);

  // Measure render completion time
  useEffect(() => {
    if (shouldRender) {
      // Use requestIdleCallback to measure after render completes
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          performanceBenchmark.end(`render-${id}`);
        });
      } else {
        setTimeout(() => {
          performanceBenchmark.end(`render-${id}`);
        }, 0);
      }
    }
  }, [shouldRender, id]);

  // If using SSR (not client-only) and triggering on intersection, 
  // render placeholder until client-side hydration
  const showPlaceholder = (triggerOnIntersection || clientOnly) && !shouldRender;
  
  return (
    <div ref={setContainerRef} data-component-id={id}>
      {showPlaceholder ? (placeholder || <div className="min-h-[20px]" />) : children}
    </div>
  );
};

export default LazyRender;
