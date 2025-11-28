import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useMinyan } from '../context/MinyanContext';
import { PrayerType } from '../types';

export default function StatsScreen() {
  const { stats, level } = useMinyan();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Achievements</Text>
      <Text style={styles.lead}>Level {level} · {stats.totalMinyanim * 10} pts</Text>
      <Text style={styles.label}>Streak</Text>
      <Text>Current: {stats.streak} · Best: {stats.bestStreak}</Text>

      <Text style={styles.label}>Breakdown</Text>
      {(['Shacharit', 'Mincha', 'Maariv'] as PrayerType[]).map((type) => (
        <Text key={type}>{type}: {stats.perPrayer[type]}</Text>
      ))}

      <Text style={styles.label}>Badges</Text>
      {stats.badges.length ? (
        stats.badges.map((badge) => (
          <View key={badge.id} style={styles.badge}>
            <Text style={styles.badgeTitle}>{badge.title}</Text>
            <Text>{badge.description}</Text>
          </View>
        ))
      ) : (
        <Text>No badges yet. Keep logging minyanim!</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '700'
  },
  lead: {
    fontSize: 16,
    color: '#444'
  },
  label: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600'
  },
  badge: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f3f6ff',
    borderRadius: 8
  },
  badgeTitle: {
    fontWeight: '700'
  }
});
