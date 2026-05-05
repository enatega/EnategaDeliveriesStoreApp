import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabsNavigator from './MainTabsNavigator';
import LanguageScreen from '../screens/LanguageScreen';
import BankManagementScreen from '../screens/BankManagementScreen';
import WorkScheduleScreen from '../screens/WorkScheduleScreen';
import EarningsDetailScreen from '../screens/EarningsDetailScreen';
import EarningsOrderDetailScreen from '../screens/EarningsOrderDetailScreen';
import { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={MainTabsNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Language" component={LanguageScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BankManagement" component={BankManagementScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WorkSchedule" component={WorkScheduleScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EarningsDetail" component={EarningsDetailScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EarningsOrderDetail" component={EarningsOrderDetailScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
