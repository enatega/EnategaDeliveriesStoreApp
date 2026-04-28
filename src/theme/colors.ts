export const lightColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  primary: '#90E36D',
  secondary: '#6B5BFF',
  text: '#111827',
  mutedText: '#6B7280',
  border: '#D1D5DB',
  white: '#FFFFFF',
  // Gray scale (Figma tokens)
  gray900: '#111827',
  gray600: '#4B5563',
  gray500: '#6B7280',
  gray400: '#9CA3AF',
  gray300: '#D1D5DB',
  gray200: '#E5E7EB',
};

export const darkColors: typeof lightColors = {
  background: '#0F1117',
  surface: '#161A23',
  primary: '#90E36D',
  secondary: '#8B7BFF',
  text: '#F9FAFB',
  mutedText: '#9CA3AF',
  border: '#374151',
  white: '#FFFFFF',
  gray900: '#F9FAFB',
  gray600: '#9CA3AF',
  gray500: '#9CA3AF',
  gray400: '#6B7280',
  gray300: '#374151',
  gray200: '#1F2937',
};

export type ThemeColors = typeof lightColors;
