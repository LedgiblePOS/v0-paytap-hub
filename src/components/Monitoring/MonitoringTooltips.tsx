
import React from 'react';
import OnboardingTooltip from '../Onboarding/OnboardingTooltip';

export const ErrorMetricsTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <OnboardingTooltip
    content="View aggregated error statistics including frequency, types, and response times."
  >
    {children}
  </OnboardingTooltip>
);

export const PerformanceMetricsTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <OnboardingTooltip
    content="Monitor system performance including page load times and resource usage."
  >
    {children}
  </OnboardingTooltip>
);
