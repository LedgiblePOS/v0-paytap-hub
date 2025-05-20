
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const auth = useAuth();
  const navigate = useNavigate();

  // Make sure we're checking auth properties that exist
  if (auth.loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Your Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          {auth.user ? (
            <div>
              <p>Hello, {auth.user.firstName}!</p>
              <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
            </div>
          ) : (
            <div>
              <p>Please log in to access your dashboard.</p>
              <Button onClick={() => navigate('/login')}>Login</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
