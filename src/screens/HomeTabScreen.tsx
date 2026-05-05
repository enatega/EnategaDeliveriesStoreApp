import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { TabItem } from '../components/TabBar';
import TabBar from '../components/TabBar';
import TabShell from '../components/TabShell';
import {
  OrderTab,
  NewOrdersScreen,
  InProgressScreen,
  ReadyScreen,
  PickupScreen,
  CompletedScreen,
} from './orders';

const ORDER_TABS: TabItem<OrderTab>[] = [
  { key: 'new', label: 'New Orders' },
  { key: 'inProgress', label: 'In Progress' },
  { key: 'ready', label: 'Ready' },
  { key: 'pickup', label: 'Pickup' },
  { key: 'completed', label: 'Completed' },
];

const ORDER_TAB_SCREENS: Record<OrderTab, React.ReactElement> = {
  new: <NewOrdersScreen />,
  inProgress: <InProgressScreen />,
  ready: <ReadyScreen />,
  pickup: <PickupScreen />,
  completed: <CompletedScreen />,
};

export default function HomeTabScreen() {
  const [activeOrderTab, setActiveOrderTab] = useState<OrderTab>('new');
  const stackNavigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const onNavigate = (screen: 'Language' | 'BankManagement' | 'WorkSchedule') =>
    stackNavigation.navigate(screen);

  return (
    <TabShell titleKey="orders_title" onNavigate={onNavigate}>
      <TabBar tabs={ORDER_TABS} activeTab={activeOrderTab} onTabPress={setActiveOrderTab} />
      {ORDER_TAB_SCREENS[activeOrderTab]}
    </TabShell>
  );
}
