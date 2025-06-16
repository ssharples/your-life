
import { supabase } from '@/integrations/supabase/client';

export interface NotificationSettings {
  notifications_enabled: boolean;
  daily_time: string;
  weekly_enabled: boolean;
  monthly_enabled: boolean;
  quarterly_enabled: boolean;
  annual_enabled: boolean;
}

export const scheduleNotifications = async (settings: NotificationSettings) => {
  if (!settings.notifications_enabled || !('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const now = new Date();

  // Schedule daily notification
  const scheduleDailyNotification = () => {
    const [hours, minutes] = settings.daily_time.split(':').map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    registration.active?.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      title: 'Daily Review Reminder',
      body: 'Time for your daily review!',
      scheduledTime: scheduledTime.getTime(),
    });
  };

  // Schedule weekly notification (Sundays)
  const scheduleWeeklyNotification = () => {
    if (!settings.weekly_enabled) return;
    
    const [hours, minutes] = settings.daily_time.split(':').map(Number);
    const nextSunday = new Date();
    const daysUntilSunday = (7 - nextSunday.getDay()) % 7;
    nextSunday.setDate(nextSunday.getDate() + (daysUntilSunday === 0 ? 7 : daysUntilSunday));
    nextSunday.setHours(hours, minutes, 0, 0);

    registration.active?.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      title: 'Weekly Review Reminder',
      body: 'Time for your weekly review!',
      scheduledTime: nextSunday.getTime(),
    });
  };

  // Schedule monthly notification (last day of month)
  const scheduleMonthlyNotification = () => {
    if (!settings.monthly_enabled) return;
    
    const [hours, minutes] = settings.daily_time.split(':').map(Number);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    lastDayOfMonth.setHours(hours, minutes, 0, 0);

    // If it's already past this month's last day, schedule for next month
    if (lastDayOfMonth <= now) {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      nextMonth.setHours(hours, minutes, 0, 0);
      lastDayOfMonth.setTime(nextMonth.getTime());
    }

    registration.active?.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      title: 'Monthly Review Reminder',
      body: 'Time for your monthly review!',
      scheduledTime: lastDayOfMonth.getTime(),
    });
  };

  // Schedule quarterly notification
  const scheduleQuarterlyNotification = () => {
    if (!settings.quarterly_enabled) return;
    
    const [hours, minutes] = settings.daily_time.split(':').map(Number);
    const currentQuarter = Math.floor(now.getMonth() / 3);
    const nextQuarterStart = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
    nextQuarterStart.setHours(hours, minutes, 0, 0);

    registration.active?.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      title: 'Quarterly Review Reminder',
      body: 'Time for your quarterly review!',
      scheduledTime: nextQuarterStart.getTime(),
    });
  };

  // Schedule annual notification (Dec 31st)
  const scheduleAnnualNotification = () => {
    if (!settings.annual_enabled) return;
    
    const [hours, minutes] = settings.daily_time.split(':').map(Number);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    endOfYear.setHours(hours, minutes, 0, 0);

    // If it's already past this year's end, schedule for next year
    if (endOfYear <= now) {
      endOfYear.setFullYear(endOfYear.getFullYear() + 1);
    }

    registration.active?.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      title: 'Annual Review Reminder',
      body: 'Time for your annual review!',
      scheduledTime: endOfYear.getTime(),
    });
  };

  // Schedule all notifications
  scheduleDailyNotification();
  scheduleWeeklyNotification();
  scheduleMonthlyNotification();
  scheduleQuarterlyNotification();
  scheduleAnnualNotification();
};

export const initializeNotifications = async () => {
  try {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const { data: settings } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', user.data.user.id)
      .single();

    if (settings && settings.notifications_enabled) {
      await scheduleNotifications(settings);
    }
  } catch (error) {
    console.error('Failed to initialize notifications:', error);
  }
};
