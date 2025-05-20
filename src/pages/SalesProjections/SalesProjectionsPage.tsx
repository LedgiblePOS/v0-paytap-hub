
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useSalesProjections, { ProjectionOptions } from '@/hooks/useSalesProjections';
import ProjectionSettings from '@/components/SalesProjections/ProjectionSettings';
import ProjectionResults from '@/components/SalesProjections/ProjectionResults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Download, Share2, Settings } from 'lucide-react';
import { toast } from 'sonner';

const SalesProjectionsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Initial options for projections
  const initialOptions: ProjectionOptions = {
    timeframe: '6months',
    growthAdjustment: 0,
    useSeasonalAdjustments: true
  };
  
  const [options, setOptions] = useState<ProjectionOptions>(initialOptions);
  
  const {
    projections,
    isLoading,
    error,
    regenerateProjections,
    totalProjectedRevenue,
    averageMonthlyRevenue,
    confidenceLevel
  } = useSalesProjections(initialOptions);

  const handleOptionsChange = (newOptions: ProjectionOptions) => {
    setOptions(newOptions);
  };

  const handleRegenerate = () => {
    toast.promise(regenerateProjections(options), {
      loading: 'Generating sales projections...',
      success: 'Sales projections updated',
      error: 'Failed to update projections'
    });
  };

  const handleExportData = () => {
    toast.success('Export feature will be available soon');
    // Future functionality: Export projections to CSV/PDF
  };

  const handleShareProjections = () => {
    toast.success('Share feature will be available soon');
    // Future functionality: Allow sharing projections
  };

  if (!user) {
    return <div className="p-4">Please log in to view sales projections</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Sales Forecasting</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleShareProjections}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <ProjectionSettings
        options={options}
        onOptionsChange={handleOptionsChange}
        onRegenerate={handleRegenerate}
        isLoading={isLoading}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Actual vs Projected</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Factors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <ProjectionResults
            projections={projections}
            isLoading={isLoading}
            totalProjectedRevenue={totalProjectedRevenue}
            averageMonthlyRevenue={averageMonthlyRevenue}
            confidenceLevel={confidenceLevel}
          />
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Actual vs Projected Sales</CardTitle>
              <CardDescription>
                Compare how your actual sales performance tracks against projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-80 bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Comparison view will be available in a future update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seasonal">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Adjustment Factors</CardTitle>
              <CardDescription>
                View and adjust seasonal factors affecting your sales projections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-80 bg-muted rounded-md">
                <p className="text-muted-foreground">
                  Seasonal adjustments will be available in a future update
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
          Error loading projections: {error.message}
        </div>
      )}
    </div>
  );
};

export default SalesProjectionsPage;
