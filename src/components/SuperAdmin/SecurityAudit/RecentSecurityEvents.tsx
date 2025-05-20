
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Shield, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

interface SecurityEvent {
  id: string;
  action: string;
  resource: string;
  description: string;
  user_id: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  userEmail?: string;
}

const RecentSecurityEvents: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        
        // Get recent security events from audit_logs
        const { data: logsData, error: logsError } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (logsError) throw logsError;
        
        if (logsData && logsData.length > 0) {
          // Get user emails for the user IDs in the logs
          const userIds = logsData
            .filter(log => log.user_id)
            .map(log => log.user_id);
          
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', userIds);
          
          if (userError) console.error('Error fetching user data:', userError);
          
          // Map user data to events
          const eventsWithUserData = logsData.map(log => {
            const user = userData?.find(u => u.id === log.user_id);
            return {
              ...log,
              userEmail: user ? `${user.first_name} ${user.last_name}` : 'Unknown'
            };
          });
          
          setEvents(eventsWithUserData);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching security events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  const getEventSeverity = (action: string): 'low' | 'medium' | 'high' => {
    const highSeverityActions = ['DELETE', 'SECURITY_VIOLATION', 'AUTH_FAILED'];
    const mediumSeverityActions = ['UPDATE', 'IP_BLOCKED', 'ACCESS_DENIED'];
    
    if (highSeverityActions.some(a => action.includes(a))) {
      return 'high';
    } else if (mediumSeverityActions.some(a => action.includes(a))) {
      return 'medium';
    }
    return 'low';
  };
  
  const getSeverityIcon = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'medium':
        return <Shield className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Security Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent security events found
            </div>
          ) : (
            events.map(event => {
              const severity = getEventSeverity(event.action);
              
              return (
                <div key={event.id} className="flex p-3 border rounded-md">
                  <div className="mr-4 mt-1">{getSeverityIcon(severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold flex items-center">
                        {event.resource}
                        <span className="ml-2">
                          {getSeverityBadge(severity)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(event.created_at), 'MMM d, yyyy HH:mm')}
                      </div>
                    </div>
                    <div className="text-sm mt-1">{event.description}</div>
                    <div className="flex mt-2 text-xs text-muted-foreground">
                      <div className="mr-3">User: {event.userEmail || event.user_id?.substring(0, 8) || 'System'}</div>
                      {event.ip_address && (
                        <div className="mr-3">IP: {event.ip_address}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSecurityEvents;
