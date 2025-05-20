
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SecurityCardProps {
  onChangePasswordClick: () => void;
}

const SecurityCard: React.FC<SecurityCardProps> = ({ onChangePasswordClick }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Manage your account security and access settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <h3 className="font-semibold">Two-Factor Authentication</h3>
              <p className="text-gray-500 text-sm">Add an extra layer of security to your account</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <h3 className="font-semibold">Password</h3>
              <p className="text-gray-500 text-sm">Last changed: Never</p>
            </div>
            <Button 
              variant="outline"
              onClick={onChangePasswordClick}
            >
              Change
            </Button>
          </div>
          
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <h3 className="font-semibold">Login Sessions</h3>
              <p className="text-gray-500 text-sm">Manage your active sessions</p>
            </div>
            <Button variant="outline">View</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityCard;
