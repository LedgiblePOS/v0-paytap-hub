
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from 'lucide-react';

export interface SecurityAuditChecklistProps {
  auditResults: {
    passed: string[];
    failed: string[];
  };
}

const SecurityAuditChecklist: React.FC<SecurityAuditChecklistProps> = ({ auditResults }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Audit Checklist</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-500" />
              Passed Checks
            </h3>
            <ul className="mt-2 space-y-1">
              {auditResults.passed.map((item, index) => (
                <li key={index} className="text-sm pl-7 py-1">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium flex items-center">
              <X className="h-5 w-5 mr-2 text-red-500" />
              Failed Checks
            </h3>
            <ul className="mt-2 space-y-1">
              {auditResults.failed.map((item, index) => (
                <li key={index} className="text-sm pl-7 py-1 text-red-600">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityAuditChecklist;
