
/**
 * Security Monitoring Service
 * 
 * Monitors application security metrics and alerts
 */

export interface SecurityAlert {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  metadata?: Record<string, any>;
}

type SecurityAlertCallback = (alert: SecurityAlert) => void;

class SecurityMonitoringService {
  private isMonitoring = false;
  private alertSubscribers: SecurityAlertCallback[] = [];
  
  /**
   * Start security monitoring
   */
  public startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }
    
    this.isMonitoring = true;
    
    // Set up event listeners for security-related events
    window.addEventListener('securityviolation', this.handleSecurityViolation);
    
    console.log('[Security Monitoring] Started');
  }
  
  /**
   * Stop security monitoring
   */
  public stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }
    
    this.isMonitoring = false;
    
    // Remove event listeners
    window.removeEventListener('securityviolation', this.handleSecurityViolation);
    
    console.log('[Security Monitoring] Stopped');
  }
  
  /**
   * Handle security violation events
   */
  private handleSecurityViolation = (event: Event): void => {
    const securityEvent = event as CustomEvent;
    
    const alert: SecurityAlert = {
      type: 'security-violation',
      description: securityEvent.detail?.message || 'Unknown security violation',
      severity: securityEvent.detail?.severity || 'medium',
      timestamp: new Date(),
      metadata: securityEvent.detail
    };
    
    this.notifySubscribers(alert);
  };
  
  /**
   * Subscribe to security alerts
   */
  public subscribeToAlerts(callback: SecurityAlertCallback): () => void {
    this.alertSubscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.alertSubscribers = this.alertSubscribers.filter(sub => sub !== callback);
    };
  }
  
  /**
   * Notify all subscribers of a security alert
   */
  private notifySubscribers(alert: SecurityAlert): void {
    this.alertSubscribers.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('[Security Monitoring] Error in alert subscriber:', error);
      }
    });
  }
  
  /**
   * Trigger a security alert manually
   */
  public triggerAlert(alert: Omit<SecurityAlert, 'timestamp'>): void {
    const fullAlert: SecurityAlert = {
      ...alert,
      timestamp: new Date()
    };
    
    this.notifySubscribers(fullAlert);
  }
}

const securityMonitoringService = new SecurityMonitoringService();
export default securityMonitoringService;
