import * as Notifications from 'expo-notifications';
import { PrayerType, UserProfile } from '../types';

export async function scheduleNotifications(profile: UserProfile) {
  // Cancel all existing notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  const { notificationPreferences } = profile;

  for (const prayer of Object.keys(notificationPreferences) as PrayerType[]) {
    const pref = notificationPreferences[prayer];

    if (pref.enabled && pref.time) {
      const [hours, minutes] = pref.time.split(':').map(Number);

      // Calculate notification time
      // We want to notify 'minutesBefore' the prayer time
      const notificationTime = new Date();
      notificationTime.setHours(hours, minutes, 0, 0);
      notificationTime.setMinutes(notificationTime.getMinutes() - pref.minutesBefore);

      const triggerHour = notificationTime.getHours();
      const triggerMinute = notificationTime.getMinutes();

      try {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${prayer} Reminder`,
            body: `It's time to get ready for ${prayer}!`,
          },
          trigger: {
            hour: triggerHour,
            minute: triggerMinute,
            repeats: true,
          },
        });
      } catch (err) {
        console.warn(`Failed to schedule notification for ${prayer}:`, err);
      }
    }
  }
}
