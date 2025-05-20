
import React from 'react';
import MainLayoutContent from '@/components/Layout/MainLayoutContent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ThemeSettings = () => {
  const { toast } = useToast();
  
  const handleSaveTheme = () => {
    toast({
      title: "Theme settings saved",
      description: "Your theme settings have been updated successfully.",
    });
  };

  return (
    <MainLayoutContent>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Theme Settings</h2>
        <p className="text-muted-foreground">
          Customize the appearance of your merchant dashboard.
        </p>
        
        <Tabs defaultValue="colors" className="w-full">
          <TabsList>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="fonts">Fonts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-center p-4 border rounded-md bg-white text-black">
                    Light Mode
                  </div>
                  <div className="flex items-center justify-center p-4 border rounded-md bg-gray-900 text-white">
                    Dark Mode
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleSaveTheme}>Save Theme Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Layout Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Layout customization options will be available here.</p>
                <Button onClick={handleSaveTheme}>Save Layout Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="fonts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Font Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Font customization options will be available here.</p>
                <Button onClick={handleSaveTheme}>Save Font Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayoutContent>
  );
};

export default ThemeSettings;
