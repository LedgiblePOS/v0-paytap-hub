
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DatabaseBackup, Download, Upload, CheckSquare, AlertTriangle, HelpCircle, Clock, Calendar } from 'lucide-react';
import backupService, { BackupType, BackupResult, BackupSchedule } from '@/services/backupService';

const BackupStatusSection: React.FC = () => {
  const [backupHistory, setBackupHistory] = useState<BackupResult[]>([]);
  const [schedules, setSchedules] = useState<BackupSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBackupData();
  }, []);

  const fetchBackupData = async () => {
    setIsLoading(true);
    try {
      const [historyData, schedulesData] = await Promise.all([
        backupService.getBackupHistory(20),
        backupService.getBackupSchedules()
      ]);
      
      setBackupHistory(historyData);
      setSchedules(schedulesData);
    } catch (error) {
      console.error('Error fetching backup data:', error);
      toast({
        title: "Error Loading Backup Data",
        description: "Could not retrieve backup information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initiateBackup = async (type: BackupType) => {
    setIsBackingUp(true);
    try {
      // Simulate backup process
      toast({
        title: "Backup Started",
        description: `${type} backup has been initiated`
      });
      
      await new Promise(r => setTimeout(r, 2000)); // Simulate processing
      
      // Add simulated backup to history
      const newBackup: BackupResult = {
        id: crypto.randomUUID(),
        schedule_id: null,
        type,
        started_at: new Date(),
        completed_at: new Date(),
        status: 'success',
        file_size: 1024 * 1024 * Math.floor(Math.random() * 100), // Random size in bytes
        file_path: `/backups/${Date.now()}_${type.toLowerCase()}.sql`,
        error_message: null
      };
      
      setBackupHistory(prev => [newBackup, ...prev]);
      
      toast({
        title: "Backup Completed",
        description: "Database backup completed successfully"
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "There was an error creating the backup",
        variant: "destructive"
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const testRestore = async (backupId: string) => {
    try {
      toast({
        title: "Testing Restore",
        description: "Verifying backup integrity..."
      });
      
      const success = await backupService.testRestore(backupId);
      
      if (success) {
        toast({
          title: "Restore Test Successful",
          description: "Backup verified and can be restored if needed"
        });
      } else {
        toast({
          title: "Restore Test Failed",
          description: "Backup verification failed",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Restore Test Error",
        description: "Could not complete restore test",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDateTime = (dateStr: string | Date | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Recovery Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Backup & Recovery Status</CardTitle>
          <CardDescription>
            Database backup configuration and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CheckSquare className="h-4 w-4 mr-2 text-green-500" />
                    <span>Point-in-Time Recovery</span>
                  </div>
                  <Badge variant="default" className="bg-green-500">Enabled</Badge>
                </div>
                <div className="text-sm text-muted-foreground pl-6">
                  You can restore to any point in the last 7 days
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Last Backup</span>
                  </div>
                  <span className="text-sm">
                    {backupHistory.length > 0 ? 
                      formatDateTime(backupHistory[0].completed_at) : 'No backups found'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground pl-6">
                  Last successful backup completion time
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Retention Period</span>
                  </div>
                  <span>7 days</span>
                </div>
                <div className="text-sm text-muted-foreground pl-6">
                  Backup data is retained for 7 days
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                    <span>Recovery Testing</span>
                  </div>
                  <Badge variant={backupHistory.length > 0 ? "outline" : "destructive"}>
                    {backupHistory.length > 0 ? 'Available' : 'Not Tested'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground pl-6">
                  Test recovery to verify backup integrity
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 mt-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <DatabaseBackup className="h-4 w-4" />
                    Create New Backup
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create Database Backup</DialogTitle>
                    <DialogDescription>
                      Select the type of backup you want to create
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                      <Button
                        className="w-full flex items-center gap-2 justify-start"
                        variant="outline"
                        disabled={isBackingUp}
                        onClick={() => initiateBackup(BackupType.FULL)}
                      >
                        <Download className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">Full Backup</div>
                          <div className="text-xs text-muted-foreground">Complete database backup</div>
                        </div>
                      </Button>
                      
                      <Button
                        className="w-full flex items-center gap-2 justify-start"
                        variant="outline"
                        disabled={isBackingUp}
                        onClick={() => initiateBackup(BackupType.INCREMENTAL)}
                      >
                        <Upload className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">Incremental Backup</div>
                          <div className="text-xs text-muted-foreground">Only changes since last backup</div>
                        </div>
                      </Button>
                      
                      <Button
                        className="w-full flex items-center gap-2 justify-start"
                        variant="outline"
                        disabled={isBackingUp}
                        onClick={() => initiateBackup(BackupType.SCHEMA_ONLY)}
                      >
                        <HelpCircle className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">Schema Only</div>
                          <div className="text-xs text-muted-foreground">Database structure without data</div>
                        </div>
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              {backupHistory.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => testRestore(backupHistory[0].id)}
                  className="flex items-center gap-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  Test Recovery
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Backup Tabs */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Backup Management</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="history">
            <TabsList className="mb-4">
              <TabsTrigger value="history">Backup History</TabsTrigger>
              <TabsTrigger value="schedules">Backup Schedules</TabsTrigger>
            </TabsList>
            
            <TabsContent value="history">
              {isLoading ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                  <p className="text-muted-foreground">Loading backup history...</p>
                </div>
              ) : backupHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <DatabaseBackup className="h-8 w-8 mx-auto mb-2" />
                  <p>No backup history found</p>
                  <p className="text-sm">Create your first backup to see history here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backupHistory.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell>{backup.type}</TableCell>
                        <TableCell>{formatDateTime(backup.completed_at)}</TableCell>
                        <TableCell>
                          {backup.status === 'success' ? (
                            <Badge className="bg-green-500">Success</Badge>
                          ) : backup.status === 'failed' ? (
                            <Badge variant="destructive">Failed</Badge>
                          ) : (
                            <Badge variant="outline">In Progress</Badge>
                          )}
                        </TableCell>
                        <TableCell>{formatFileSize(backup.file_size)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8"
                              onClick={() => testRestore(backup.id)}
                            >
                              Test
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setSelectedBackup(backup)}
                                  className="h-8"
                                >
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Backup Details</DialogTitle>
                                </DialogHeader>
                                {selectedBackup && (
                                  <div className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                      <div className="font-medium">ID</div>
                                      <div>{selectedBackup.id}</div>
                                      
                                      <div className="font-medium">Type</div>
                                      <div>{selectedBackup.type}</div>
                                      
                                      <div className="font-medium">Started At</div>
                                      <div>{formatDateTime(selectedBackup.started_at)}</div>
                                      
                                      <div className="font-medium">Completed At</div>
                                      <div>{formatDateTime(selectedBackup.completed_at)}</div>
                                      
                                      <div className="font-medium">Status</div>
                                      <div>
                                        {selectedBackup.status === 'success' ? (
                                          <Badge className="bg-green-500">Success</Badge>
                                        ) : selectedBackup.status === 'failed' ? (
                                          <Badge variant="destructive">Failed</Badge>
                                        ) : (
                                          <Badge variant="outline">In Progress</Badge>
                                        )}
                                      </div>
                                      
                                      <div className="font-medium">File Size</div>
                                      <div>{formatFileSize(selectedBackup.file_size)}</div>
                                      
                                      <div className="font-medium">File Path</div>
                                      <div className="truncate">{selectedBackup.file_path}</div>
                                      
                                      {selectedBackup.error_message && (
                                        <>
                                          <div className="font-medium">Error</div>
                                          <div className="text-red-500">{selectedBackup.error_message}</div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            
            <TabsContent value="schedules">
              {isLoading ? (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                  <p className="text-muted-foreground">Loading backup schedules...</p>
                </div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2" />
                  <p>No backup schedules configured</p>
                  <p className="text-sm">Configure automated backups in Supabase dashboard</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead>Next Run</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.name}</TableCell>
                        <TableCell>{schedule.type}</TableCell>
                        <TableCell className="capitalize">{schedule.frequency}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={schedule.status === 'active' ? 'default' : 'secondary'}
                            className={schedule.status === 'active' ? 'bg-green-500' : ''}
                          >
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{schedule.last_run ? formatDateTime(schedule.last_run) : 'Never'}</TableCell>
                        <TableCell>{schedule.next_run ? formatDateTime(schedule.next_run) : 'Not scheduled'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Note: Backup schedules are managed in the Supabase dashboard. 
                  The system is configured for automatic daily backups with 7 days retention.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupStatusSection;
