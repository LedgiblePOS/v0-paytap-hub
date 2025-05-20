import { LogLevel, DeploymentEnvironment } from '@/types/enums';
import { getCurrentEnvironment, isProduction } from '@/config/environment';

/**
 * Environment-aware logging utility
 * Provides consistent logging interface with environment-specific behavior
 */
class Logger {
  private logLevel: LogLevel;
  private environment: DeploymentEnvironment;

  constructor() {
    try {
      this.environment = getCurrentEnvironment();
      this.logLevel = this.getLogLevelFromEnv();
    } catch (error) {
      console.error('Error initializing logger:', error);
      this.environment = DeploymentEnvironment.DEVELOPMENT;
      this.logLevel = LogLevel.INFO;
    }
  }

  /**
   * Get log level from environment variables
   */
  private getLogLevelFromEnv(): LogLevel {
    const envLevel = import.meta.env.VITE_LOG_LEVEL || 'info';
    
    switch (envLevel.toLowerCase()) {
      case 'debug':
        return LogLevel.DEBUG;
      case 'info':
        return LogLevel.INFO;
      case 'warn':
      case 'warning':
        return LogLevel.WARNING;
      case 'error':
        return LogLevel.ERROR;
      case 'critical':
        return LogLevel.CRITICAL;
      default:
        return isProduction() ? LogLevel.ERROR : LogLevel.INFO;
    }
  }

  /**
   * Check if the given log level should be displayed
   */
  private shouldLog(level: LogLevel): boolean {
    const logLevels = [
      LogLevel.DEBUG,
      LogLevel.INFO,
      LogLevel.WARNING,
      LogLevel.ERROR,
      LogLevel.CRITICAL
    ];
    
    const currentLevelIndex = logLevels.indexOf(this.logLevel);
    const messageLevelIndex = logLevels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  /**
   * Format log message with timestamp and additional data
   */
  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    
    if (isProduction()) {
      // In production, return structured format for parsing
      return JSON.stringify({
        timestamp,
        level,
        message,
        data,
        environment: this.environment
      });
    } else {
      // In development, return more readable format
      return `[${timestamp}] [${level}] ${message}`;
    }
  }

  /**
   * Debug level log
   */
  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, data);
      console.debug(formattedMessage, data);
    }
  }

  /**
   * Info level log
   */
  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const formattedMessage = this.formatMessage(LogLevel.INFO, message, data);
      console.info(formattedMessage, data);
    }
  }

  /**
   * Warning level log
   */
  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARNING)) {
      const formattedMessage = this.formatMessage(LogLevel.WARNING, message, data);
      console.warn(formattedMessage, data);
    }
  }

  /**
   * Error level log
   */
  error(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const formattedMessage = this.formatMessage(LogLevel.ERROR, message, data);
      console.error(formattedMessage, data);
      
      // In production, attempt to send critical errors to monitoring
      this.captureErrorForMonitoring(message, data);
    }
  }

  /**
   * Critical level log
   */
  critical(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.CRITICAL)) {
      const formattedMessage = this.formatMessage(LogLevel.CRITICAL, message, data);
      console.error(formattedMessage, data);
      
      // In production, we send critical logs to a monitoring service
      this.captureErrorForMonitoring(message, data, true);
    }
  }

  /**
   * Send errors to monitoring service in production
   */
  private captureErrorForMonitoring(message: string, data?: any, isCritical = false): void {
    // Only send to monitoring in production
    if (!isProduction()) return;
    
    try {
      // This would be implemented with an actual monitoring service
      const payload = {
        level: isCritical ? LogLevel.CRITICAL : LogLevel.ERROR,
        message,
        data,
        timestamp: new Date().toISOString(),
        environment: this.environment
      };
      
      // Use a non-blocking approach to send error data
      setTimeout(() => {
        try {
          // Example implementation using fetch
          fetch('/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(e => console.error('Failed to send log to monitoring service', e));
        } catch (e) {
          // Fail silently - logging should never crash the app
        }
      }, 0);
    } catch (error) {
      // Fail silently - we don't want logging failures to crash the app
    }
  }
  
  /**
   * Set the log level dynamically
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }
  
  /**
   * Get the current log level
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }
  
  /**
   * Get the current environment
   */
  getEnvironment(): DeploymentEnvironment {
    return this.environment;
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;
