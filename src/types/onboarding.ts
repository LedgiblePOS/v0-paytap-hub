
export interface Step {
  id: string;
  name: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface SubscriptionSelectProps {
  value?: string;
  onSelect?: (subscription: string) => void;
}
