import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProfileTabScreen from './ProfileTabScreen';
import TabShell from '../components/TabShell';
import { MainStackParamList } from '../navigation/types';

export default function ProfileMainTabScreen() {
  const stackNavigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const onNavigate = (screen: 'Language' | 'BankManagement' | 'WorkSchedule') =>
    stackNavigation.navigate(screen);

  return (
    <TabShell titleKey="nav_profile" onNavigate={onNavigate}>
      <ProfileTabScreen />
    </TabShell>
  );
}
