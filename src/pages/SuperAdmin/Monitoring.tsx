
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, BarChart, Users } from "lucide-react";
import SystemHealthDashboard from "@/components/SuperAdmin/Monitoring/SystemHealthDashboard";
import MerchantActivityTracker from "@/components/SuperAdmin/Monitoring/MerchantActivityTracker";
import BusinessKPIReport from "@/components/SuperAdmin/Monitoring/BusinessKPIReport";
import IntegrationLogsView from "@/components/SuperAdmin/Monitoring/IntegrationLogsView";
import { ErrorMetricsTooltip, PerformanceMetricsTooltip } from "@/components/Monitoring/MonitoringTooltips";

const MonitoringDashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Activity className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold">Monitoring & Analytics</h1>
      </div>
      
      <Tabs defaultValue="system">
        <TabsList className="mb-4">
          <TabsTrigger value="system">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              System Health
            </div>
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <div className="flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              Integration Logs
            </div>
          </TabsTrigger>
          <TabsTrigger value="activity">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Merchant Activity
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <SystemHealthDashboard />
        </TabsContent>
        
        <TabsContent value="integrations">
          <IntegrationLogsView />
        </TabsContent>
        
        <TabsContent value="activity">
          <MerchantActivityTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MonitoringDashboard;
