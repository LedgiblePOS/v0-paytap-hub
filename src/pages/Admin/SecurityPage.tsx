
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Lock, FileCheck, Bell, Settings, Users, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import SecurityLog from '@/components/SuperAdmin/Security/SecurityLog';
import { supabase } from '@/integrations/supabase/client';

// Mock data for security audit logs
const mockAuditLogs = [
  {
    id: '1',
    action: 'LOGIN_ATTEMPT_FAILED',
    resource: 'authentication',
    description: 'Failed login attempt for user@example.com',
    user_id: '',
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    action: 'PERMISSION_CHANGE',
    resource: 'user_management',
    description: 'User role changed from USER to ADMIN',
    user_id: 'admin-user-id',
    ip_address: '192.168.1.2',
    user_agent: 'Mozilla/5.0',
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  }
];

const SecurityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [securityLogs, setSecurityLogs] = useState<any[]>(mockAuditLogs);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const { toast } = useToast();

  const fetchSecurityLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .in('action', ['SECURITY_LOGIN_FAILED', 'SECURITY_PERMISSION_CHANGE', 'SECURITY_VIOLATION'])
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSecurityLogs(data);
      } else {
        // If no real logs, use mock data for demonstration
        setSecurityLogs(mockAuditLogs);
      }
    } catch (error) {
      console.error('Error fetching security logs:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch security logs',
        variant: 'destructive'
      });
    } finally {
      setIsLoadingLogs(false);
    }
  };

  React.useEffect(() => {
    fetchSecurityLogs();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Security Center</h1>
          <p className="text-muted-foreground">Manage security settings and monitor security events</p>
        </div>
        <Button 
          variant="outline"
          className="flex items-center gap-2"
          asChild
        >
          <Link to="/admin/security/audit">
            <Shield className="h-4 w-4" />
            Run Security Audit
          </Link>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
          <TabsTrigger value="logs">Security Logs</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Security Status
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Badge className="bg-green-500">Secure</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last audit: {new Date().toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Failed Login Attempts (24h)
                </CardTitle>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-2">
                  -2 from yesterday
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Security Alerts
                </CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-2">
                  No active alerts
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>
                  Most recent security-related events in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-64 overflow-y-auto">
                <SecurityLog logs={securityLogs.slice(0, 5)} isLoading={isLoadingLogs} />
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={fetchSecurityLogs}>
                  Refresh
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Recommendations</CardTitle>
                <CardDescription>
                  Recommended actions to improve security
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                    <span>Enable two-factor authentication</span>
                  </li>
                  <li className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                    <span>Review user permissions regularly</span>
                  </li>
                  <li className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                    <span>Set up security alerts for suspicious activities</span>
                  </li>
                  <li className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-2 text-green-500" />
                    <span>Enable strict password requirements</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/settings">Configure Settings</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security parameters for your application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Authentication Settings
                  </h3>
                  <div className="mt-4 space-y-4 border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Password minimum length</p>
                        <p className="text-sm text-muted-foreground">Minimum required password length</p>
                      </div>
                      <Badge>8 characters</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Require special characters</p>
                        <p className="text-sm text-muted-foreground">Passwords must include special characters</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Maximum login attempts</p>
                        <p className="text-sm text-muted-foreground">Before account is temporarily locked</p>
                      </div>
                      <Badge>5 attempts</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Session Settings
                  </h3>
                  <div className="mt-4 space-y-4 border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Session timeout</p>
                        <p className="text-sm text-muted-foreground">Automatic logout after inactivity</p>
                      </div>
                      <Badge>60 minutes</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Remember me functionality</p>
                        <p className="text-sm text-muted-foreground">Allow users to stay logged in</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100">Enabled</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Bell className="h-4 w-4 mr-2" />
                    Security Notifications
                  </h3>
                  <div className="mt-4 space-y-4 border p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Email notifications</p>
                        <p className="text-sm text-muted-foreground">Send email for suspicious login attempts</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100">Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Admin alerts</p>
                        <p className="text-sm text-muted-foreground">Notify administrators of security events</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Security Logs</CardTitle>
                <CardDescription>
                  Security events and audit trail
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={fetchSecurityLogs}>
                Refresh Logs
              </Button>
            </CardHeader>
            <CardContent>
              <SecurityLog logs={securityLogs} isLoading={isLoadingLogs} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role-Based Permissions</CardTitle>
              <CardDescription>
                Manage roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    User Roles
                  </h3>
                  <div className="mt-4 space-y-4 border p-4 rounded-md">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 border rounded-md">
                        <h4 className="font-semibold">Super Admin</h4>
                        <p className="text-sm text-muted-foreground">Full access to all features</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <h4 className="font-semibold">Admin</h4>
                        <p className="text-sm text-muted-foreground">Manage users and content</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <h4 className="font-semibold">Merchant</h4>
                        <p className="text-sm text-muted-foreground">Manage own store</p>
                      </div>
                      <div className="p-3 border rounded-md">
                        <h4 className="font-semibold">User</h4>
                        <p className="text-sm text-muted-foreground">Limited access</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium flex items-center">
                    <History className="h-4 w-4 mr-2" />
                    Permission Changes
                  </h3>
                  <div className="mt-4 space-y-4 border p-4 rounded-md">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">John Doe changed to Admin</p>
                          <p className="text-xs text-muted-foreground">By: Admin User</p>
                        </div>
                        <p className="text-sm text-muted-foreground">May 7, 2023</p>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <div>
                          <p className="font-medium">Jane Smith changed to Merchant</p>
                          <p className="text-xs text-muted-foreground">By: Admin User</p>
                        </div>
                        <p className="text-sm text-muted-foreground">May 5, 2023</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Edit Roles</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityPage;
