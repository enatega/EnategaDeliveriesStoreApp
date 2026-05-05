import React from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenHeader from './ScreenHeader';
import Sidebar from './Sidebar';
import { useTranslations } from '../localization/LocalizationProvider';
import { useSidebar } from '../hooks/useSidebar';

type Props = {
  titleKey: string;
  onNavigate: (screen: 'Language' | 'BankManagement' | 'WorkSchedule') => void;
  onSwitchToProfile?: () => void;
  children: React.ReactNode;
};

export default function TabShell({ titleKey, onNavigate, onSwitchToProfile, children }: Props) {
  const { t } = useTranslations('app');
  const sidebar = useSidebar();

  return (
    <View style={styles.flex}>
      <ScreenHeader title={t(titleKey)} onMenuPress={sidebar.openSidebar} />
      <View style={styles.flex}>{children}</View>
      <Sidebar
        visible={sidebar.sidebarOpen}
        onClose={sidebar.closeSidebar}
        availability={sidebar.availability}
        onAvailabilityChange={sidebar.setAvailability}
        onNavigate={onNavigate}
        onSwitchTab={() => {
          sidebar.closeSidebar();
          onSwitchToProfile?.();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
