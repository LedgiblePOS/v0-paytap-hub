
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { securityAuditor, SecurityAuditResult, SecurityFinding } from '@/utils/security/SecurityAuditor';
import { AuditSeverity } from '@/services/enhancedAuditService';
import enhancedAuditService from '@/services/enhancedAuditService';

const SecurityAuditPage: React.FC = () => {
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const runSecurityAudit = async () => {
    setIsLoading(true);
    try {
      const result = await securityAuditor.runFullAudit();
      setAuditResult(result);
      
      // Log audit completion to audit trail
      enhancedAuditService.logAudit(
        'security_audit_completed',
        'SECURITY',
        `Security audit completed with score: ${result.score}/100`,
        undefined,
        { 
          criticalIssues: result.criticalIssues,
          highIssues: result.highIssues,
          mediumIssues: result.mediumIssues,
          lowIssues: result.lowIssues
        }
      );
      
      toast({
        title: "Security Audit Complete",
        description: `Security score: ${result.score}/100`,
        variant: result.score >= 80 ? "default" : "destructive"
      });
    } catch (error) {
      console.error('Error running security audit:', error);
      toast({
        title: "Audit Failed",
        description: "An error occurred while running the security audit.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // On component mount, maybe check if there's a recent audit result
  }, []);

  const getSeverityIcon = (severity: AuditSeverity) => {
    switch (severity) {
      case AuditSeverity.CRITICAL:
        return <XCircle className="h-5 w-5 text-destructive" />;
      case AuditSeverity.ERROR:
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case AuditSeverity.WARNING:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case AuditSeverity.INFO:
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case AuditSeverity.CRITICAL:
        return <Badge variant="destructive">Critical</Badge>;
      case AuditSeverity.ERROR:
        return <Badge variant="destructive">High</Badge>;
      case AuditSeverity.WARNING:
        return <Badge variant="outline">Medium</Badge>;
      case AuditSeverity.INFO:
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'authentication':
        return <Badge variant="outline" className="bg-blue-100">Authentication</Badge>;
      case 'authorization':
        return <Badge variant="outline" className="bg-purple-100">Authorization</Badge>;
      case 'input_validation':
        return <Badge variant="outline" className="bg-green-100">Input Validation</Badge>;
      case 'data_exposure':
        return <Badge variant="outline" className="bg-yellow-100">Data Exposure</Badge>;
      case 'configuration':
        return <Badge variant="outline" className="bg-gray-100">Configuration</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100">Other</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Shield className="mr-2 h-6 w-6" />
          Security Audit
        </h1>
        <Button 
          onClick={runSecurityAudit} 
          disabled={isLoading}
          className="bg-primary"
        >
          {isLoading ? "Running Audit..." : "Run Security Audit"}
        </Button>
      </div>

      {auditResult ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditResult.score}/100</div>
                <Progress value={auditResult.score} className="h-2 mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-destructive">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditResult.criticalIssues}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-amber-500">Medium Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditResult.mediumIssues}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-blue-500">Low Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditResult.lowIssues}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Audit Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>
                  The security audit {auditResult.passed 
                    ? 'passed with no critical or high severity issues.' 
                    : 'identified issues that should be addressed before deployment.'}
                </p>
              </div>
              
              {auditResult.findings.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {auditResult.findings.map((finding: SecurityFinding) => (
                    <AccordionItem key={finding.id} value={finding.id}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(finding.severity)}
                          <span>{finding.title}</span>
                          {getSeverityBadge(finding.severity)}
                          {getCategoryBadge(finding.category)}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-6">
                          <p className="text-muted-foreground">{finding.description}</p>
                          <div>
                            <strong>Recommendation:</strong> {finding.recommendation}
                          </div>
                          {finding.affectedComponent && (
                            <div>
                              <strong>Affected Component:</strong> {finding.affectedComponent}
                            </div>
                          )}
                          {finding.references && finding.references.length > 0 && (
                            <div>
                              <strong>References:</strong>
                              <ul className="list-disc pl-5 mt-1">
                                {finding.references.map((ref, idx) => (
                                  <li key={idx}>{ref}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="flex items-center justify-center p-8">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                  <span>No security issues found</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Last audit: {new Date().toLocaleString()}
              </p>
            </CardFooter>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Security Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-12">
              <Shield className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-center mb-6">
                Run a security audit to identify potential vulnerabilities in your application.
              </p>
              <Button 
                onClick={runSecurityAudit} 
                disabled={isLoading}
              >
                {isLoading ? "Running Audit..." : "Run Security Audit"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SecurityAuditPage;
