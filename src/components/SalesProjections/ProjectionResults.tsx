
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface ProjectionData {
  month: string;
  projectedSales: number;
  actualSales?: number;
}

interface ProjectionResultsProps {
  projectionData: ProjectionData[];
  totalProjected: number;
  totalActual?: number;
  accuracy?: number;
}

const ProjectionResults: React.FC<ProjectionResultsProps> = ({
  projectionData,
  totalProjected,
  totalActual,
  accuracy
}) => {
  // Chart configuration
  const chartConfig = {
    projectedSales: {
      label: 'Projected Sales',
      theme: { light: '#3b82f6', dark: '#60a5fa' }
    },
    actualSales: {
      label: 'Actual Sales',
      theme: { light: '#10b981', dark: '#34d399' }
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const hasActualData = projectionData.some(item => item.actualSales !== undefined);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Projected Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalProjected)}</div>
          </CardContent>
        </Card>
        
        {totalActual !== undefined && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Actual Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalActual)}</div>
            </CardContent>
          </Card>
        )}
        
        {accuracy !== undefined && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Projection Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={cn(
                  "text-2xl font-bold",
                  accuracy > 90 ? "text-green-500" : 
                  accuracy > 70 ? "text-amber-500" : 
                  "text-red-500"
                )}
              >
                {accuracy.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Projection Chart</CardTitle>
          <CardDescription>Monthly sales forecast visualization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="projectedSales" 
                    name="Projected Sales"
                    stroke="var(--color-projectedSales)"
                    activeDot={{ r: 8 }}
                  />
                  {hasActualData && (
                    <Line 
                      type="monotone" 
                      dataKey="actualSales" 
                      name="Actual Sales" 
                      stroke="var(--color-actualSales)"
                      strokeDasharray="5 5"
                      activeDot={{ r: 6 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Chart (Bar) */}
      {hasActualData && (
        <Card>
          <CardHeader>
            <CardTitle>Projection vs. Actual</CardTitle>
            <CardDescription>Comparison of projected and actual sales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value}`} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="projectedSales" name="Projected Sales" fill="var(--color-projectedSales)" />
                    <Bar dataKey="actualSales" name="Actual Sales" fill="var(--color-actualSales)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectionResults;
