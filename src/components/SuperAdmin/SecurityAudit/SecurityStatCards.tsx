
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export interface SecurityStatCardsProps {
  totalIssues: number;
  criticalIssues: number;
  resolvedIssues: number;
  lastAuditDate: string;
}

const SecurityStatCards: React.FC<SecurityStatCardsProps> = ({
  totalIssues,
  criticalIssues,
  resolvedIssues,
  lastAuditDate
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="p-2 bg-blue-100 rounded-full mr-4">
            <Shield className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
            <p className="text-2xl font-bold">{totalIssues}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="p-2 bg-red-100 rounded-full mr-4">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Critical Issues</p>
            <p className="text-2xl font-bold">{criticalIssues}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="p-2 bg-green-100 rounded-full mr-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Resolved Issues</p>
            <p className="text-2xl font-bold">{resolvedIssues}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center p-6">
          <div className="p-2 bg-amber-100 rounded-full mr-4">
            <Clock className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Last Audit</p>
            <p className="text-lg font-bold">{formatDate(lastAuditDate)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityStatCards;
