import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '../api/appSettingsTypes';

export type BrandColors = {
  primary: string;
  buttonText: string;
  secondary: string;
  tertiary: string;
  updatedAt: string | null;
};

export const defaultBrandColors: BrandColors = {
  primary: '#90E36D',
  buttonText: '#111827',
  secondary: '#6B5BFF',
  tertiary: '#ECFDF5',
  updatedAt: null,
};

const BRAND_COLORS_STORAGE_KEY = 'deliveries_store_app_brand_colors';

const HEX_COLOR_REGEX = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;

function normalizeHexColor(value: string | null | undefined, fallback: string) {
  const normalizedValue = String(value ?? '').trim();
  return HEX_COLOR_REGEX.test(normalizedValue) ? normalizedValue.toUpperCase() : fallback;
}

export function buildBrandColors(settings?: AppSettings | null): BrandColors {
  return {
    primary: normalizeHexColor(settings?.primary_color, defaultBrandColors.primary),
    buttonText: normalizeHexColor(settings?.btn_text_color, defaultBrandColors.buttonText),
    secondary: normalizeHexColor(settings?.secondary_color, defaultBrandColors.secondary),
    tertiary: normalizeHexColor(settings?.tertiary_color, defaultBrandColors.tertiary),
    updatedAt: settings?.updated_at ?? null,
  };
}

export function areBrandColorsEqual(left: BrandColors, right: BrandColors) {
  return (
    left.primary === right.primary &&
    left.buttonText === right.buttonText &&
    left.secondary === right.secondary &&
    left.tertiary === right.tertiary &&
    left.updatedAt === right.updatedAt
  );
}

export const brandColorsStorage = {
  async get(): Promise<BrandColors> {
    const rawValue = await AsyncStorage.getItem(BRAND_COLORS_STORAGE_KEY);

    if (!rawValue) {
      return defaultBrandColors;
    }

    try {
      const parsedValue = JSON.parse(rawValue) as Partial<BrandColors>;

      return {
        primary: normalizeHexColor(parsedValue.primary, defaultBrandColors.primary),
        buttonText: normalizeHexColor(parsedValue.buttonText, defaultBrandColors.buttonText),
        secondary: normalizeHexColor(parsedValue.secondary, defaultBrandColors.secondary),
        tertiary: normalizeHexColor(parsedValue.tertiary, defaultBrandColors.tertiary),
        updatedAt: parsedValue.updatedAt ?? null,
      };
    } catch {
      return defaultBrandColors;
    }
  },

  async set(value: BrandColors) {
    await AsyncStorage.setItem(BRAND_COLORS_STORAGE_KEY, JSON.stringify(value));
  },
};
