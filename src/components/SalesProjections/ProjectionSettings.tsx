
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ProjectionOptions, ProjectionTimeframe } from '@/hooks/useSalesProjections';

interface ProjectionSettingsProps {
  options: ProjectionOptions;
  onOptionsChange: (options: ProjectionOptions) => void;
  onRegenerate: () => void;
  isLoading: boolean;
}

const ProjectionSettings: React.FC<ProjectionSettingsProps> = ({
  options,
  onOptionsChange,
  onRegenerate,
  isLoading
}) => {
  const handleTimeframeChange = (value: string) => {
    onOptionsChange({
      ...options,
      timeframe: value as ProjectionTimeframe
    });
  };

  const handleGrowthAdjustmentChange = (values: number[]) => {
    onOptionsChange({
      ...options,
      growthAdjustment: values[0]
    });
  };

  const handleSeasonalAdjustmentsChange = (checked: boolean) => {
    onOptionsChange({
      ...options,
      useSeasonalAdjustments: checked
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projection Settings</CardTitle>
        <CardDescription>
          Adjust parameters to fine-tune your sales projections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Projection Timeframe</Label>
            <Tabs 
              value={options.timeframe} 
              onValueChange={handleTimeframeChange}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
                <TabsTrigger value="3months">3 Months</TabsTrigger>
                <TabsTrigger value="6months">6 Months</TabsTrigger>
                <TabsTrigger value="12months">12 Months</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Growth Rate Adjustment</Label>
              <span className="text-sm text-muted-foreground">
                {options.growthAdjustment > 0 ? "+" : ""}{options.growthAdjustment}%
              </span>
            </div>
            <Slider 
              value={[options.growthAdjustment]} 
              min={-50} 
              max={50} 
              step={1}
              onValueChange={handleGrowthAdjustmentChange}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Adjust the growth rate up or down from the base projection
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Switch 
              id="seasonal" 
              checked={options.useSeasonalAdjustments}
              onCheckedChange={handleSeasonalAdjustmentsChange}
              disabled={isLoading}
            />
            <div className="space-y-1">
              <Label htmlFor="seasonal">Use Seasonal Adjustments</Label>
              <p className="text-xs text-muted-foreground">
                Apply seasonal patterns to improve forecast accuracy
              </p>
            </div>
          </div>
          
          <Button 
            onClick={onRegenerate} 
            disabled={isLoading}
            className="w-full md:w-auto"
          >
            {isLoading ? "Generating..." : "Regenerate Projections"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectionSettings;
