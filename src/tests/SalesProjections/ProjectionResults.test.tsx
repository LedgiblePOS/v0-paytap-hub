
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProjectionResults from '@/components/SalesProjections/ProjectionResults';
import { SalesProjection } from '@/services/projections/salesProjector';

// Mock the chart component to avoid rendering issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Area: () => <div data-testid="chart-area" />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />
}));

describe('ProjectionResults Component', () => {
  const mockProjections: SalesProjection[] = [
    {
      period: 'January 2025',
      projectedSales: 10000,
      confidenceLevel: 'medium',
      growthRate: 0.05
    },
    {
      period: 'February 2025',
      projectedSales: 12000,
      confidenceLevel: 'medium',
      growthRate: 0.05
    },
    {
      period: 'March 2025',
      projectedSales: 15000,
      confidenceLevel: 'medium',
      growthRate: 0.05
    }
  ];

  test('renders loading state correctly', () => {
    render(
      <ProjectionResults
        projections={[]}
        isLoading={true}
        totalProjectedRevenue={0}
        averageMonthlyRevenue={0}
        confidenceLevel="low"
      />
    );
    
    expect(screen.getByText(/sales forecast overview/i)).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  test('renders projection data correctly', () => {
    const totalRevenue = 37000;
    const averageRevenue = 12333;
    
    render(
      <ProjectionResults
        projections={mockProjections}
        isLoading={false}
        totalProjectedRevenue={totalRevenue}
        averageMonthlyRevenue={averageRevenue}
        confidenceLevel="medium"
      />
    );
    
    expect(screen.getByText(/sales forecast overview/i)).toBeInTheDocument();
    expect(screen.getByText(/projected sales for the next 3 months/i)).toBeInTheDocument();
    
    // Check for total revenue
    expect(screen.getByText(/\$37,000/)).toBeInTheDocument();
    
    // Check for average revenue
    expect(screen.getByText(/\$12,333/)).toBeInTheDocument();
    
    // Check for confidence level
    expect(screen.getByText('Medium')).toBeInTheDocument();
    
    // Check for chart
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    
    // Check for projection details
    expect(screen.getByText(/projection details/i)).toBeInTheDocument();
    expect(screen.getByText(/growth rate/i)).toBeInTheDocument();
    expect(screen.getByText(/confidence level/i)).toBeInTheDocument();
  });

  test('handles empty projections gracefully', () => {
    render(
      <ProjectionResults
        projections={[]}
        isLoading={false}
        totalProjectedRevenue={0}
        averageMonthlyRevenue={0}
        confidenceLevel="low"
      />
    );
    
    expect(screen.getByText(/load projections to see forecast/i)).toBeInTheDocument();
    expect(screen.getByText('$0')).toBeInTheDocument(); // Total revenue should be $0
  });
});
