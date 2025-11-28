import React, { useMemo, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import { useMinyan } from '../context/MinyanContext';
import { Shul } from '../types';

const AREAS = ['Hendon', 'Golders Green', 'Other'];

export default function OnboardingScreen() {
  const { profile, setProfile, shuls, addShul } = useMinyan();
  const navigation = useNavigation();
  const [name, setName] = useState(profile.name || '');
  const [primaryArea, setPrimaryArea] = useState(profile.primaryArea || AREAS[0]);
  const [selectedShulId, setSelectedShulId] = useState(profile.defaultShulId || shuls[0]?.id);
  const [customShulName, setCustomShulName] = useState('');
  const [customShulArea, setCustomShulArea] = useState(primaryArea);

  const shulOptions = useMemo(() => shuls, [shuls]);

  const handleAddShul = async () => {
    if (!customShulName.trim()) return;
    const newShul: Shul = {
      id: uuidv4(),
      name: customShulName.trim(),
      area: customShulArea || primaryArea
    };
    await addShul(newShul);
    setSelectedShulId(newShul.id);
    setCustomShulName('');
  };

  const handleContinue = async () => {
    const nextProfile = {
      ...profile,
      name,
      primaryArea,
      defaultShulId: selectedShulId,
      hasOnboarded: true
    };
    await setProfile(nextProfile);
    navigation.reset({ index: 0, routes: [{ name: 'Root' as never }] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to Minyan Tracker</Text>
      <Text style={styles.subtitle}>Set up your basics to start logging.</Text>

      <View style={styles.block}>
        <Text style={styles.label}>Name (optional)</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Your name" style={styles.input} />
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Primary area</Text>
        <Picker selectedValue={primaryArea} onValueChange={(value) => setPrimaryArea(value.toString())}>
          {AREAS.map((area) => (
            <Picker.Item key={area} label={area} value={area} />
          ))}
        </Picker>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Choose your main shul</Text>
        <Picker selectedValue={selectedShulId} onValueChange={(value) => setSelectedShulId(value.toString())}>
          {shulOptions.map((option) => (
            <Picker.Item key={option.id} label={`${option.name} (${option.area})`} value={option.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.block}>
        <Text style={styles.label}>Add a custom shul</Text>
        <TextInput
          placeholder="Shul name"
          value={customShulName}
          onChangeText={setCustomShulName}
          style={styles.input}
        />
        <TextInput
          placeholder="Area (optional)"
          value={customShulArea}
          onChangeText={setCustomShulArea}
          style={[styles.input, { marginTop: 8 }]}
        />
        <Button title="Add shul" onPress={handleAddShul} />
      </View>

      <Button title="Continue" onPress={handleContinue} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12
  },
  title: {
    fontSize: 26,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 16,
    color: '#555'
  },
  block: {
    marginTop: 12
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
  }
});
