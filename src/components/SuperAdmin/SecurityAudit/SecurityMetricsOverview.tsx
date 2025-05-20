
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeDollarSign, Lock, Shield, Users } from 'lucide-react';

interface SecurityMetric {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const SecurityMetricsOverview: React.FC = () => {
  const metrics: SecurityMetric[] = [
    {
      title: "Authentication Security",
      value: "97%",
      description: "Overall authentication security score",
      icon: <Lock className="h-6 w-6" />
    },
    {
      title: "User Security",
      value: "93%",
      description: "User permissions and access controls",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Data Protection",
      value: "95%",
      description: "Data encryption and protection score",
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "Payment Security",
      value: "99%",
      description: "Payment processing security",
      icon: <BadgeDollarSign className="h-6 w-6" />
    }
  ];

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Security Metrics Overview</CardTitle>
        <CardDescription>Current security status and metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <div className="p-2 bg-primary/10 rounded-full mr-3 text-primary">
                  {metric.icon}
                </div>
                <h3 className="font-medium text-lg">{metric.title}</h3>
              </div>
              <p className="text-3xl font-bold mb-1">{metric.value}</p>
              <p className="text-muted-foreground text-sm">{metric.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityMetricsOverview;
