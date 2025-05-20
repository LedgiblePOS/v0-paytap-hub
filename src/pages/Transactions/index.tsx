
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Transactions = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Transactions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Transactions List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Transactions will be loaded from Supabase</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
