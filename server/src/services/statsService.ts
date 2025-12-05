import { MinyanLog } from '@prisma/client';

export type PrayerType = 'Shacharit' | 'Mincha' | 'Maariv';

const POINTS_PER_MINYAN = 10;

export interface Stats {
  totalMinyanim: number;
  streak: number;
  bestStreak: number;
  perPrayer: Record<PrayerType, number>;
  badges: Badge[];
  level: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
}

export function computeStats(logs: MinyanLog[]): Stats {
  const perPrayer: Record<PrayerType, number> = {
    Shacharit: 0,
    Mincha: 0,
    Maariv: 0
  };
  const days = new Set<string>();

  logs.forEach((log) => {
    // Cast string to PrayerType safely
    const pt = log.prayerType as PrayerType;
    if (perPrayer[pt] !== undefined) {
        perPrayer[pt] += 1;
    }
    // Convert Date to YYYY-MM-DD string for streak calculation
    days.add(log.date.toISOString().split('T')[0]);
  });

  const streakData = buildStreak(days);

  return {
    totalMinyanim: logs.length,
    streak: streakData.current,
    bestStreak: streakData.best,
    perPrayer,
    badges: buildBadges(logs, perPrayer, streakData.best),
    level: calculateLevel(logs.length)
  };
}

function buildStreak(uniqueDays: Set<string>): { current: number; best: number } {
  const sortedDays = Array.from(uniqueDays)
    .map((d) => new Date(d))
    .sort((a, b) => a.getTime() - b.getTime());

  let best = 0;
  let current = 0;
  let previous: Date | null = null;

  sortedDays.forEach((day) => {
    if (!previous) {
      current = 1;
    } else {
      const diffDays = Math.round((day.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      current = diffDays === 1 ? current + 1 : 1;
    }
    if (current > best) {
      best = current;
    }
    previous = day;
  });

  return { current, best };
}

function buildBadges(logs: MinyanLog[], perPrayer: Record<PrayerType, number>, bestStreak: number): Badge[] {
  const badges: Badge[] = [];
  const total = logs.length;
  if (total >= 7) {
    badges.push({ id: 'seven-day', title: '7 Days Consistent', description: 'Logged seven or more minyanim.' });
  }
  if (perPrayer.Shacharit >= 5) {
    badges.push({ id: 'shacharit-streak', title: 'Shacharit Streak', description: 'Five Shacharit minyanim.' });
  }
  if (perPrayer.Mincha >= 5) {
    badges.push({ id: 'mincha-regular', title: 'Mincha Regular', description: 'Five Mincha minyanim.' });
  }
  if (perPrayer.Maariv >= 5) {
    badges.push({ id: 'maariv-master', title: 'Maariv Master', description: 'Five Maariv minyanim.' });
  }
  if (total >= 10) {
    badges.push({ id: 'ten-minyan', title: '10 Minyan Milestone', description: 'Reached 10 total minyanim.' });
  }
  if (total >= 18) {
    badges.push({ id: 'chai', title: 'Chai', description: '18 total minyanim logged.' });
  }
  if (bestStreak >= 3) {
    badges.push({ id: 'streaker', title: 'Streak Starter', description: 'Three-day streak achieved.' });
  }
  return badges;
}

export function calculateLevel(totalMinyanim: number): number {
  return Math.max(1, Math.floor(totalMinyanim * POINTS_PER_MINYAN / 50));
}
