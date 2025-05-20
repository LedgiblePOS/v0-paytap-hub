
class PerformanceMonitoringService {
  private isMonitoring: boolean = false;
  private metrics: Record<string, number[]> = {};
  private observer: PerformanceObserver | null = null;
  private apiTimers: Map<string, number> = new Map();

  constructor() {
    this.setupObserver();
  }

  private setupObserver() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const metricName = entry.name;
          if (!this.metrics[metricName]) {
            this.metrics[metricName] = [];
          }
          this.metrics[metricName].push(entry.duration);
          
          // Log long tasks (over 50ms)
          if (entry.entryType === 'longtask' && entry.duration > 50) {
            console.warn(`Long task detected: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
    }
  }

  startMonitoring() {
    if (this.isMonitoring || !this.observer) return;
    
    try {
      // Observe various performance metrics
      this.observer.observe({ entryTypes: ['longtask', 'resource', 'navigation', 'paint'] });
      this.isMonitoring = true;
      console.log('[Performance] Monitoring started');
    } catch (error) {
      console.error('[Performance] Failed to start monitoring:', error);
    }
  }

  stopMonitoring() {
    if (!this.isMonitoring || !this.observer) return;
    
    try {
      this.observer.disconnect();
      this.isMonitoring = false;
      console.log('[Performance] Monitoring stopped');
    } catch (error) {
      console.error('[Performance] Failed to stop monitoring:', error);
    }
  }
  
  // Add the missing API timing methods
  startApiTimer(endpoint: string) {
    this.apiTimers.set(endpoint, performance.now());
    return endpoint;
  }
  
  endApiTimer(endpoint: string) {
    const startTime = this.apiTimers.get(endpoint);
    if (startTime) {
      const duration = performance.now() - startTime;
      if (!this.metrics['api_calls']) {
        this.metrics['api_calls'] = [];
      }
      this.metrics['api_calls'].push(duration);
      if (duration > 1000) {
        console.warn(`[Performance] Slow API call to ${endpoint}: ${duration.toFixed(2)}ms`);
      }
      this.apiTimers.delete(endpoint);
      return duration;
    }
    return 0;
  }

  getMetrics() {
    return this.metrics;
  }

  clearMetrics() {
    this.metrics = {};
  }
}

const performanceMonitoringService = new PerformanceMonitoringService();
export default performanceMonitoringService;
