import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/ThemeProvider';
import { useTranslations } from '../localization/LocalizationProvider';
import ScreenHeader from './ScreenHeader';
import BottomTabBar, { TabKey } from './BottomTabBar';
import Sidebar from './Sidebar';
import HomeIcon from './icons/HomeIcon';
import WalletIcon from './icons/WalletIcon';
import EarningsIcon from './icons/EarningsIcon';
import ProfileIcon from './icons/ProfileIcon';

// Title key per tab — centralised here, not scattered across screens
const TAB_TITLE_KEYS: Record<TabKey, string> = {
  Home: 'orders_title',
  Wallet: 'nav_wallet',
  Earnings: 'nav_earnings',
  Profile: 'nav_profile',
};

type Props = {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  // Sidebar state lifted from useSidebar hook
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  availability: boolean;
  onAvailabilityChange: (v: boolean) => void;
  // Navigation to stack screens (Language, BankManagement, etc.)
  onNavigate: (screen: 'Language' | 'BankManagement' | 'WorkSchedule') => void;
  children: React.ReactNode;
};

/**
 * Shared shell for all main tabs.
 * Renders: header (with hamburger) + children + bottom nav + sidebar overlay.
 * Each tab screen only provides its content — no shell logic needed there.
 */
export default function MainLayout({
  activeTab,
  onTabChange,
  sidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
  availability,
  onAvailabilityChange,
  onNavigate,
  children,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const insets = useSafeAreaInsets();

  const navTabs = [
    {
      key: 'Home' as TabKey,
      label: t('nav_home'),
      icon: <HomeIcon active={activeTab === 'Home'} />,
    },
    {
      key: 'Wallet' as TabKey,
      label: t('nav_wallet'),
      icon: <WalletIcon active={activeTab === 'Wallet'} />,
    },
    {
      key: 'Earnings' as TabKey,
      label: t('nav_earnings'),
      icon: <EarningsIcon active={activeTab === 'Earnings'} />,
    },
    {
      key: 'Profile' as TabKey,
      label: t('nav_profile'),
      icon: <ProfileIcon active={activeTab === 'Profile'} />,
    },
  ];

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      {/* Header — hamburger opens sidebar on every tab */}
      <ScreenHeader
        title={t(TAB_TITLE_KEYS[activeTab])}
        onMenuPress={onOpenSidebar}
      />

      {/* Tab content */}
      <View style={styles.flex}>{children}</View>

      {/* Bottom nav */}
      <BottomTabBar
        tabs={navTabs}
        activeTab={activeTab}
        onTabPress={onTabChange}
        bottomInset={insets.bottom}
      />

      {/* Sidebar overlay — above everything */}
      <Sidebar
        visible={sidebarOpen}
        onClose={onCloseSidebar}
        availability={availability}
        onAvailabilityChange={onAvailabilityChange}
        onNavigate={onNavigate}
        onSwitchTab={(tab) => { onCloseSidebar(); onTabChange(tab); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
