
/**
 * Service for monitoring performance metrics
 */
class PerformanceMonitoringService {
  private isMonitoring: boolean = false;
  private metrics: Record<string, number[]> = {};
  private marks: Record<string, number> = {};
  
  /**
   * Start collecting performance metrics
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.resetMetrics();
    
    console.log('Performance monitoring started');
  }
  
  /**
   * Stop collecting performance metrics
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    console.log('Performance monitoring stopped');
  }
  
  /**
   * Reset all collected metrics
   */
  resetMetrics(): void {
    this.metrics = {};
    this.marks = {};
  }
  
  /**
   * Mark the start of a performance measurement
   */
  mark(name: string): void {
    if (!this.isMonitoring) return;
    
    this.marks[name] = performance.now();
  }
  
  /**
   * Measure time since a specific mark
   */
  measure(name: string, markName: string): number {
    if (!this.isMonitoring || !this.marks[markName]) return 0;
    
    const duration = performance.now() - this.marks[markName];
    
    if (!this.metrics[name]) {
      this.metrics[name] = [];
    }
    
    this.metrics[name].push(duration);
    return duration;
  }
  
  /**
   * Get all collected metrics
   */
  getMetrics(): Record<string, { avg: number, min: number, max: number, count: number }> {
    const result: Record<string, { avg: number, min: number, max: number, count: number }> = {};
    
    Object.entries(this.metrics).forEach(([key, values]) => {
      if (values.length === 0) return;
      
      const sum = values.reduce((a, b) => a + b, 0);
      result[key] = {
        avg: sum / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
    });
    
    return result;
  }
  
  /**
   * Check if monitoring is currently active
   */
  isActive(): boolean {
    return this.isMonitoring;
  }
}

// Export a singleton instance
const performanceMonitoringService = new PerformanceMonitoringService();
export default performanceMonitoringService;
