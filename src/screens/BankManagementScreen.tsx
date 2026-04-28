import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../theme/ThemeProvider';
import { useTranslations } from '../localization/LocalizationProvider';
import { useAuth } from '../auth/AuthProvider';
import { MainStackParamList } from '../navigation/types';
import ScreenHeader from '../components/ScreenHeader';
import TextInput from '../components/TextInput';
import SelectField from '../components/SelectField';
import Button from '../components/Button';

type Props = NativeStackScreenProps<MainStackParamList, 'BankManagement'>;

// ─── Currency options ─────────────────────────────────────────────────────────

const CURRENCY_OPTIONS = [
  { value: 'EUR', label: 'EUR', prefix: '🇪🇺' },
  { value: 'USD', label: 'USD', prefix: '🇺🇸' },
  { value: 'GBP', label: 'GBP', prefix: '🇬🇧' },
  { value: 'PKR', label: 'PKR', prefix: '🇵🇰' },
  { value: 'SAR', label: 'SAR', prefix: '🇸🇦' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function BankManagementScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const { session } = useAuth();

  const storeProfile = session.profiles?.find((p) => p.key === 'Store')?.data;

  // Pre-fill from session if available
  const [currency, setCurrency] = useState('EUR');
  const [accountHolder, setAccountHolder] = useState(
    storeProfile?.account_holder_name ?? ''
  );
  const [iban, setIban] = useState('');
  const [accountNumber, setAccountNumber] = useState(
    storeProfile?.account_number ?? ''
  );

  // Validation errors
  const [errors, setErrors] = useState({
    accountHolder: '',
    iban: '',
    accountNumber: '',
  });

  const validate = (): boolean => {
    const next = { accountHolder: '', iban: '', accountNumber: '' };
    let valid = true;

    if (!accountHolder.trim()) {
      next.accountHolder = t('bank_holder_required');
      valid = false;
    }
    if (!iban.trim()) {
      next.iban = t('bank_iban_required');
      valid = false;
    }
    if (!accountNumber.trim()) {
      next.accountNumber = t('bank_account_required');
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleConfirm = () => {
    if (!validate()) return;
    // API integration will be wired here
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader
        title={t('bank_title')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Currency */}
        <SelectField
          label={t('bank_currency')}
          value={currency}
          options={CURRENCY_OPTIONS}
          onSelect={setCurrency}
        />

        {/* Account holder */}
        <TextInput
          label={t('bank_holder_label')}
          placeholder={t('bank_holder_placeholder')}
          value={accountHolder}
          onChangeText={(v) => {
            setAccountHolder(v);
            if (errors.accountHolder) setErrors((e) => ({ ...e, accountHolder: '' }));
          }}
          error={errors.accountHolder}
          autoCapitalize="words"
          returnKeyType="next"
        />

        {/* IBAN / Swift / BSB */}
        <TextInput
          label={t('bank_iban_label')}
          placeholder={t('bank_iban_placeholder')}
          value={iban}
          onChangeText={(v) => {
            setIban(v.toUpperCase());
            if (errors.iban) setErrors((e) => ({ ...e, iban: '' }));
          }}
          error={errors.iban}
          autoCapitalize="characters"
          returnKeyType="next"
        />

        {/* Account number */}
        <TextInput
          label={t('bank_account_label')}
          placeholder={t('bank_account_placeholder')}
          value={accountNumber}
          onChangeText={(v) => {
            setAccountNumber(v);
            if (errors.accountNumber) setErrors((e) => ({ ...e, accountNumber: '' }));
          }}
          error={errors.accountNumber}
          keyboardType="number-pad"
          returnKeyType="done"
          onSubmitEditing={handleConfirm}
        />

        {/* Confirm */}
        <View style={styles.actions}>
          <Button label={t('bank_confirm')} onPress={handleConfirm} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 20,
    flexGrow: 1,
  },
  actions: {
    marginTop: 8,
  },
});
