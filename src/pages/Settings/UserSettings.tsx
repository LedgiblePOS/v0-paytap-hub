
import React from 'react';
import MainLayoutContent from '@/components/Layout/MainLayoutContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const UserSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "User Settings Saved",
      description: "Your user settings have been updated successfully.",
    });
  };

  return (
    <MainLayoutContent>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">User Settings</h2>
        <p className="text-muted-foreground">
          Manage your user profile and account preferences.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="flex items-center gap-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name || 'User'} />
                  <AvatarFallback>{user?.name?.substring(0, 2) || 'U'}</AvatarFallback>
                </Avatar>
                <Button variant="outline" type="button">
                  Change Avatar
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue={user?.name || ''} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={user?.email || ''} disabled />
                  <p className="text-sm text-muted-foreground">Your email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={user?.phone || ''} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="UTC" />
                </div>
              </div>
              
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" type="button">
                Change Password
              </Button>
              
              <Button variant="outline" type="button">
                Enable Two-Factor Authentication
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayoutContent>
  );
};

export default UserSettings;
