
import React from 'react';
import { Mail, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserModel } from '@/types';

interface ProfileCardProps {
  user: UserModel;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-shrink-0">
        <Avatar className="w-24 h-24">
          <AvatarImage src="" alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback className="text-xl">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
        <div className="flex items-center text-gray-500">
          <Mail className="h-4 w-4 mr-2" />
          <span>{user.email}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <Shield className="h-4 w-4 mr-2" />
          <span>{user.role}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
