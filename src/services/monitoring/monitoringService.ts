
import logger from '@/utils/logging';
import { LogLevel, DeploymentEnvironment } from '@/types/enums';
import { getCurrentEnvironment, isProduction } from '@/config/environment';

interface MonitoringOptions {
  enabled: boolean;
  sampleRate: number;
  alertThreshold: number;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

/**
 * Production-ready monitoring service that integrates with logging
 * and provides error tracking, performance monitoring, and reporting
 */
class MonitoringService {
  private isInitialized = false;
  private options: MonitoringOptions;
  private metricsBuffer: PerformanceMetric[] = [];
  private flushInterval: number | null = null;
  private environment: DeploymentEnvironment;
  
  constructor() {
    this.environment = getCurrentEnvironment();
    this.options = {
      enabled: isProduction(),
      sampleRate: isProduction() ? 0.1 : 1.0, // 10% of events in production, all in development
      alertThreshold: 1000 // milliseconds
    };
  }
  
  /**
   * Initialize the monitoring service with options
   */
  initialize(options?: Partial<MonitoringOptions>): void {
    if (this.isInitialized) {
      logger.warn('Monitoring service already initialized');
      return;
    }
    
    this.options = { ...this.options, ...options };
    this.isInitialized = true;
    
    // Set up auto-flush of metrics in production
    if (this.options.enabled) {
      this.flushInterval = window.setInterval(() => this.flushMetrics(), 30000);
      
      // Set up global error handler
      window.addEventListener('error', this.handleError);
      window.addEventListener('unhandledrejection', this.handlePromiseRejection);
      
      logger.info('Monitoring service initialized', { 
        environment: this.environment,
        sampleRate: this.options.sampleRate
      });
    }
  }
  
  /**
   * Clean up the monitoring service
   */
  destroy(): void {
    if (this.flushInterval) {
      window.clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    
    window.removeEventListener('error', this.handleError);
    window.removeEventListener('unhandledrejection', this.handlePromiseRejection);
    
    this.isInitialized = false;
    logger.info('Monitoring service destroyed');
  }
  
  /**
   * Handle JavaScript errors
   */
  private handleError = (event: ErrorEvent): void => {
    this.captureError({
      name: 'Uncaught Error',
      message: event.message,
      stack: event.error?.stack,
      context: {
        url: window.location.href,
        source: event.filename,
        line: event.lineno,
        column: event.colno
      }
    });
  };
  
  /**
   * Handle unhandled promise rejections
   */
  private handlePromiseRejection = (event: PromiseRejectionEvent): void => {
    const error = event.reason;
    this.captureError({
      name: 'Unhandled Promise Rejection',
      message: error.message || 'Unknown promise rejection',
      stack: error.stack,
      context: {
        url: window.location.href
      }
    });
  };
  
  /**
   * Capture and report an error to the monitoring system
   */
  captureError(error: {
    name: string;
    message: string;
    stack?: string;
    context?: Record<string, any>;
  }): void {
    if (!this.shouldSample() || !this.options.enabled) {
      return;
    }
    
    logger.error(error.message, {
      name: error.name,
      stack: error.stack,
      ...error.context
    });
    
    // In a real implementation, send to monitoring service
    if (isProduction()) {
      this.sendToMonitoringService({
        type: 'error',
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: error.context,
        timestamp: Date.now(),
        environment: this.environment
      });
    }
  }
  
  /**
   * Track a performance metric
   */
  trackPerformance(name: string, value: number, tags?: Record<string, string>): void {
    if (!this.shouldSample() || !this.options.enabled) {
      return;
    }
    
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      tags
    };
    
    this.metricsBuffer.push(metric);
    
    // Alert on slow operations
    if (name.includes('responseTime') && value > this.options.alertThreshold) {
      logger.warn(`Slow operation detected: ${name}`, { value: `${value}ms`, tags });
    }
    
    // Flush immediately if we have too many metrics
    if (this.metricsBuffer.length >= 100) {
      this.flushMetrics();
    }
  }
  
  /**
   * Record a user action for analytics
   */
  trackUserAction(action: string, properties?: Record<string, any>): void {
    if (!this.shouldSample() || !this.options.enabled) {
      return;
    }
    
    logger.info(`User action: ${action}`, properties);
    
    if (isProduction()) {
      this.sendToMonitoringService({
        type: 'userAction',
        action,
        properties,
        timestamp: Date.now(),
        environment: this.environment
      });
    }
  }
  
  /**
   * Send collected metrics to the monitoring service
   */
  private flushMetrics(): void {
    if (this.metricsBuffer.length === 0 || !this.options.enabled) {
      return;
    }
    
    const metrics = [...this.metricsBuffer];
    this.metricsBuffer = [];
    
    if (isProduction()) {
      this.sendToMonitoringService({
        type: 'metrics',
        metrics,
        timestamp: Date.now(),
        environment: this.environment
      });
    }
    
    logger.debug(`Flushed ${metrics.length} metrics`);
  }
  
  /**
   * Determine if this event should be sampled based on the sample rate
   */
  private shouldSample(): boolean {
    return Math.random() < this.options.sampleRate;
  }
  
  /**
   * Send data to the monitoring service
   * This is a placeholder for the actual implementation
   */
  private sendToMonitoringService(data: any): void {
    // In a real implementation, this would send to a monitoring service API
    // For now, just log that we would send the data
    console.debug('Would send to monitoring service:', data);
    
    // Example implementation using a beacon API:
    // navigator.sendBeacon('/api/monitoring', JSON.stringify(data));
  }
}

// Export a singleton instance
export const monitoring = new MonitoringService();
export default monitoring;
