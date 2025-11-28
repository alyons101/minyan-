import React, { useMemo } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useMinyan } from '../context/MinyanContext';

interface Params {
  logId: string;
}

export default function MinyanDetailScreen() {
  const route = useRoute<RouteProp<Record<string, Params>, string>>();
  const { logs } = useMinyan();
  const log = useMemo(() => logs.find((item) => item.id === route.params?.logId), [logs, route.params]);

  if (!log) {
    return (
      <View style={styles.centered}>
        <Text>Entry not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {log.photoUri ? <Image source={{ uri: log.photoUri }} style={styles.photo} /> : null}
      <Text style={styles.title}>{log.prayerType} @ {log.shulName}</Text>
      <Text>{log.date} {log.time}</Text>
      {log.travelArea ? <Text style={styles.meta}>Travel: {log.travelArea}</Text> : null}
      {log.location ? (
        <Text style={styles.meta}>Location: {log.location.latitude.toFixed(4)}, {log.location.longitude.toFixed(4)}</Text>
      ) : null}
      {log.note ? (
        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>Reflection</Text>
          <Text>{log.note}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  photo: {
    width: '100%',
    height: 260,
    borderRadius: 10
  },
  title: {
    fontSize: 22,
    fontWeight: '700'
  },
  meta: {
    color: '#444'
  },
  noteCard: {
    backgroundColor: '#f6f8fb',
    borderRadius: 8,
    padding: 12
  },
  noteTitle: {
    fontWeight: '700',
    marginBottom: 4
  }
});
