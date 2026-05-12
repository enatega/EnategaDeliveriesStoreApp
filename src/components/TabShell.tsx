import React from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenHeader from './ScreenHeader';
import Sidebar from './sidebar/Sidebar';
import { useTranslations } from '../localization/LocalizationProvider';
import { useSidebarToggler } from '../hooks/useSidebarToggler';

type Props = {
  titleKey: string;
  onNavigate: (screen: 'Language' | 'BankManagement' | 'WorkSchedule') => void;
  onSwitchToProfile?: () => void;
  children: React.ReactNode;
};

export default function TabShell({ titleKey, onNavigate, onSwitchToProfile, children }: Props) {
  const { t } = useTranslations('app');
  const { sidebarOpen, openSidebar, closeSidebar } = useSidebarToggler();

  return (
    <View style={styles.flex}>
      <ScreenHeader title={t(titleKey)} onMenuPress={openSidebar} />
      <View style={styles.flex}>{children}</View>
      <Sidebar
        visible={sidebarOpen}
        onClose={closeSidebar}
        onNavigate={onNavigate}
        onSwitchTab={() => {
          closeSidebar();
          onSwitchToProfile?.();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
