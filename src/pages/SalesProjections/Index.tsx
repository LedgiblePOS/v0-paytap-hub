
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import salesProjector, { SalesProjection } from "@/services/projections/salesProjector";

// Mock data for actual vs projected sales
const mockSalesComparisonData = [
  { month: "Jan", actual: 12600, projected: 11800 },
  { month: "Feb", actual: 14200, projected: 13400 },
  { month: "Mar", actual: 15800, projected: 15000 },
  { month: "Apr", actual: 16900, projected: 16500 },
  { month: "May", actual: 18300, projected: 18000 },
  { month: "Jun", actual: 19500, projected: 19800 },
  { month: "Jul", actual: 0, projected: 21000 },
  { month: "Aug", actual: 0, projected: 22300 },
  { month: "Sep", actual: 0, projected: 23600 },
];

// Mock seasonal adjustment factors
const mockSeasonalAdjustments = [
  { month: "Jan", factor: 0.8 },
  { month: "Feb", factor: 0.9 },
  { month: "Mar", factor: 1.0 },
  { month: "Apr", factor: 1.1 },
  { month: "May", factor: 1.2 },
  { month: "Jun", factor: 1.3 },
  { month: "Jul", factor: 1.4 },
  { month: "Aug", factor: 1.3 },
  { month: "Sep", factor: 1.2 },
  { month: "Oct", factor: 1.1 },
  { month: "Nov", factor: 1.3 },
  { month: "Dec", factor: 1.5 },
];

const SalesProjections: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [projections, setProjections] = useState<SalesProjection[]>([]);
  const [timeframe, setTimeframe] = useState<"3months" | "6months" | "12months">("6months");
  const [growthAdjustment, setGrowthAdjustment] = useState(0); // -50 to +50 percentage points
  const [useSeasonalAdjustments, setUseSeasonalAdjustments] = useState(true);
  
  // Chart configs
  const comparisonChartConfig = {
    actual: {
      label: "Actual Sales",
      theme: {
        light: "hsl(220, 90%, 60%)",
        dark: "hsl(220, 90%, 60%)"
      }
    },
    projected: {
      label: "Projected Sales",
      theme: {
        light: "hsl(150, 60%, 50%)",
        dark: "hsl(150, 60%, 50%)"
      }
    }
  };
  
  const seasonalChartConfig = {
    factor: {
      label: "Seasonal Factor",
      theme: {
        light: "hsl(40, 90%, 60%)",
        dark: "hsl(40, 90%, 60%)"
      }
    }
  };
  
  const projectionChartConfig = {
    projectedSales: {
      label: "Projected Sales",
      theme: {
        light: "hsl(220, 90%, 60%)",
        dark: "hsl(220, 90%, 60%)"
      }
    }
  };

  // Load sales projections
  useEffect(() => {
    const loadProjections = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // In a real app, you would fetch the merchant ID from the user
        const merchantId = "123456"; // placeholder
        
        // Get the number of months to project
        const months = timeframe === "3months" ? 3 : timeframe === "6months" ? 6 : 12;
        
        // In a real app, you would use the actual projections service
        // For now, use mock data
        const projectionData = await salesProjector.projectMonthlySales(merchantId, months);
        setProjections(projectionData);
      } catch (error) {
        console.error("Error loading sales projections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProjections();
  }, [user, timeframe]);

  const handleRegenerateProjections = () => {
    // This would regenerate projections with the adjusted parameters
    console.log("Regenerating projections with adjustments:", {
      growthAdjustment,
      useSeasonalAdjustments,
      timeframe
    });
  };

  if (!user) {
    return <div>Please log in to view sales projections</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Forecasting</h1>
        <div className="flex items-center space-x-4">
          <Button onClick={handleRegenerateProjections}>
            Regenerate Projections
          </Button>
        </div>
      </div>

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
                value={timeframe} 
                onValueChange={(value: any) => setTimeframe(value)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-[400px]">
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
                  {growthAdjustment > 0 ? "+" : ""}{growthAdjustment}%
                </span>
              </div>
              <Slider 
                value={[growthAdjustment]} 
                min={-50} 
                max={50} 
                step={1}
                onValueChange={(values) => setGrowthAdjustment(values[0])}
              />
              <p className="text-xs text-muted-foreground">
                Adjust the growth rate up or down from the base projection
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Switch 
                id="seasonal" 
                checked={useSeasonalAdjustments}
                onCheckedChange={setUseSeasonalAdjustments}
              />
              <div className="space-y-1">
                <Label htmlFor="seasonal">Use Seasonal Adjustments</Label>
                <p className="text-xs text-muted-foreground">
                  Apply seasonal patterns to improve forecast accuracy
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Actual vs Projected</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal Factors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Forecast Overview</CardTitle>
              <CardDescription>
                Projected sales for the next {timeframe === "3months" ? "3" : timeframe === "6months" ? "6" : "12"} months
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-80 w-full" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Total Projected Revenue
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$125,400</div>
                        <p className="text-xs text-muted-foreground">
                          +15% from previous period
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Average Monthly Revenue
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$20,900</div>
                        <p className="text-xs text-muted-foreground">
                          +8% from previous average
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                          Projection Confidence
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Medium</div>
                        <p className="text-xs text-muted-foreground">
                          Based on 6 months of historical data
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <ChartContainer className="h-80" config={projectionChartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockSalesComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="projected" 
                          name="projectedSales" 
                          stroke="var(--color-projectedSales)" 
                          fill="var(--color-projectedSales)"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Projection Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">Growth Rate:</span>
                        <span>8.5% annually</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">Confidence Level:</span>
                        <span>Medium</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">Projection Basis:</span>
                        <span>6 months of historical data</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">Seasonal Adjustments:</span>
                        <span>{useSeasonalAdjustments ? "Applied" : "Not Applied"}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
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
              <ChartContainer className="h-80" config={comparisonChartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockSalesComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      name="actual" 
                      stroke="var(--color-actual)" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="projected" 
                      name="projected" 
                      stroke="var(--color-projected)" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Performance Analysis</h3>
                <p>
                  Your actual sales have consistently outperformed projections by an average of 5.2% over the last 6 months.
                  This indicates our forecasting model may be slightly conservative and could be adjusted upward.
                </p>
                
                <div className="flex justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Forecast Accuracy:</span>
                  <span className="text-green-600 font-medium">94.8%</span>
                </div>
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
              <ChartContainer className="h-80" config={seasonalChartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockSeasonalAdjustments}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 2]} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar 
                      dataKey="factor" 
                      name="factor" 
                      fill="var(--color-factor)" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">About Seasonal Adjustments</h3>
                <p>
                  Seasonal adjustment factors account for regular patterns in your sales throughout the year.
                  A factor above 1.0 indicates higher than average sales for that period, while below 1.0 indicates lower than average.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Highest Season:</span>
                    <span>December (1.5x)</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted rounded-lg">
                    <span className="font-medium">Lowest Season:</span>
                    <span>January (0.8x)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesProjections;
