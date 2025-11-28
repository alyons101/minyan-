import React, { useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useMinyan } from '../context/MinyanContext';
import { PrayerType, Shul } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function SettingsScreen() {
  const { profile, setProfile, shuls, addShul, updateShul, removeShul } = useMinyan();
  const [name, setName] = useState(profile.name || '');
  const [primaryArea, setPrimaryArea] = useState(profile.primaryArea || 'Hendon');
  const [defaultShulId, setDefaultShulId] = useState(profile.defaultShulId || shuls[0]?.id);
  const [travelMode, setTravelMode] = useState(profile.travelMode || false);
  const [proof, setProof] = useState(profile.proofOfAttendance || false);
  const [photoCheckIn, setPhotoCheckIn] = useState(profile.photoCheckIn || false);
  const [locationEnabled, setLocationEnabled] = useState(profile.locationEnabled ?? true);
  const [pauseStreak, setPauseStreak] = useState(profile.pauseStreak || false);

  const notificationPreferences = useMemo(() => ({ ...profile.notificationPreferences }), [profile.notificationPreferences]);

  const handleSaveProfile = async () => {
    await setProfile({
      ...profile,
      name,
      primaryArea,
      defaultShulId,
      travelMode,
      proofOfAttendance: proof,
      photoCheckIn,
      locationEnabled,
      pauseStreak,
      notificationPreferences
    });
  };

  const handleAddShul = async () => {
    const newShul: Shul = {
      id: uuidv4(),
      name: 'New Shul',
      area: primaryArea
    };
    await addShul(newShul);
  };

  const updateNotification = (type: PrayerType, minutesBefore: number) => {
    notificationPreferences[type] = { ...notificationPreferences[type], minutesBefore };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.block}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" />
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Primary Area</Text>
        <TextInput style={styles.input} value={primaryArea} onChangeText={setPrimaryArea} placeholder="Hendon" />
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Default Shul</Text>
        <TextInput style={styles.input} value={defaultShulId} onChangeText={setDefaultShulId} placeholder="shul id" />
      </View>

      <View style={styles.switchRow}>
        <Text>Travel mode</Text>
        <Switch value={travelMode} onValueChange={setTravelMode} />
      </View>
      <View style={styles.switchRow}>
        <Text>Proof-of-attendance (require photo)</Text>
        <Switch value={proof} onValueChange={setProof} />
      </View>
      <View style={styles.switchRow}>
        <Text>Photo check-in by default</Text>
        <Switch value={photoCheckIn} onValueChange={setPhotoCheckIn} />
      </View>
      <View style={styles.switchRow}>
        <Text>Use location</Text>
        <Switch value={locationEnabled} onValueChange={setLocationEnabled} />
      </View>
      <View style={styles.switchRow}>
        <Text>Pause streak while traveling</Text>
        <Switch value={pauseStreak} onValueChange={setPauseStreak} />
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Notifications</Text>
        {(Object.keys(notificationPreferences) as PrayerType[]).map((type) => (
          <View key={type} style={styles.row}>
            <Text style={{ flex: 1 }}>{type}</Text>
            <TextInput
              style={[styles.input, styles.numberInput]}
              keyboardType="numeric"
              value={String(notificationPreferences[type].minutesBefore)}
              onChangeText={(value) => updateNotification(type, Number(value))}
            />
            <Text style={{ marginLeft: 4 }}>min before</Text>
          </View>
        ))}
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Manage Shuls</Text>
        {shuls.map((shul) => (
          <View key={shul.id} style={styles.row}>
            <Text style={{ flex: 1 }}>{shul.name}</Text>
            <Button title="Rename" onPress={() => updateShul({ ...shul, name: `${shul.name} *` })} />
            <Button title="Delete" onPress={() => removeShul(shul.id)} />
          </View>
        ))}
        <Button title="Add Shul" onPress={handleAddShul} />
      </View>

      <Button title="Save" onPress={handleSaveProfile} />
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
  block: {
    marginVertical: 8
  },
  label: {
    fontWeight: '600',
    marginBottom: 6
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  numberInput: {
    width: 60
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6
  }
});
