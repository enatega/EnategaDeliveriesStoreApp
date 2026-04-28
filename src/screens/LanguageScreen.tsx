import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../theme/ThemeProvider';
import { useTranslations, useLocalization } from '../localization/LocalizationProvider';
import { MainStackParamList } from '../navigation/types';
import ScreenHeader from '../components/ScreenHeader';
import Text from '../components/Text';
import Button from '../components/Button';

type Props = NativeStackScreenProps<MainStackParamList, 'Language'>;

type LanguageOption = {
  code: string;
  label: string;
  flag: string;
};

const LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

export default function LanguageScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations('app');
  const { language, setLanguage } = useLocalization();
  const [selected, setSelected] = useState<string>(language);

  const handleUpdate = async () => {
    await setLanguage(selected as 'en' | 'fr');
    navigation.goBack();
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader title={t('language_title')} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <Pressable
                key={lang.code}
                onPress={() => setSelected(lang.code)}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                style={[styles.row, { borderBottomColor: theme.colors.gray300 }]}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text
                  variant="caption"
                  weight="semiBold"
                  color={theme.colors.text}
                  style={styles.langLabel}
                >
                  {lang.label}
                </Text>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: isSelected ? theme.colors.primary : theme.colors.gray300,
                      backgroundColor: theme.colors.white,
                    },
                  ]}
                >
                  {isSelected && (
                    <View style={[styles.radioDot, { backgroundColor: theme.colors.primary }]} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Button label={t('language_update')} onPress={handleUpdate} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  list: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  flag: {
    fontSize: 20,
    width: 30,
    textAlign: 'center',
  },
  langLabel: {
    flex: 1,
    fontSize: 14,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  actions: {
    marginTop: 8,
  },
});
