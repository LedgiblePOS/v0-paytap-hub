
import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricCard from '../MetricCard';
import { ArrowUp } from 'lucide-react';
import { Trend } from '@/types/enums';

describe('MetricCard', () => {
  it('renders the title and value', () => {
    render(
      <MetricCard 
        title="Test Card" 
        value={100} 
        trend={Trend.NEUTRAL}  // Add required trend property
      />
    );

    expect(screen.getByText('Test Card')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('renders the icon when provided', () => {
    render(
      <MetricCard 
        title="With Icon" 
        value={100} 
        icon={<ArrowUp data-testid="icon" />}
        trend={Trend.NEUTRAL}  // Add required trend property
      />
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders with up trend', () => {
    render(
      <MetricCard 
        title="Trending Up" 
        value={100} 
        trend={Trend.UP}
        trendValue={5}
      />
    );

    const trendElement = screen.getByText('↑');
    expect(trendElement).toBeInTheDocument();
    expect(trendElement.parentElement).toHaveClass('text-green-500');
  });

  it('shows loading state', () => {
    render(
      <MetricCard 
        title="Loading" 
        value={100} 
        loading={true}
        trend={Trend.NEUTRAL}  // Add required trend property
      />
    );

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <MetricCard 
        title="With Description" 
        value={100} 
        description="This is a description"
        trend={Trend.NEUTRAL}  // Add required trend property
      />
    );

    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });
});
