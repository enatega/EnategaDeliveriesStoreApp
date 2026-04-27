import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from '../components';
import { useTranslations } from '../localization/LocalizationProvider';
import { useAuth } from '../auth/AuthProvider';
import { useAppTheme } from '../theme/ThemeProvider';

export default function LoginScreen() {
  const { t } = useTranslations('app');
  const { login } = useAuth();
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text variant="title" weight="bold" style={styles.title}>
        {t('auth_title')}
      </Text>
      <Text variant="body" color={theme.colors.mutedText} style={styles.subtitle}>
        {t('auth_subtitle')}
      </Text>

      <View style={styles.actions}>
        <Button label={t('auth_login')} onPress={login} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 12,
  },
  actions: {
    marginTop: 28,
  },
});
