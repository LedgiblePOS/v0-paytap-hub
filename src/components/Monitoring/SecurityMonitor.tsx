
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditSeverity, AuditEntityType } from '@/types/enums';
import { default as enhancedAuditService } from '@/services/enhancedAuditService';

const SecurityMonitor: React.FC = () => {
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      checkSecurityEvents();
    }, 60000); // Check every minute
    
    // Initial check
    checkSecurityEvents();
    
    return () => clearInterval(interval);
  }, []);
  
  const checkSecurityEvents = () => {
    // In a real app, this would connect to a security monitoring service
    const now = new Date();
    
    // Log that we performed a security check
    enhancedAuditService.logAuditEvent(
      "Security monitoring system performed routine check", 
      AuditSeverity.INFO
    );
    
    // Example of detecting suspicious activity
    const suspiciousActivityDetected = Math.random() > 0.9;
    if (suspiciousActivityDetected) {
      enhancedAuditService.logAuditEvent(
        "Potential security threat detected", 
        AuditSeverity.WARNING
      );
    }
    
    setLastChecked(now);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p>Security monitoring active</p>
          <p>Last check: {lastChecked.toLocaleTimeString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMonitor;
