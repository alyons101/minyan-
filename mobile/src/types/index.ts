export type PrayerType = 'Shacharit' | 'Mincha' | 'Maariv';

export interface Shul {
  id: string;
  name: string;
  area: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface MinyanLog {
  id: string;
  date: string;
  time: string;
  prayerType: PrayerType;
  shulId: string;
  shulName: string;
  location?: { latitude: number; longitude: number };
  photoUri?: string;
  note?: string;
  travelArea?: string;
}

export interface UserProfile {
  name?: string;
  primaryArea?: string;
  defaultShulId?: string;
  proofOfAttendance?: boolean;
  photoCheckIn?: boolean;
  locationEnabled?: boolean;
  travelMode?: boolean;
  pauseStreak?: boolean;
  notificationPreferences: Record<PrayerType, NotificationPreference>;
}

export interface NotificationPreference {
  enabled: boolean;
  minutesBefore: number;
  time?: string; // HH:mm format
}

export interface Badge {
  id: string;
  title: string;
  description: string;
}

export interface Stats {
  totalMinyanim: number;
  streak: number;
  bestStreak: number;
  perPrayer: Record<PrayerType, number>;
  badges: Badge[];
}
