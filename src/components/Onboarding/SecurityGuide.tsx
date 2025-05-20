
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OnboardingTooltip from './OnboardingTooltip';

const SecurityGuide: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Security & Monitoring Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <OnboardingTooltip 
            content="Our error tracking system automatically captures and analyzes application errors to ensure reliability."
          >
            <h3 className="text-lg font-semibold">Error Tracking</h3>
          </OnboardingTooltip>
          <p className="text-sm text-muted-foreground mt-1">
            View detailed error reports and analytics in the monitoring dashboard.
          </p>
        </div>

        <div>
          <OnboardingTooltip 
            content="Monitor your application's performance metrics including response times and resource usage."
          >
            <h3 className="text-lg font-semibold">Performance Monitoring</h3>
          </OnboardingTooltip>
          <p className="text-sm text-muted-foreground mt-1">
            Track page load times, API response times, and system resources.
          </p>
        </div>

        <div>
          <OnboardingTooltip 
            content="Set up alerts for critical errors and performance issues to stay informed."
          >
            <h3 className="text-lg font-semibold">Automated Alerts</h3>
          </OnboardingTooltip>
          <p className="text-sm text-muted-foreground mt-1">
            Configure notification thresholds and alert channels.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityGuide;
