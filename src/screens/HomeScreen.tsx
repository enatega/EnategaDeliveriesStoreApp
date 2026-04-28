import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { TabKey } from '../components/BottomTabBar';
import { TabItem } from '../components/TabBar';
import MainLayout from '../components/MainLayout';
import TabBar from '../components/TabBar';
import {
  OrderTab,
  NewOrdersScreen,
  InProgressScreen,
  ReadyScreen,
  PickupScreen,
  CompletedScreen,
} from './orders';
import WalletScreen from './WalletScreen';
import EarningsScreen from './EarningsScreen';
import ProfileTabScreen from './ProfileTabScreen';
import { useSidebar } from '../hooks/useSidebar';

type Props = NativeStackScreenProps<MainStackParamList, 'Home'>;

// ─── Order tab config — single source of truth ───────────────────────────────

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

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }: Props) {
  const [activeNavTab, setActiveNavTab] = useState<TabKey>('Home');
  const [activeOrderTab, setActiveOrderTab] = useState<OrderTab>('new');
  const sidebar = useSidebar();

  const handleNavigate = (screen: 'Language') => {
    navigation.navigate(screen);
  };

  const renderTabContent = () => {
    switch (activeNavTab) {
      case 'Wallet':   return <WalletScreen />;
      case 'Earnings': return <EarningsScreen />;
      case 'Profile':  return (
        <ProfileTabScreen
          availability={sidebar.availability}
          onAvailabilityChange={sidebar.setAvailability}
        />
      );
      default:
        return (
          <>
            <TabBar
              tabs={ORDER_TABS}
              activeTab={activeOrderTab}
              onTabPress={setActiveOrderTab}
            />
            {ORDER_TAB_SCREENS[activeOrderTab]}
          </>
        );
    }
  };

  return (
    <MainLayout
      activeTab={activeNavTab}
      onTabChange={setActiveNavTab}
      sidebarOpen={sidebar.sidebarOpen}
      onOpenSidebar={sidebar.openSidebar}
      onCloseSidebar={sidebar.closeSidebar}
      availability={sidebar.availability}
      onAvailabilityChange={sidebar.setAvailability}
      onNavigate={handleNavigate}
    >
      {renderTabContent()}
    </MainLayout>
  );
}
