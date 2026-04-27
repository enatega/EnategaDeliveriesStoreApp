import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import { useTranslations } from '../localization/LocalizationProvider';
import Text from '../components/Text';
import ToggleSwitch from '../components/ToggleSwitch';

// Placeholder profile data — will be replaced by API
const PROFILE = {
  initials: 'JS',
  name: 'John Smith',
  id: 'ID-7853',
  vehiclePlate: 'ABC-1234',
  address: 'Islamabad',
  phone: '+92312545000',
  username: 'John@yopmail.com',
  walletBalance: '$1258.2155',
};

export default function ProfileScreen() {
  const { theme, themeMode, setThemeMode } = useAppTheme();
  const { t } = useTranslations('app');

  const isDark = themeMode === 'dark';

  const toggleTheme = async () => {
    await setThemeMode(isDark ? 'light' : 'dark');
  };

  const infoRows = [
    { label: t('profile_vehicle_plate'), value: PROFILE.vehiclePlate },
    { label: t('profile_address'), value: PROFILE.address },
    { label: t('profile_phone'), value: PROFILE.phone },
    { label: t('profile_username'), value: PROFILE.username },
    { label: t('profile_wallet_balance'), value: PROFILE.walletBalance },
  ];

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero banner */}
        <View style={styles.heroBanner} />

        {/* Avatar overlaid on banner */}
        <View style={[styles.avatarRow, { backgroundColor: '#374151' }]}>
          <View style={[styles.avatarCircle, { backgroundColor: theme.colors.background }]}>
            <Text variant="body" weight="semiBold" color={theme.colors.primary}>
              {PROFILE.initials}
            </Text>
          </View>
          <View style={styles.nameBlock}>
            <Text variant="body" weight="semiBold" color="#FFFFFF">
              {PROFILE.name}
            </Text>
            <Text variant="caption" color="rgba(253,253,253,0.8)">
              {PROFILE.id}
            </Text>
          </View>
        </View>

        {/* Info rows */}
        <View style={styles.section}>
          {/* Bank details */}
          <View style={[styles.row, { borderBottomColor: theme.colors.gray300 }]}>
            <Text variant="caption" weight="semiBold" color={theme.colors.text} style={styles.rowLabel}>
              {t('profile_bank_details')}
            </Text>
            <Text variant="caption" color="#0EA5E9">
              {t('profile_updated')}
            </Text>
          </View>

          {infoRows.map((row) => (
            <View key={row.label} style={[styles.row, { borderBottomColor: theme.colors.gray300 }]}>
              <Text variant="caption" color={theme.colors.gray900} style={styles.rowLabel}>
                {row.label}
              </Text>
              <Text variant="caption" color="#868686">
                {row.value}
              </Text>
            </View>
          ))}

          {/* Theme toggle */}
          <View style={[styles.row, { borderBottomColor: theme.colors.gray300 }]}>
            <Text variant="caption" weight="semiBold" color={theme.colors.text} style={styles.rowLabel}>
              {t('profile_theme')}
            </Text>
            <ToggleSwitch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  heroBanner: {
    height: 156,
    backgroundColor: '#374151',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -27, // overlap banner
  },
  nameBlock: {
    gap: 4,
  },
  section: {
    paddingHorizontal: 15,
    paddingTop: 8,
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    minHeight: 51,
  },
  rowLabel: {
    flex: 1,
  },
});
