
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserModel } from '@/types';

interface AccountActivityCardProps {
  user: UserModel;
}

const AccountActivityCard: React.FC<AccountActivityCardProps> = ({ user }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-500">
          <p>Account created: {new Date(user?.createdAt || "").toLocaleDateString()}</p>
          <p>Last login: {new Date().toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountActivityCard;
