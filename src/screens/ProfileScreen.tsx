import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import { useTranslations } from '../localization/LocalizationProvider';
import { useAuth } from '../auth/AuthProvider';
import Text from '../components/Text';
import ToggleSwitch from '../components/ToggleSwitch';

export type ProfileScreenProps = {
  availability?: boolean;
  onAvailabilityChange?: (v: boolean) => void;
};

export default function ProfileScreen({
  availability = true,
  onAvailabilityChange,
}: ProfileScreenProps) {
  const { theme, themeMode, setThemeMode } = useAppTheme();
  const { t } = useTranslations('app');
  const { session } = useAuth();

  const user = session.user;
  const storeProfile = session.profiles?.find((p) => p.key === 'Store')?.data;

  // Derive initials from real name
  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : 'JS';

  const coverImage = storeProfile?.coverImage ?? null;

  const isDark = themeMode === 'dark';
  const toggleTheme = async () => setThemeMode(isDark ? 'light' : 'dark');

  const infoRows = [
    { label: t('profile_vehicle_plate'), value: '—' },
    { label: t('profile_address'), value: storeProfile?.address ?? '—' },
    { label: t('profile_phone'), value: user?.phone ?? '—' },
    { label: t('profile_username'), value: user?.email ?? '—' },
    { label: t('profile_wallet_balance'), value: '—' },
  ];

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Hero banner with avatar + availability ── */}
        <ImageBackground
          source={coverImage ? { uri: coverImage } : undefined}
          style={styles.heroBanner}
          imageStyle={styles.heroBannerImage}
        >
          {/* Dark gradient overlay so text is always readable */}
          <View style={styles.heroBannerOverlay} />

          <View style={styles.heroBottom}>
            {/* Avatar + name */}
            <View style={styles.heroLeft}>
              <View style={[styles.avatarCircle, { backgroundColor: theme.colors.background }]}>
                <Text variant="body" weight="semiBold" color={theme.colors.primary}>
                  {initials}
                </Text>
              </View>
              <View style={styles.nameBlock}>
                <Text variant="body" weight="semiBold" color="#FFFFFF">
                  {user?.name ?? 'Store'}
                </Text>
                <Text variant="caption" color="rgba(255,255,255,0.8)">
                  {storeProfile?.id ? `ID-${storeProfile.id.slice(0, 6)}` : ''}
                </Text>
              </View>
            </View>

            {/* Availability toggle */}
            <View style={styles.availabilityBlock}>
              <Text variant="caption" color="#FFFFFF" style={styles.availabilityLabel}>
                {t('profile_availability')}
              </Text>
              <ToggleSwitch
                value={availability}
                onValueChange={onAvailabilityChange ?? (() => {})}
              />
            </View>
          </View>
        </ImageBackground>

        {/* ── Info rows ── */}
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
  // Hero banner
  heroBanner: {
    height: 160,
    backgroundColor: '#374151',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heroBannerImage: {
    resizeMode: 'cover',
  },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  heroBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  heroLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameBlock: {
    gap: 4,
  },
  availabilityBlock: {
    alignItems: 'flex-end',
    gap: 4,
  },
  availabilityLabel: {
    fontSize: 12,
  },
  // Info rows
  section: {
    paddingHorizontal: 15,
    paddingTop: 8,
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
