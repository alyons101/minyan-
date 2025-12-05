import React, { useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { MinyanPicker } from '../components/MinyanPicker';
import { useMinyan } from '../context/MinyanContext';
import { PrayerType } from '../types';

const prayerTypes: PrayerType[] = ['Shacharit', 'Mincha', 'Maariv'];

export default function LogScreen() {
  const { shuls, profile, logMinyan } = useMinyan();
  const [prayerType, setPrayerType] = useState<PrayerType>('Shacharit');
  const [shulId, setShulId] = useState<string>(profile.defaultShulId || shuls[0]?.id);
  const [note, setNote] = useState('');
  const [travelArea, setTravelArea] = useState('');
  const [requirePhoto, setRequirePhoto] = useState(profile.photoCheckIn || profile.proofOfAttendance || false);
  const [status, setStatus] = useState('');

  const selectedShulName = useMemo(() => shuls.find((s) => s.id === shulId)?.name || 'Unknown', [shulId, shuls]);

  const handleLog = async () => {
    try {
      setStatus('');
      await logMinyan({
        prayerType,
        shulId: shulId || shuls[0].id,
        shulName: selectedShulName,
        requirePhoto: requirePhoto || !!profile.proofOfAttendance,
        note,
        travelArea: profile.travelMode ? travelArea : undefined
      });
      setNote('');
      setTravelArea('');
      setStatus('Logged!');
    } catch (err) {
      setStatus((err as Error).message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Log Minyan</Text>
      <Text style={styles.label}>Prayer</Text>
      <View style={styles.row}>
        {prayerTypes.map((type) => (
          <Button key={type} title={type} onPress={() => setPrayerType(type)} color={prayerType === type ? '#2c6fbb' : '#ccc'} />
        ))}
      </View>

      <Text style={styles.label}>Shul</Text>
      <MinyanPicker selectedValue={shulId} onValueChange={(value: string) => setShulId(value)}>
        {shuls.map((s) => (
          <MinyanPicker.Item key={s.id} label={`${s.name} (${s.area})`} value={s.id} />
        ))}
      </MinyanPicker>

      {profile.travelMode && (
        <View style={styles.block}>
          <Text style={styles.label}>Travel city/area</Text>
          <TextInput style={styles.input} placeholder="City or area" value={travelArea} onChangeText={setTravelArea} />
        </View>
      )}

      <View style={styles.block}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Photo check-in</Text>
          <Switch value={requirePhoto} onValueChange={setRequirePhoto} />
        </View>
        <Text style={styles.help}>Enable proof-of-attendance mode to require a photo with every log.</Text>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Reflection</Text>
        <TextInput
          placeholder="Add a note"
          style={[styles.input, styles.note]}
          multiline
          value={note}
          onChangeText={setNote}
        />
      </View>

      <Button title="Log Minyan" onPress={handleLog} />
      {!!status && <Text style={styles.status}>{status}</Text>}
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
    fontWeight: '600'
  },
  label: {
    fontSize: 16,
    marginBottom: 6
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8
  },
  block: {
    marginVertical: 8
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  help: {
    color: '#555',
    fontSize: 13
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 6
  },
  note: {
    minHeight: 80
  },
  status: {
    marginTop: 8,
    color: '#2c6fbb'
  }
});
