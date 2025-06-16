
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Bell, Clock, Settings as SettingsIcon } from 'lucide-react';

interface NotificationSettings {
  id?: string;
  user_id: string;
  notifications_enabled: boolean;
  daily_time: string;
  weekly_enabled: boolean;
  monthly_enabled: boolean;
  quarterly_enabled: boolean;
  annual_enabled: boolean;
}

export const Settings = () => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const queryClient = useQueryClient();

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const { data: settings } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.data.user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<NotificationSettings>) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('Not authenticated');

      if (settings?.id) {
        const { data, error } = await supabase
          .from('notification_settings')
          .update(newSettings)
          .eq('id', settings.id)
          .select();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('notification_settings')
          .insert([{ ...newSettings, user_id: user.data.user.id }])
          .select();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast({ title: "Settings updated", description: "Your notification preferences have been saved." });
    },
  });

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Register service worker
        if ('serviceWorker' in navigator) {
          try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service worker registered:', registration);
          } catch (error) {
            console.error('Service worker registration failed:', error);
          }
        }
      }
    }
  };

  const testNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('Test Notification', {
        body: 'Time for your daily review!',
        icon: '/favicon.ico',
      });
    }
  };

  const currentSettings = settings || {
    notifications_enabled: false,
    daily_time: '09:00',
    weekly_enabled: true,
    monthly_enabled: true,
    quarterly_enabled: true,
    annual_enabled: true,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your notification preferences</p>
        </div>
      </div>

      {/* Notification Permission */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Permission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Browser Notifications</p>
              <p className="text-sm text-muted-foreground">
                Status: {notificationPermission === 'granted' ? 'Enabled' : 
                        notificationPermission === 'denied' ? 'Blocked' : 'Not requested'}
              </p>
            </div>
            {notificationPermission !== 'granted' && (
              <Button onClick={requestNotificationPermission}>
                Enable Notifications
              </Button>
            )}
            {notificationPermission === 'granted' && (
              <Button variant="outline" onClick={testNotification}>
                Test Notification
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Review Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Review Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive reminders for your regular reviews
              </p>
            </div>
            <Switch
              checked={currentSettings.notifications_enabled}
              onCheckedChange={(checked) => 
                updateSettings.mutate({ notifications_enabled: checked })
              }
              disabled={notificationPermission !== 'granted'}
            />
          </div>

          {currentSettings.notifications_enabled && (
            <>
              {/* Daily Review Time */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Review Time</label>
                <Select
                  value={currentSettings.daily_time}
                  onValueChange={(value) => updateSettings.mutate({ daily_time: value })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                          {i === 0 ? '12:00 AM' : 
                           i < 12 ? `${i}:00 AM` : 
                           i === 12 ? '12:00 PM' : 
                           `${i - 12}:00 PM`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Review Type Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Reviews</p>
                    <p className="text-sm text-muted-foreground">Every Sunday</p>
                  </div>
                  <Switch
                    checked={currentSettings.weekly_enabled}
                    onCheckedChange={(checked) => 
                      updateSettings.mutate({ weekly_enabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Monthly Reviews</p>
                    <p className="text-sm text-muted-foreground">Last day of each month</p>
                  </div>
                  <Switch
                    checked={currentSettings.monthly_enabled}
                    onCheckedChange={(checked) => 
                      updateSettings.mutate({ monthly_enabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Quarterly Reviews</p>
                    <p className="text-sm text-muted-foreground">End of each quarter</p>
                  </div>
                  <Switch
                    checked={currentSettings.quarterly_enabled}
                    onCheckedChange={(checked) => 
                      updateSettings.mutate({ quarterly_enabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Annual Reviews</p>
                    <p className="text-sm text-muted-foreground">End of each year</p>
                  </div>
                  <Switch
                    checked={currentSettings.annual_enabled}
                    onCheckedChange={(checked) => 
                      updateSettings.mutate({ annual_enabled: checked })
                    }
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
