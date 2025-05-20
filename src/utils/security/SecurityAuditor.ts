
import { supabase } from '@/integrations/supabase/client';
import { AuditSeverity } from '@/services/enhancedAuditService';
import { hasPermission } from '@/utils/permissions/permissionCheck';
import { User } from '@/types/user';
import { isValidEmail, sanitizeInput } from '@/utils/security/inputValidation';

export interface SecurityAuditResult {
  passed: boolean;
  findings: SecurityFinding[];
  score: number; // 0-100
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
}

export interface SecurityFinding {
  id: string;
  title: string;
  description: string;
  severity: AuditSeverity;
  category: 'authentication' | 'authorization' | 'input_validation' | 'data_exposure' | 'configuration' | 'other';
  recommendation: string;
  affectedComponent?: string;
  references?: string[];
}

/**
 * Comprehensive security audit utility for checking application security
 */
class SecurityAuditor {
  /**
   * Audit authentication flows
   */
  public async auditAuthentication(): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    
    // Check if sign in with email is correctly configured
    try {
      const { data: settings } = await supabase.from('security_settings').select('*').limit(1).single();
      
      if (!settings) {
        findings.push({
          id: 'auth-001',
          title: 'Missing security settings configuration',
          description: 'Security settings table does not contain configuration for authentication.',
          severity: AuditSeverity.WARNING,
          category: 'authentication',
          recommendation: 'Configure security settings in the database.'
        });
      } else {
        // Check password policy
        if (!settings.password_require_special_chars) {
          findings.push({
            id: 'auth-002',
            title: 'Weak password policy',
            description: 'Password policy does not require special characters.',
            severity: AuditSeverity.WARNING,
            category: 'authentication',
            recommendation: 'Enable special character requirement in password policy.'
          });
        }
        
        if (settings.password_min_length < 8) {
          findings.push({
            id: 'auth-003',
            title: 'Insufficient password length',
            description: 'Password minimum length is set below recommended 8 characters.',
            severity: AuditSeverity.WARNING,
            category: 'authentication',
            recommendation: 'Increase password minimum length to at least 8 characters.'
          });
        }
      }
    } catch (error) {
      console.error('Error checking auth settings:', error);
    }
    
    return findings;
  }
  
  /**
   * Audit authorization mechanisms
   */
  public async auditAuthorization(): Promise<SecurityFinding[]> {
    const findings: SecurityFinding[] = [];
    
    // Check if hasPermission function is properly implemented
    try {
      // Create a mock user for testing
      const mockUser: User = {
        id: 'test-user',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER' as any,
      };
      
      // Test if hasPermission correctly denies access for undefined user
      const undefinedUserResult = hasPermission(undefined as any, 'VIEW_DASHBOARD');
      if (undefinedUserResult !== false) {
        findings.push({
          id: 'authz-001',
          title: 'Permission check bypass',
          description: 'hasPermission function does not properly handle undefined users.',
          severity: AuditSeverity.ERROR,
          category: 'authorization',
          recommendation: 'Update hasPermission to safely handle undefined users.'
        });
      }
      
      // Check authorization functions for null safety
      try {
        hasPermission(null as any, 'VIEW_DASHBOARD');
      } catch (error) {
        findings.push({
          id: 'authz-002',
          title: 'Authorization function error',
          description: 'hasPermission throws error with null user instead of returning false.',
          severity: AuditSeverity.ERROR,
          category: 'authorization',
          recommendation: 'Update permission checking to safely handle null users.'
        });
      }
    } catch (error) {
      console.error('Error in authorization audit:', error);
    }
    
    return findings;
  }
  
  /**
   * Audit input validation & sanitization
   */
  public auditInputValidation(): SecurityFinding[] {
    const findings: SecurityFinding[] = [];
    
    // Check email validation function
    const validEmail = 'test@example.com';
    const invalidEmail = 'not-an-email';
    
    if (!isValidEmail(validEmail)) {
      findings.push({
        id: 'input-001',
        title: 'Email validation issue',
        description: 'Email validation function incorrectly rejects valid email addresses.',
        severity: AuditSeverity.WARNING,
        category: 'input_validation',
        recommendation: 'Review and fix email validation function.'
      });
    }
    
    if (isValidEmail(invalidEmail)) {
      findings.push({
        id: 'input-002',
        title: 'Email validation bypass',
        description: 'Email validation function accepts invalid email formats.',
        severity: AuditSeverity.WARNING,
        category: 'input_validation',
        recommendation: 'Fix email validation to properly reject invalid formats.'
      });
    }
    
    // Test sanitization function
    const xssPayload = '<script>alert("XSS")</script>';
    const sanitizedOutput = sanitizeInput(xssPayload);
    
    if (sanitizedOutput.includes('<script>')) {
      findings.push({
        id: 'input-003',
        title: 'XSS vulnerability',
        description: 'Input sanitization does not properly handle script tags.',
        severity: AuditSeverity.CRITICAL,
        category: 'input_validation',
        recommendation: 'Update input sanitization to properly escape HTML tags.'
      });
    }
    
    return findings;
  }
  
  /**
   * Audit for data exposure risks
   */
  public auditDataExposure(): SecurityFinding[] {
    const findings: SecurityFinding[] = [];
    
    // Check for sensitive data in localStorage
    const localStorageItems = { ...localStorage };
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth'];
    
    Object.keys(localStorageItems).forEach(key => {
      // Check if any key contains sensitive words
      if (sensitiveKeys.some(sensitiveKey => key.toLowerCase().includes(sensitiveKey))) {
        findings.push({
          id: 'data-001',
          title: 'Sensitive data in localStorage',
          description: `Potentially sensitive data stored in localStorage (${key}).`,
          severity: AuditSeverity.WARNING,
          category: 'data_exposure',
          recommendation: 'Avoid storing sensitive information in localStorage.'
        });
      }
    });
    
    return findings;
  }
  
  /**
   * Run comprehensive security audit
   */
  public async runFullAudit(): Promise<SecurityAuditResult> {
    // Run all audit checks
    const authFindings = await this.auditAuthentication();
    const authzFindings = await this.auditAuthorization();
    const inputFindings = this.auditInputValidation();
    const dataFindings = this.auditDataExposure();
    
    // Combine all findings
    const allFindings = [
      ...authFindings,
      ...authzFindings,
      ...inputFindings,
      ...dataFindings
    ];
    
    // Count issues by severity
    const criticalIssues = allFindings.filter(f => f.severity === AuditSeverity.CRITICAL).length;
    const highIssues = allFindings.filter(f => f.severity === AuditSeverity.ERROR).length;
    const mediumIssues = allFindings.filter(f => f.severity === AuditSeverity.WARNING).length;
    const lowIssues = allFindings.filter(f => f.severity === AuditSeverity.INFO).length;
    
    // Calculate score: 100 - (critical*20 + high*10 + medium*5 + low*1)
    let score = 100 - (criticalIssues * 20 + highIssues * 10 + mediumIssues * 5 + lowIssues * 1);
    score = Math.max(0, Math.min(100, score)); // Clamp between 0-100
    
    return {
      passed: criticalIssues === 0 && highIssues === 0,
      findings: allFindings,
      score,
      criticalIssues,
      highIssues,
      mediumIssues,
      lowIssues
    };
  }
}

export const securityAuditor = new SecurityAuditor();
export default securityAuditor;
