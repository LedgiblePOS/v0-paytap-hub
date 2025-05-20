import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AuditSeverity, AuditAction } from '@/types/enums'; // Import from enums.ts instead of settings.ts

const AuditLogs: React.FC = () => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Badge variant="secondary">
                        <AuditAction/>
                      </Badge>
                    </TableCell>
                    <TableCell>User logged in</TableCell>
                    <TableCell>2023-03-02 19:34:22</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        <AuditSeverity/>
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Badge variant="secondary">
                        <AuditAction/>
                      </Badge>
                    </TableCell>
                    <TableCell>New sale created</TableCell>
                    <TableCell>2023-03-02 19:34:22</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        <AuditSeverity/>
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="security" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Badge variant="secondary">
                        <AuditAction/>
                      </Badge>
                    </TableCell>
                    <TableCell>User logged in</TableCell>
                    <TableCell>2023-03-02 19:34:22</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        <AuditSeverity/>
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="system" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Badge variant="secondary">
                        <AuditAction/>
                      </Badge>
                    </TableCell>
                    <TableCell>New sale created</TableCell>
                    <TableCell>2023-03-02 19:34:22</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        <AuditSeverity/>
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;
