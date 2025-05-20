
/**
 * Comprehensive error monitoring service for production applications
 */

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Error source categories
export enum ErrorSource {
  FRONTEND = 'frontend',
  API = 'api',
  AUTHENTICATION = 'authentication',
  DATABASE = 'database',
  EXTERNAL_SERVICE = 'external_service',
  UNKNOWN = 'unknown'
}

// Structured error object
export interface ErrorData {
  message: string;
  source?: ErrorSource;
  severity: ErrorSeverity;
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  url?: string;
  component?: string;
}

// Error callback type
export type ErrorCallback = (error: ErrorData) => void;

// Configuration for the error monitoring service
interface ErrorMonitoringConfig {
  maxBufferSize?: number;
  autoSendInterval?: number;
}

/**
 * Error monitoring service that collects, processes, and reports errors
 */
class ErrorMonitoringService {
  private errorBuffer: ErrorData[] = [];
  private subscribers: ErrorCallback[] = [];
  private isInitialized: boolean = false;
  private maxBufferSize: number = 10;
  private autoSendInterval: number | null = null;
  private autoSendIntervalId: number | null = null;
  
  /**
   * Initialize the error monitoring service
   */
  initialize(config?: ErrorMonitoringConfig): void {
    if (this.isInitialized) {
      console.warn('Error monitoring service is already initialized');
      return;
    }
    
    this.maxBufferSize = config?.maxBufferSize || 10;
    this.autoSendInterval = config?.autoSendInterval || 30000; // 30 seconds by default
    
    // Setup global error handler
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    // Setup interval for auto-sending errors
    if (this.autoSendInterval) {
      this.autoSendIntervalId = window.setInterval(() => {
        this.sendErrors();
      }, this.autoSendInterval);
    }
    
    this.isInitialized = true;
    console.log('Error monitoring service initialized');
  }
  
  /**
   * Clean up the error monitoring service
   */
  destroy(): void {
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    
    if (this.autoSendIntervalId) {
      window.clearInterval(this.autoSendIntervalId);
      this.autoSendIntervalId = null;
    }
    
    this.isInitialized = false;
    console.log('Error monitoring service destroyed');
  }
  
  /**
   * Handle global JavaScript errors
   */
  private handleGlobalError = (event: ErrorEvent): void => {
    this.trackError({
      message: event.message,
      severity: ErrorSeverity.ERROR,
      source: ErrorSource.FRONTEND,
      stackTrace: event.error?.stack,
      url: window.location.href,
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    });
  };
  
  /**
   * Handle unhandled promise rejections
   */
  private handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const error = event.reason;
    this.trackError({
      message: error.message || 'Unhandled Promise Rejection',
      severity: ErrorSeverity.ERROR,
      source: ErrorSource.FRONTEND,
      stackTrace: error.stack,
      url: window.location.href
    });
  };
  
  /**
   * Track a new error
   */
  trackError(error: ErrorData): void {
    // Add timestamp if not provided
    if (!error.timestamp) {
      error.timestamp = new Date();
    }
    
    // Add to buffer
    this.errorBuffer.push(error);
    
    // Notify subscribers
    this.notifySubscribers(error);
    
    // Check if we need to send errors right away
    if (this.errorBuffer.length >= this.maxBufferSize) {
      this.sendErrors();
    }
    
    // Log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorMonitoring]', error.message, error);
    }
  }
  
  /**
   * Send errors to the monitoring service
   */
  private sendErrors(): void {
    if (this.errorBuffer.length === 0) {
      return;
    }
    
    // In a real application, this would send errors to a backend service
    // For now, we'll just log them
    const errorsToSend = [...this.errorBuffer];
    this.errorBuffer = [];
    
    // In production, you would send the errors to your server
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to backend
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ errors: errorsToSend })
      // }).catch(e => console.error('Failed to send errors:', e));
      
      console.log(`[ErrorMonitoring] Sent ${errorsToSend.length} errors to monitoring service`);
    }
  }
  
  /**
   * Notify all subscribers about a new error
   */
  private notifySubscribers(error: ErrorData): void {
    this.subscribers.forEach(callback => {
      try {
        callback(error);
      } catch (e) {
        console.error('Error in error subscriber:', e);
      }
    });
  }
  
  /**
   * Subscribe to new errors
   */
  subscribe(callback: ErrorCallback): () => void {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }
}

// Create and export a singleton instance
const errorMonitoringService = new ErrorMonitoringService();
export default errorMonitoringService;
