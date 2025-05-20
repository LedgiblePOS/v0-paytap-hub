
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TestChecker from '@/utils/testing/TestChecker';

const QualityAssurance: React.FC = () => {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Quality Assurance</h1>
      
      <Tabs defaultValue="automated">
        <TabsList className="mb-6">
          <TabsTrigger value="automated">Automated Testing</TabsTrigger>
          <TabsTrigger value="manual">Manual Test Plan</TabsTrigger>
          <TabsTrigger value="results">Test Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="automated">
          <TestChecker />
        </TabsContent>
        
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Testing Guidelines</CardTitle>
              <CardDescription>
                Follow these guidelines to perform thorough manual testing of the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h2>User Flow Testing</h2>
                <h3>Authentication Flows</h3>
                <ul>
                  <li>
                    <strong>Login Process</strong>
                    <ul>
                      <li>Verify email and password validation</li>
                      <li>Test error messaging for incorrect credentials</li>
                      <li>Confirm successful redirection after login</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Registration Process</strong>
                    <ul>
                      <li>Verify field validations</li>
                      <li>Test duplicate email handling</li>
                      <li>Confirm successful account creation</li>
                    </ul>
                  </li>
                </ul>
                
                <h3>Role-Based Access Control</h3>
                <ul>
                  <li>
                    <strong>Super Admin Access</strong>
                    <ul>
                      <li>Verify access to all admin routes</li>
                      <li>Test merchant view access through switcher</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Merchant Access</strong>
                    <ul>
                      <li>Verify restricted access to merchant-only routes</li>
                      <li>Confirm inability to access admin areas</li>
                    </ul>
                  </li>
                </ul>
                
                <h2>Page Rendering and Navigation</h2>
                <ul>
                  <li>Verify all sidebar navigation links work correctly</li>
                  <li>Test admin/merchant switcher functionality</li>
                  <li>Confirm components render without visual glitches</li>
                  <li>Test all pages on desktop, tablet, and mobile viewports</li>
                </ul>
                
                <h2>Data Operations</h2>
                <ul>
                  <li>Verify all forms submit data correctly</li>
                  <li>Test validation rules for all input fields</li>
                  <li>Confirm data loading, filtering, and pagination</li>
                  <li>Test editing and deleting functionality</li>
                </ul>
                
                <h2>User Management Specific Tests</h2>
                <ul>
                  <li>Test adding users with different roles</li>
                  <li>Verify updating user details and roles</li>
                  <li>Test deactivating users and password resets</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                View and export test execution results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                No test results available yet. Run automated tests to generate results.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QualityAssurance;
