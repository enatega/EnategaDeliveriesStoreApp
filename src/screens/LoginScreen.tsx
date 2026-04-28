import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from '../components';
import EmailIcon from '../components/icons/EmailIcon';
import { useTranslations } from '../localization/LocalizationProvider';
import { useAppTheme } from '../theme/ThemeProvider';
import { useLoginMutation } from '../hooks/useAuthMutations';

export default function LoginScreen() {
  const { t } = useTranslations('app');
  const { theme } = useAppTheme();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = (): boolean => {
    let valid = true;

    if (!email.trim()) {
      setEmailError(t('auth_email_required'));
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(t('auth_email_invalid'));
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError(t('auth_password_required'));
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = () => {
    if (!validate()) return;
    loginMutation.mutate({
      email: email.trim(),
      password,
      device_push_token: 'fcm-token-optional',
    });
  };

  const apiError = loginMutation.error?.message ?? null;

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Centered card */}
        <View style={styles.card}>
          {/* Email icon */}
          <View style={styles.iconWrapper}>
            <EmailIcon size={56} color={theme.colors.primary} />
          </View>

          {/* Title + subtitle */}
          <Text
            variant="subtitle"
            weight="bold"
            color={theme.colors.gray900}
            style={styles.title}
          >
            {t('auth_title')}
          </Text>
          <Text variant="body" color={theme.colors.gray500} style={styles.subtitle}>
            {t('auth_subtitle')}
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              placeholder={t('auth_email_placeholder')}
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              accessibilityLabel={t('auth_email_placeholder')}
            />

            <TextInput
              placeholder={t('auth_password_placeholder')}
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                if (passwordError) setPasswordError('');
              }}
              error={passwordError}
              isPassword
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              accessibilityLabel={t('auth_password_placeholder')}
            />

            {apiError ? (
              <Text variant="caption" color="#EF4444">
                {apiError}
              </Text>
            ) : null}
          </View>

          {/* Login button */}
          <Button
            label={t('auth_login')}
            onPress={handleLogin}
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',   // vertically center when content is shorter than screen
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    gap: 0,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 16,
    marginBottom: 32,
  },
});
