import assert from 'assert';
import { computeStats } from '../src/services/statsService';
import { MinyanLog } from '@prisma/client';

console.log('Running stats tests...');

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

const logs: MinyanLog[] = [
    {
        id: '1', date: now, time: '08:00', prayerType: 'Shacharit',
        shulId: 's1', shulName: 'S', userId: 'u1', photoUri: null, note: null, travelArea: null, createdAt: now
    },
    {
        id: '2', date: yesterday, time: '14:00', prayerType: 'Mincha',
        shulId: 's1', shulName: 'S', userId: 'u1', photoUri: null, note: null, travelArea: null, createdAt: yesterday
    },
    {
        id: '3', date: twoDaysAgo, time: '20:00', prayerType: 'Maariv',
        shulId: 's1', shulName: 'S', userId: 'u1', photoUri: null, note: null, travelArea: null, createdAt: twoDaysAgo
    }
];

const stats = computeStats(logs);

assert.strictEqual(stats.totalMinyanim, 3);
assert.strictEqual(stats.streak, 3);
assert.strictEqual(stats.perPrayer.Shacharit, 1);
assert.strictEqual(stats.perPrayer.Mincha, 1);
assert.strictEqual(stats.perPrayer.Maariv, 1);
assert.ok(stats.badges.find(b => b.id === 'streaker')); // 3 day streak badge

console.log('All stats tests passed!');
