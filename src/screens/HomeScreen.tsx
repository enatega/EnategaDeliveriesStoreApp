import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalization, useTranslations } from '../localization/LocalizationProvider';
import { useAppTheme } from '../theme/ThemeProvider';
import { useLogoutMutation } from '../hooks/useAuthMutations';
import { Button, Image, Text } from '../components';

export default function HomeScreen() {
  const { theme, themeMode, setThemeMode } = useAppTheme();
  const { language, setLanguage } = useLocalization();
  const logoutMutation = useLogoutMutation();
  const { t } = useTranslations('app');

  const toggleTheme = async () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    await setThemeMode(next);
  };

  const toggleLanguage = async () => {
    const next = language === 'en' ? 'fr' : 'en';
    await setLanguage(next);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
      <Text variant="title" weight="bold" style={styles.title}>
        {t('app_name')}
      </Text>
      <Text variant="subtitle" style={styles.subtitle}>
        {t('welcome_title')}
      </Text>
      <Text variant="body" color={theme.colors.mutedText} style={styles.description}>
        {t('welcome_subtitle')}
      </Text>

      <View style={styles.actions}>
        <Button label={t('change_theme')} onPress={toggleTheme} />
        <Button label={t('change_language')} onPress={toggleLanguage} variant="secondary" />
        <Button
          label={logoutMutation.isPending ? t('auth_logout_loading') : t('auth_logout')}
          onPress={() => logoutMutation.mutate()}
          variant="secondary"
          disabled={logoutMutation.isPending}
        />
      </View>

      <Text variant="caption" color={theme.colors.mutedText}>
        {t('current_theme', { mode: themeMode })}
      </Text>
      <Text variant="caption" color={theme.colors.mutedText}>
        {t('current_language', { language })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
});
