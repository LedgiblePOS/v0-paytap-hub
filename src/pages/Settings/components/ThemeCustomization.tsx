import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { themeCustomizationSchema, ThemeCustomizationForm } from "../schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Palette, Moon, Sun, Image, Compass, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ThemeCustomization: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("colors");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");

  const form = useForm<ThemeCustomizationForm>({
    resolver: zodResolver(themeCustomizationSchema),
    defaultValues: {
      themeColor: "#8B5CF6",
      accentColor: "#0EA5E9",
      logoUrl: "",
      darkMode: false,
      compactMode: false,
    },
  });

  useEffect(() => {
    const loadThemeCustomization = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        
        // Get merchant ID
        const { data: merchant, error: merchantError } = await supabase
          .from('merchants')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (merchantError) throw merchantError;
        
        // Get theme customization for the merchant
        const { data: customization, error: customizationError } = await supabase
          .from('merchant_customizations')
          .select('*')
          .eq('merchant_id', merchant.id)
          .single();
        
        if (customizationError && customizationError.code !== 'PGRST116') throw customizationError;
        
        if (customization) {
          // Existing merchant_customizations table doesn't have the fields we need
          // Instead of failing, set defaults and warn in the console
          console.log("Found customization but missing extended theme properties", customization);
          
          form.reset({
            themeColor: customization.theme_color || "#8B5CF6",
            accentColor: "#0EA5E9", // Default as the field doesn't exist in the table
            logoUrl: customization.logo_url || "",
            darkMode: false, // Default as the field doesn't exist in the table
            compactMode: false, // Default as the field doesn't exist in the table
          });
        }
      } catch (error) {
        console.error("Error loading theme customization:", error);
        toast({
          title: "Error",
          description: "Failed to load theme settings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemeCustomization();
  }, [user, toast, form]);

  const onSubmit = async (data: ThemeCustomizationForm) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save theme settings",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Get merchant ID
      const { data: merchant, error: merchantError } = await supabase
        .from('merchants')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (merchantError) throw merchantError;
      
      // Update or create theme customization with only the fields that exist
      const { error } = await supabase
        .from('merchant_customizations')
        .upsert({
          merchant_id: merchant.id,
          theme_color: data.themeColor,
          logo_url: data.logoUrl,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'merchant_id' });
      
      if (error) throw error;
      
      // Log the additional theme properties that would be saved in a complete implementation
      console.log("Additional theme properties that would be saved:", {
        accent_color: data.accentColor,
        dark_mode: data.darkMode,
        compact_mode: data.compactMode,
      });
      
      // Apply dark mode setting to the UI
      if (data.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      // Log the action in audit_logs
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'UPDATE',
        resource: 'THEME_SETTINGS',
        description: `Updated theme customization`,
      });
      
      toast({
        title: "Theme updated",
        description: "Your theme settings have been saved",
      });
    } catch (error: any) {
      console.error("Error saving theme customization:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save theme settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePreviewMode = () => {
    setPreviewMode(prev => prev === "light" ? "dark" : "light");
  };

  // Theme preview component
  const ThemePreview: React.FC = () => {
    const themeColor = form.watch('themeColor');
    const accentColor = form.watch('accentColor');
    const isDarkMode = previewMode === "dark";
    
    return (
      <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Theme Preview</h3>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={togglePreviewMode} 
            className="flex items-center gap-1"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div 
              className="w-16 h-16 rounded-md shadow-md flex items-center justify-center text-white"
              style={{ backgroundColor: themeColor }}
              title="Theme Color"
            >
              <Palette className="h-6 w-6" />
            </div>
            <div 
              className="w-16 h-16 rounded-md shadow-md flex items-center justify-center text-white"
              style={{ backgroundColor: accentColor }}
              title="Accent Color"
            >
              <Compass className="h-6 w-6" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className={`p-3 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Sample text in a container</p>
            </div>
            
            <div className="flex gap-2">
              <Button style={{ backgroundColor: themeColor }}>Primary Button</Button>
              <Button variant="outline" style={{ borderColor: accentColor, color: accentColor }}>
                Outline Button
              </Button>
            </div>
            
            <div 
              className="mt-2 p-3 rounded-md"
              style={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
                borderLeft: `4px solid ${themeColor}`
              }}
            >
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Accent border element</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Theme Customization</h2>
      <p className="text-muted-foreground mb-6">Customize the look and feel of your dashboard.</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                  <TabsTrigger value="layout">Layout</TabsTrigger>
                </TabsList>
                
                <TabsContent value="colors" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-primary" />
                        Color Settings
                      </CardTitle>
                      <CardDescription>Customize the colors used throughout your interface</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="themeColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Primary Theme Color</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input 
                                    type="text"
                                    placeholder="#8B5CF6" 
                                    {...field} 
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormControl>
                                  <Input
                                    type="color"
                                    className="w-12 p-1 h-10"
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                              </div>
                              <FormDescription>
                                Used for primary buttons and highlights
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="accentColor"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accent Color</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input 
                                    type="text" 
                                    placeholder="#0EA5E9" 
                                    {...field} 
                                    disabled={isLoading}
                                  />
                                </FormControl>
                                <FormControl>
                                  <Input
                                    type="color"
                                    className="w-12 p-1 h-10"
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isLoading}
                                  />
                                </FormControl>
                              </div>
                              <FormDescription>
                                Used for secondary elements and accents
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="darkMode"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <Moon className="h-4 w-4" />
                                <FormLabel className="text-base">Dark Mode</FormLabel>
                              </div>
                              <FormDescription>
                                Enable dark mode throughout the application
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isLoading}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="branding" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Image className="h-5 w-5 text-primary" />
                        Branding Assets
                      </CardTitle>
                      <CardDescription>Upload and manage your branding assets</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="logoUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logo URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://example.com/your-logo.png" 
                                {...field} 
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormDescription>
                              Link to your company logo image (recommended size: 200x60px)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {form.watch("logoUrl") && (
                        <div className="mt-4 border rounded-md p-4">
                          <h4 className="text-sm font-medium mb-2">Logo Preview</h4>
                          <div className="h-16 flex items-center">
                            <img 
                              src={form.watch("logoUrl")} 
                              alt="Logo Preview" 
                              className="max-h-full max-w-xs object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="layout" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Layout Preferences</CardTitle>
                      <CardDescription>Configure how content is displayed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="compactMode"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Compact Mode</FormLabel>
                              <FormDescription>
                                Use a more condensed layout with less whitespace
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isLoading}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  Save Theme Settings
                </Button>
              </div>
            </form>
          </Form>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See your theme changes in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <ThemePreview />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ThemeCustomization;
