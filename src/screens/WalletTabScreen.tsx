import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import WalletScreen from './WalletScreen';
import TabShell from '../components/TabShell';
import { MainStackParamList } from '../navigation/types';

export default function WalletTabScreen() {
  const stackNavigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const onNavigate = (screen: 'Language' | 'BankManagement' | 'WorkSchedule') =>
    stackNavigation.navigate(screen);

  return (
    <TabShell titleKey="nav_wallet" onNavigate={onNavigate}>
      <WalletScreen />
    </TabShell>
  );
}
