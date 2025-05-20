
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Expenses = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Expenses</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Expenses List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Expenses will be loaded from Supabase</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Expenses;
