
import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricsOverview from '../MetricsOverview';
import { SystemMetric } from '@/types/metrics';
import { Trend } from '@/types/enums';

describe('MetricsOverview', () => {
  const mockMetrics: SystemMetric[] = [
    {
      id: '1',
      metricName: 'Active Users',
      metricType: 'users',
      metricValue: 120,
      metricDate: '2023-01-01',
      percentageChange: 5.2,
      trend: Trend.UP,
      category: 'users',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '2',
      metricName: 'New Orders',
      metricType: 'transactions',
      metricValue: 45,
      metricDate: '2023-01-01',
      percentageChange: -2.1,
      trend: Trend.DOWN,
      category: 'sales',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '3',
      metricName: 'Revenue',
      metricType: 'sales',
      metricValue: 12500,
      metricDate: '2023-01-01',
      percentageChange: 3.7,
      trend: Trend.UP,
      category: 'sales',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    }
  ];

  it('renders metrics correctly', () => {
    render(<MetricsOverview systemMetrics={mockMetrics} />);
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('New Orders')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('shows loading state when loading is true', () => {
    render(<MetricsOverview systemMetrics={[]} loading={true} />);
    expect(screen.getByText('Loading metrics...')).toBeInTheDocument();
  });

  it('shows no metrics message when metrics array is empty', () => {
    render(<MetricsOverview systemMetrics={[]} />);
    expect(screen.getByText('No metrics available')).toBeInTheDocument();
  });
});
