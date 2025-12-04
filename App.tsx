import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import LogScreen from './src/screens/LogScreen';
import AlbumScreen from './src/screens/AlbumScreen';
import StatsScreen from './src/screens/StatsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { MinyanProvider } from './src/context/MinyanContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

export default function App() {
  return (
    <SafeAreaProvider>
      <MinyanProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Root" component={Tabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </MinyanProvider>
    </SafeAreaProvider>
  );
}
