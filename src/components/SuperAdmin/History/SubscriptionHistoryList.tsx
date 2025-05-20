
import React from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubscriptionHistory {
  id: string;
  merchant_id: string;
  previous_tier: string | null;
  new_tier: string;
  changed_at: string;
  reason?: string;
}

interface Props {
  history: SubscriptionHistory[];
  isLoading?: boolean;
}

const SubscriptionHistoryList: React.FC<Props> = ({ history, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Previous Tier</TableHead>
              <TableHead>New Tier</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {format(new Date(item.changed_at), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {item.previous_tier ? (
                    <Badge variant="outline">{item.previous_tier}</Badge>
                  ) : (
                    'Initial Subscription'
                  )}
                </TableCell>
                <TableCell>
                  <Badge>{item.new_tier}</Badge>
                </TableCell>
                <TableCell>{item.reason || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SubscriptionHistoryList;
