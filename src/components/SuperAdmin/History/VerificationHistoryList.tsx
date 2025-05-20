
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
import { CheckCircle2, XCircle } from 'lucide-react';

interface VerificationHistory {
  id: string;
  merchant_id: string;
  previous_status: boolean | null;
  new_status: boolean;
  changed_at: string;
  notes?: string;
}

interface Props {
  history: VerificationHistory[];
  isLoading?: boolean;
}

const VerificationHistoryList: React.FC<Props> = ({ history, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Verification History</CardTitle>
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
        <CardTitle>Verification History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Previous Status</TableHead>
              <TableHead>New Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {format(new Date(item.changed_at), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  {item.previous_status === null ? (
                    'Initial Status'
                  ) : (
                    <Badge variant="outline">
                      {item.previous_status ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      {item.previous_status ? 'Verified' : 'Unverified'}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={item.new_status ? "success" : "destructive"}>
                    {item.new_status ? (
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    {item.new_status ? 'Verified' : 'Unverified'}
                  </Badge>
                </TableCell>
                <TableCell>{item.notes || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default VerificationHistoryList;
