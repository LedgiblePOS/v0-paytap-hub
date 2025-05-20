
interface ErrorContext {
  module?: string;
  function?: string;
  userId?: string;
  [key: string]: any;
}

/**
 * Service for tracking and reporting errors
 */
class ErrorTrackingService {
  private errors: Array<{error: Error, context: ErrorContext, timestamp: Date}> = [];
  private isEnabled = process.env.NODE_ENV !== 'test';

  /**
   * Track an error with optional context
   * @param error The error object
   * @param context Additional context about where/when the error occurred
   */
  trackError(error: Error, context: ErrorContext = {}): void {
    if (!this.isEnabled) return;
    
    // Always log to console
    console.error('Error tracked:', error.message, {
      stack: error.stack,
      ...context,
    });
    
    // Store the error
    this.errors.push({
      error,
      context,
      timestamp: new Date()
    });
    
    // If we have too many errors, remove the oldest ones
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }
  }

  /**
   * Get all tracked errors
   */
  getErrors() {
    return [...this.errors];
  }

  /**
   * Clear all tracked errors
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Enable or disable error tracking
   */
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }
}

// Export a singleton instance
const errorTrackingService = new ErrorTrackingService();
export default errorTrackingService;
