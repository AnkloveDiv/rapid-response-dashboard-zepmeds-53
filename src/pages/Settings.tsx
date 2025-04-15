
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Volume2, 
  VolumeX,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  organizationName: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
});

const notificationSchema = z.object({
  emergencyAlerts: z.boolean().default(true),
  dispatchNotifications: z.boolean().default(true),
  statusUpdates: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  soundAlerts: z.boolean().default(true),
});

const appSettingsSchema = z.object({
  mapProvider: z.string().default("mapbox"),
  theme: z.string().default("light"),
  language: z.string().default("en"),
  autoRefresh: z.boolean().default(true),
  refreshInterval: z.number().min(5).max(60).default(30),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type NotificationValues = z.infer<typeof notificationSchema>;
type AppSettingsValues = z.infer<typeof appSettingsSchema>;

const Settings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "John Dispatcher",
      email: "john@zepmeds.com",
      phone: "+91 9876543210",
      organizationName: "Zepmeds Emergency Services",
    },
  });

  const notificationForm = useForm<NotificationValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emergencyAlerts: true,
      dispatchNotifications: true,
      statusUpdates: true,
      emailNotifications: true,
      soundAlerts: true,
    },
  });

  const appSettingsForm = useForm<AppSettingsValues>({
    resolver: zodResolver(appSettingsSchema),
    defaultValues: {
      mapProvider: "mapbox",
      theme: "light",
      language: "en",
      autoRefresh: true,
      refreshInterval: 30,
    },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Profile data:", data);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      setIsSaving(false);
    }, 1000);
  };

  const onNotificationSubmit = (data: NotificationValues) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Notification settings:", data);
      toast({
        title: "Notification Settings Updated",
        description: "Your notification preferences have been saved.",
      });
      setIsSaving(false);
    }, 1000);
  };

  const onAppSettingsSubmit = (data: AppSettingsValues) => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("App settings:", data);
      toast({
        title: "App Settings Updated",
        description: "Your application settings have been updated.",
      });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="app">App Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  Profile Settings
                </CardTitle>
                <CardDescription>
                  Manage your personal information and organization details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Organization Details</h3>
                      <FormField
                        control={profileForm.control}
                        name="organizationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Organization Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The name of your hospital or ambulance service
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-purple-500 hover:bg-purple-600"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-gray-500" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how you receive alerts and notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationForm}>
                  <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={notificationForm.control}
                        name="emergencyAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Emergency Alerts</FormLabel>
                              <FormDescription>
                                Receive immediate notifications for new emergency requests
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="dispatchNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Dispatch Notifications</FormLabel>
                              <FormDescription>
                                Receive alerts when ambulances are dispatched
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="statusUpdates"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Status Updates</FormLabel>
                              <FormDescription>
                                Receive notifications when emergency statuses change
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Email Notifications</FormLabel>
                              <FormDescription>
                                Receive daily and weekly reports via email
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={notificationForm.control}
                        name="soundAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Sound Alerts</FormLabel>
                              <FormDescription>
                                Play sound when new emergency requests come in
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-purple-500 hover:bg-purple-600"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="app">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-gray-500" />
                  Application Settings
                </CardTitle>
                <CardDescription>
                  Configure application preferences and behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...appSettingsForm}>
                  <form onSubmit={appSettingsForm.handleSubmit(onAppSettingsSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={appSettingsForm.control}
                        name="mapProvider"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Map Provider</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                {...field}
                              >
                                <option value="mapbox">Mapbox</option>
                                <option value="google">Google Maps</option>
                                <option value="osm">OpenStreetMap</option>
                              </select>
                            </FormControl>
                            <FormDescription>
                              Select your preferred mapping service
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={appSettingsForm.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Theme</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                {...field}
                              >
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System Default</option>
                              </select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={appSettingsForm.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                {...field}
                              >
                                <option value="en">English</option>
                                <option value="hi">Hindi</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                              </select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={appSettingsForm.control}
                        name="autoRefresh"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Auto-Refresh Data</FormLabel>
                              <FormDescription>
                                Automatically refresh dashboard and emergency data
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      {appSettingsForm.watch("autoRefresh") && (
                        <FormField
                          control={appSettingsForm.control}
                          name="refreshInterval"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Refresh Interval (seconds)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  {...field} 
                                  onChange={e => field.onChange(parseInt(e.target.value))}
                                  min="5"
                                  max="60"
                                />
                              </FormControl>
                              <FormDescription>
                                How often to refresh data (5-60 seconds)
                              </FormDescription>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-purple-500 hover:bg-purple-600"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Settings"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;
