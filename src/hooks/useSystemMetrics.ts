
import { useState, useEffect } from 'react';
import { SystemMetric } from '@/types/metrics';
import { Trend } from '@/types/enums';

interface UseSystemMetricsReturn {
  metrics: SystemMetric[];
  userActivityMetrics: SystemMetric[];
  apiUsageMetrics: SystemMetric[];
  errorRateMetrics: SystemMetric[];
  performanceMetrics: SystemMetric[];
  isLoading: boolean;
  error: string | null;
}

const useSystemMetrics = (): UseSystemMetricsReturn => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        // Mock data for demonstration
        const mockData: SystemMetric[] = [
          // User Activity Metrics
          {
            id: '1',
            metricName: 'Daily Active Users',
            metricType: 'count',
            metricValue: 245,
            metricDate: new Date().toISOString(),
            category: 'USER_ACTIVITY',
            percentageChange: 5.2,
            trend: Trend.UP,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            metricName: 'Daily Active Users',
            metricType: 'count',
            metricValue: 233,
            metricDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            category: 'USER_ACTIVITY',
            percentageChange: 3.1,
            trend: Trend.UP,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          
          // API Usage Metrics
          {
            id: '3',
            metricName: 'API Requests',
            metricType: 'count',
            metricValue: 12567,
            metricDate: new Date().toISOString(),
            category: 'API_USAGE',
            percentageChange: 7.8,
            trend: Trend.UP,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '4',
            metricName: 'API Requests',
            metricType: 'count',
            metricValue: 11658,
            metricDate: new Date(Date.now() - 86400000).toISOString(),
            category: 'API_USAGE',
            percentageChange: 2.3,
            trend: Trend.UP,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          
          // Error Rate Metrics
          {
            id: '5',
            metricName: 'Error Rate',
            metricType: 'percentage',
            metricValue: 0.8,
            metricDate: new Date().toISOString(),
            category: 'ERROR_RATE',
            percentageChange: -1.2,
            trend: Trend.DOWN,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '6',
            metricName: 'Error Rate',
            metricType: 'percentage',
            metricValue: 0.81,
            metricDate: new Date(Date.now() - 86400000).toISOString(),
            category: 'ERROR_RATE',
            percentageChange: 0.1,
            trend: Trend.STABLE,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          
          // Performance Metrics
          {
            id: '7',
            metricName: 'Avg Response Time',
            metricType: 'milliseconds',
            metricValue: 187,
            metricDate: new Date().toISOString(),
            category: 'PERFORMANCE',
            percentageChange: -3.5,
            trend: Trend.DOWN,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '8',
            metricName: 'Avg Response Time',
            metricType: 'milliseconds',
            metricValue: 194,
            metricDate: new Date(Date.now() - 86400000).toISOString(),
            category: 'PERFORMANCE',
            percentageChange: 0.5,
            trend: Trend.STABLE,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ];

        setMetrics(mockData);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load system metrics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);
  
  // Filter metrics by category
  const userActivityMetrics = metrics.filter(metric => metric.category === 'USER_ACTIVITY');
  const apiUsageMetrics = metrics.filter(metric => metric.category === 'API_USAGE');
  const errorRateMetrics = metrics.filter(metric => metric.category === 'ERROR_RATE');
  const performanceMetrics = metrics.filter(metric => metric.category === 'PERFORMANCE');

  return { 
    metrics, 
    userActivityMetrics,
    apiUsageMetrics,
    errorRateMetrics,
    performanceMetrics,
    isLoading, 
    error 
  };
};

export { useSystemMetrics };
export default useSystemMetrics;
