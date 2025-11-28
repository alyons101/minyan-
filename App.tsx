import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LogScreen from './src/screens/LogScreen';
import AlbumScreen from './src/screens/AlbumScreen';
import StatsScreen from './src/screens/StatsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { MinyanProvider } from './src/context/MinyanContext';
import OnboardingScreen from './src/screens/OnboardingScreen';
import MinyanDetailScreen from './src/screens/MinyanDetailScreen';
import { useMinyan } from './src/context/MinyanContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Log" component={LogScreen} />
      <Tab.Screen name="Album" component={AlbumScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { profile } = useMinyan();
  const navigatorKey = profile.hasOnboarded ? 'main' : 'onboarding';

  return (
    <NavigationContainer key={navigatorKey}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={profile.hasOnboarded ? 'Root' : 'Onboarding'}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Root" component={Tabs} />
        <Stack.Screen name="MinyanDetail" component={MinyanDetailScreen} options={{ headerShown: true, title: 'Minyan Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MinyanProvider>
        <RootNavigator />
      </MinyanProvider>
    </SafeAreaProvider>
  );
}
