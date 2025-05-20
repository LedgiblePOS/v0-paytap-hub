import React from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserModel } from '@/types/user';

const AccountIndexPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          You need to be logged in to view your account information.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your personal information and contact details.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="font-medium">Name</p>
                <p className="text-sm text-muted-foreground">{user.firstName} {user.lastName}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div>
                <p className="font-medium">Role</p>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
              {user.merchantId && (
                <Alert>
                  <AlertDescription>
                    You're connected to a merchant account.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Additional cards can be added here */}
      </div>
    </div>
  );
};

export default AccountIndexPage;
