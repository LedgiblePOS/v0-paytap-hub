
export interface Report {
  id: string;
  merchantId: string;
  reportType: string;
  title: string;
  description?: string;
  parameters: Record<string, any>;
  data: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  generatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportSchedule {
  id: string;
  merchantId: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  parameters: Record<string, any>;
  isActive: boolean;
  lastRunAt: string | null;
  nextRunAt: string | null;
  createdAt: string;
  updatedAt: string;
}
