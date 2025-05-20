
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useMerchant } from "@/hooks/useMerchant";
import { formatCurrency } from "@/utils/formatters";

interface WeeklySalesChartProps {
  data: Array<{
    day: string;
    amount: number;
  }>;
}

const WeeklySalesChart: React.FC<WeeklySalesChartProps> = ({ data }) => {
  const { merchant } = useMerchant();
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value, merchant?.defaultCurrency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Weekly Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                theme: {
                  light: "#0FA0CE",
                  dark: "#0FA0CE"
                }
              }
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis 
                  tickFormatter={(value) => 
                    formatCurrency(value, merchant?.defaultCurrency)
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" name="revenue" fill="var(--color-revenue)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySalesChart;
