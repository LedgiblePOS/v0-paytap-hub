
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditLog } from "@/types/settings";
import { Loader2, AlertTriangle } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend 
} from 'recharts';

interface AuditLogInsightsProps {
  logs: AuditLog[];
  isLoading: boolean;
  error: Error | null;
  timeRange: string;
}

export const AuditLogInsights = ({ logs, isLoading, error, timeRange }: AuditLogInsightsProps) => {
  if (isLoading) {
    return (
      <div className="grid place-items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid place-items-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <p className="text-destructive">Failed to load data: {error.message}</p>
        </div>
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="grid place-items-center h-64">
        <p className="text-muted-foreground">No audit data available for analysis.</p>
      </div>
    );
  }

  // Process data for insights
  const actionCounts = logs.reduce((acc: Record<string, number>, log) => {
    const action = log.action || 'UNKNOWN';
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {});

  const resourceCounts = logs.reduce((acc: Record<string, number>, log) => {
    const resource = log.resource || 'UNKNOWN';
    acc[resource] = (acc[resource] || 0) + 1;
    return acc;
  }, {});

  const actionData = Object.entries(actionCounts).map(([name, value]) => ({ name, value }));
  const resourceData = Object.entries(resourceCounts).map(([name, value]) => ({ name, value }));

  // Color scale for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  const timeRangeText = () => {
    switch (timeRange) {
      case '24h': return 'last 24 hours';
      case '7days': return 'last 7 days';
      case '30days': return 'last 30 days';
      case '90days': return 'last 90 days';
      default: return timeRange;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Actions Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Distribution</CardTitle>
          <CardDescription>
            Breakdown of audit log actions during the {timeRangeText()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={actionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {actionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Resources Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Activity</CardTitle>
          <CardDescription>
            Most accessed resources during the {timeRangeText()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={resourceData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end"
                  tick={{ fontSize: 11 }}
                  height={60}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} events`, 'Count']}
                />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Audit Log Summary</CardTitle>
          <CardDescription>
            Key statistics from the {timeRangeText()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Events</p>
              <p className="text-3xl font-bold">{logs.length}</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Unique Users</p>
              <p className="text-3xl font-bold">
                {new Set(logs.map(log => log.user_id).filter(Boolean)).size}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Most Common Action</p>
              <p className="text-xl font-bold truncate">
                {Object.entries(actionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-1">Most Accessed Resource</p>
              <p className="text-xl font-bold truncate">
                {Object.entries(resourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
