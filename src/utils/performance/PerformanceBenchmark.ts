
/**
 * Performance Benchmarking Utility
 * Used to measure and track performance metrics across the application
 */

type BenchmarkResult = {
  name: string;
  duration: number;
  timestamp: number;
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
};

class PerformanceBenchmark {
  private static instance: PerformanceBenchmark;
  private results: BenchmarkResult[] = [];
  private markers: Map<string, number> = new Map();
  private enabled: boolean = true;
  
  private constructor() {}
  
  static getInstance(): PerformanceBenchmark {
    if (!PerformanceBenchmark.instance) {
      PerformanceBenchmark.instance = new PerformanceBenchmark();
    }
    return PerformanceBenchmark.instance;
  }
  
  /**
   * Start measuring performance for a named operation
   */
  start(name: string): void {
    if (!this.enabled) return;
    
    this.markers.set(name, performance.now());
    
    // Mark for Performance Timeline API
    if (performance && performance.mark) {
      performance.mark(`${name}-start`);
    }
  }
  
  /**
   * End measuring performance for a named operation and record results
   */
  end(name: string): number | null {
    if (!this.enabled || !this.markers.has(name)) return null;
    
    const startTime = this.markers.get(name)!;
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Create performance measure for DevTools
    if (performance && performance.measure) {
      try {
        performance.measure(name, `${name}-start`);
      } catch (e) {
        console.warn('Could not create performance measure', e);
      }
    }
    
    // Get memory info if available
    let memory;
    if (performance && (performance as any).memory) {
      memory = {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      };
    }
    
    // Record the result
    const result: BenchmarkResult = {
      name,
      duration,
      timestamp: Date.now(),
      memory,
    };
    
    this.results.push(result);
    this.markers.delete(name);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Benchmark - ${name}: ${duration.toFixed(2)}ms`);
      if (memory) {
        console.log(`Memory - Used: ${(memory.usedJSHeapSize / 1048576).toFixed(2)}MB`);
      }
    }
    
    return duration;
  }
  
  /**
   * Measure a function execution time
   */
  measure<T>(name: string, fn: () => T): T {
    this.start(name);
    const result = fn();
    this.end(name);
    return result;
  }
  
  /**
   * Measure an async function execution time
   */
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }
  
  /**
   * Get all recorded benchmark results
   */
  getResults(): BenchmarkResult[] {
    return [...this.results];
  }
  
  /**
   * Get statistics for a specific benchmark
   */
  getStatistics(name: string) {
    const filteredResults = this.results.filter(result => result.name === name);
    
    if (filteredResults.length === 0) {
      return null;
    }
    
    const durations = filteredResults.map(result => result.duration);
    const total = durations.reduce((sum, duration) => sum + duration, 0);
    const avg = total / durations.length;
    const min = Math.min(...durations);
    const max = Math.max(...durations);
    
    return {
      name,
      count: filteredResults.length,
      avg,
      min,
      max,
      total
    };
  }
  
  /**
   * Clear all recorded results
   */
  clearResults(): void {
    this.results = [];
  }
  
  /**
   * Enable or disable benchmarking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Export a singleton instance
const performanceBenchmark = PerformanceBenchmark.getInstance();
export default performanceBenchmark;
