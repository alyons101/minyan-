import AsyncStorage from '@react-native-async-storage/async-storage';
import { MinyanLog, Shul, UserProfile } from '../types';

const PROFILE_KEY = 'minyan/profile';
const SHULS_KEY = 'minyan/shuls';
const LOGS_KEY = 'minyan/logs';

export const storage = {
  async loadProfile(): Promise<UserProfile | null> {
    const raw = await AsyncStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  },
  async saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },
  async loadShuls(): Promise<Shul[]> {
    const raw = await AsyncStorage.getItem(SHULS_KEY);
    return raw ? (JSON.parse(raw) as Shul[]) : [];
  },
  async saveShuls(shuls: Shul[]): Promise<void> {
    await AsyncStorage.setItem(SHULS_KEY, JSON.stringify(shuls));
  },
  async loadLogs(): Promise<MinyanLog[]> {
    const raw = await AsyncStorage.getItem(LOGS_KEY);
    return raw ? (JSON.parse(raw) as MinyanLog[]) : [];
  },
  async saveLogs(logs: MinyanLog[]): Promise<void> {
    await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }
};
