
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Income = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Income</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Income List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Income data will be loaded from Supabase</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Income;
