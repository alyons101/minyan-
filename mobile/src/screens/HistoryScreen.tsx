import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useMinyan } from '../context/MinyanContext';

export default function HistoryScreen() {
  const { logs } = useMinyan();

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={logs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.title}>{item.prayerType}</Text>
          <Text>{item.shulName}</Text>
          <Text>{item.date} {item.time}</Text>
          {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
          {item.travelArea ? <Text style={styles.travel}>Travel: {item.travelArea}</Text> : null}
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No minyanim logged yet.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 10
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderColor: '#eee',
    borderWidth: 1
  },
  title: {
    fontWeight: '700',
    fontSize: 16
  },
  note: {
    marginTop: 4,
    color: '#444'
  },
  travel: {
    marginTop: 4,
    color: '#2c6fbb'
  },
  empty: {
    textAlign: 'center',
    marginTop: 16
  }
});
