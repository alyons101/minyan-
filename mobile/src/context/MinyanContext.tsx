import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { presetShuls } from '../data/shuls';
import { MinyanLog, PrayerType, Shul, UserProfile } from '../types';
import { storage } from '../services/storage';
import { calculateLevel, computeStats, createLog } from '../services/minyanService';

interface MinyanContextValue {
  profile: UserProfile;
  shuls: Shul[];
  logs: MinyanLog[];
  stats: ReturnType<typeof computeStats>;
  level: number;
  setProfile: (profile: UserProfile) => Promise<void>;
  addShul: (shul: Shul) => Promise<void>;
  updateShul: (shul: Shul) => Promise<void>;
  removeShul: (id: string) => Promise<void>;
  logMinyan: (params: {
    prayerType: PrayerType;
    shulId: string;
    shulName: string;
    requirePhoto: boolean;
    note?: string;
    travelArea?: string;
  }) => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: '',
  primaryArea: 'Hendon',
  notificationPreferences: {
    Shacharit: { enabled: false, minutesBefore: 20, time: '07:00' },
    Mincha: { enabled: false, minutesBefore: 15, time: '13:30' },
    Maariv: { enabled: false, minutesBefore: 15, time: '19:00' }
  },
  proofOfAttendance: false,
  photoCheckIn: false,
  locationEnabled: true,
  travelMode: false,
  pauseStreak: false
};

const MinyanContext = createContext<MinyanContextValue | undefined>(undefined);

export const MinyanProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
  const [shuls, setShuls] = useState<Shul[]>(presetShuls);
  const [logs, setLogs] = useState<MinyanLog[]>([]);

  useEffect(() => {
    (async () => {
      const loadedProfile = await storage.loadProfile();
      const loadedShuls = await storage.loadShuls();
      const loadedLogs = await storage.loadLogs();
      if (loadedProfile) setProfileState(loadedProfile);
      if (loadedShuls.length) setShuls(loadedShuls);
      if (loadedLogs.length) setLogs(loadedLogs);
    })();
  }, []);

  const stats = useMemo(() => computeStats(logs), [logs]);
  const level = useMemo(() => calculateLevel(logs.length), [logs.length]);

  const setProfile = async (next: UserProfile) => {
    setProfileState(next);
    await storage.saveProfile(next);
  };

  const addShul = async (shul: Shul) => {
    const next = [...shuls, shul];
    setShuls(next);
    await storage.saveShuls(next);
  };

  const updateShul = async (shul: Shul) => {
    const next = shuls.map((item) => (item.id === shul.id ? shul : item));
    setShuls(next);
    await storage.saveShuls(next);
  };

  const removeShul = async (id: string) => {
    const next = shuls.filter((s) => s.id !== id);
    setShuls(next);
    await storage.saveShuls(next);
  };

  const logMinyan = async ({
    prayerType,
    shulId,
    shulName,
    requirePhoto,
    note,
    travelArea
  }: {
    prayerType: PrayerType;
    shulId: string;
    shulName: string;
    requirePhoto: boolean;
    note?: string;
    travelArea?: string;
  }) => {
    let photoUri: string | undefined;
    if (requirePhoto) {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        throw new Error('Camera permission denied');
      }
      const captured = await ImagePicker.launchCameraAsync({ quality: 0.6 });
      if (!captured.canceled && captured.assets?.length) {
        photoUri = captured.assets[0].uri;
      } else {
        throw new Error('Photo is required for proof-of-attendance mode');
      }
    }

    let location;
    if (profile.locationEnabled) {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.granted) {
        const coords = await Location.getCurrentPositionAsync({});
        location = {
          latitude: coords.coords.latitude,
          longitude: coords.coords.longitude
        };
      }
    }

    const now = new Date();
    const log = createLog({
      prayerType,
      shulId,
      shulName,
      photoUri,
      location,
      note,
      travelArea,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString()
    });

    const nextLogs = [log, ...logs];
    setLogs(nextLogs);
    await storage.saveLogs(nextLogs);
  };

  const value: MinyanContextValue = {
    profile,
    shuls,
    logs,
    stats,
    level,
    setProfile,
    addShul,
    updateShul,
    removeShul,
    logMinyan
  };

  return <MinyanContext.Provider value={value}>{children}</MinyanContext.Provider>;
};

export const useMinyan = () => {
  const ctx = useContext(MinyanContext);
  if (!ctx) throw new Error('useMinyan must be used within provider');
  return ctx;
};
