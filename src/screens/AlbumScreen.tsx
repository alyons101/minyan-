import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useMinyan } from '../context/MinyanContext';

export default function AlbumScreen() {
  const { logs } = useMinyan();
  const photoLogs = logs.filter((log) => !!log.photoUri);

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={photoLogs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {item.photoUri ? <Image source={{ uri: item.photoUri }} style={styles.photo} /> : null}
          <Text style={styles.caption}>
            {item.prayerType} @ {item.shulName} – {item.time} {item.date}
          </Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No photos yet. Enable photo check-in to start an album.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    gap: 12
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 8
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginBottom: 6
  },
  caption: {
    fontSize: 14
  },
  empty: {
    textAlign: 'center',
    marginTop: 20
  }
});
