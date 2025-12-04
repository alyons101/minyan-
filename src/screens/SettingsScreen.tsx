import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useMinyan } from '../context/MinyanContext';
import { PrayerType, Shul } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { scheduleNotifications } from '../services/notificationService';

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

  const [notificationPreferences, setNotificationPreferences] = useState(profile.notificationPreferences);

  useEffect(() => {
    setNotificationPreferences(profile.notificationPreferences);
  }, [profile.notificationPreferences]);

  const handleSaveProfile = async () => {
    // Validate times
    for (const type of Object.keys(notificationPreferences) as PrayerType[]) {
      const pref = notificationPreferences[type];
      if (pref.enabled && pref.time) {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(pref.time)) {
          Alert.alert('Invalid Time', `Please enter a valid time (HH:mm) for ${type}.`);
          return;
        }
      }
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        Alert.alert('Permission Required', 'Please enable notifications to receive reminders.');
        return;
      }
    }

    const updatedProfile = {
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
    };
    await setProfile(updatedProfile);
    await scheduleNotifications(updatedProfile);
  };

  const handleAddShul = async () => {
    const newShul: Shul = {
      id: uuidv4(),
      name: 'New Shul',
      area: primaryArea
    };
    await addShul(newShul);
  };

  const updateNotification = (type: PrayerType, field: 'minutesBefore' | 'time' | 'enabled', value: any) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
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
          <View key={type} style={styles.notificationRow}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{type}</Text>
              <Switch
                value={notificationPreferences[type].enabled}
                onValueChange={(val) => updateNotification(type, 'enabled', val)}
              />
            </View>

            {notificationPreferences[type].enabled && (
              <View style={styles.notificationDetails}>
                <View style={styles.inputGroup}>
                  <Text style={styles.smallLabel}>Time (HH:mm)</Text>
                  <TextInput
                    style={[styles.input, styles.timeInput]}
                    value={notificationPreferences[type].time || ''}
                    placeholder="00:00"
                    onChangeText={(val) => updateNotification(type, 'time', val)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.smallLabel}>Minutes Before</Text>
                  <TextInput
                    style={[styles.input, styles.numberInput]}
                    keyboardType="numeric"
                    value={String(notificationPreferences[type].minutesBefore)}
                    onChangeText={(value) => updateNotification(type, 'minutesBefore', Number(value))}
                  />
                </View>
              </View>
            )}
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
  },
  notificationRow: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  notificationTitle: {
    fontWeight: '600',
    fontSize: 16
  },
  notificationDetails: {
    flexDirection: 'row',
    gap: 16
  },
  inputGroup: {
    flex: 1
  },
  smallLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  timeInput: {
    width: '100%'
  }
});
