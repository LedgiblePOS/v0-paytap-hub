
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Mail } from 'lucide-react';
import ProfileCard from './ProfileCard';
import { UserModel } from '@/types';

interface ProfileSectionProps {
  user: UserModel;
  onChangePasswordClick: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, onChangePasswordClick }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Manage your personal information and account settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProfileCard user={user} />
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={onChangePasswordClick}
          >
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Update Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
