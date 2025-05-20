
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

interface CustomerSegmentationProps {
  segments: Array<{
    name: string;
    value: number;
    color: string;
    growth: number;
  }>;
  totalCustomers: number;
}

const CustomerSegmentation: React.FC<CustomerSegmentationProps> = ({
  segments,
  totalCustomers,
}) => {
  const formatTooltip = (value: number) => {
    const percentage = ((value / totalCustomers) * 100).toFixed(1);
    return `${value} customers (${percentage}%)`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Customer Segmentation</CardTitle>
        <CardDescription>Analysis of customer types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-1/2 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltip} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full lg:w-1/2">
            <h3 className="font-medium text-sm mb-4">Segment Details</h3>
            <div className="space-y-3">
              {segments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span>{segment.name}</span>
                    {segment.growth > 0 && (
                      <Badge className="bg-green-100 text-green-800">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        {segment.growth}%
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm font-medium">
                    {((segment.value / totalCustomers) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-blue-50 p-3 rounded-md text-blue-800 text-sm">
              <p className="font-medium">Insights</p>
              <ul className="list-disc pl-5 mt-2 text-xs space-y-1">
                <li>New customers grew by {segments.find(s => s.name === 'New')?.growth || 0}% this month</li>
                <li>Loyal customers account for {((segments.find(s => s.name === 'Loyal')?.value || 0) / totalCustomers * 100).toFixed(1)}% of your customer base</li>
                <li>Focus on converting one-time customers to repeat customers for better retention</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerSegmentation;
