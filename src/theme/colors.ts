export const lightColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  primary: '#2346E8',
  secondary: '#6B5BFF',
  text: '#111827',
  mutedText: '#6B7280',
  border: '#E4E4E7',
  white: '#FFFFFF',
};

export const darkColors: typeof lightColors = {
  background: '#0F1117',
  surface: '#161A23',
  primary: '#4C7DFF',
  secondary: '#8B7BFF',
  text: '#F9FAFB',
  mutedText: '#9CA3AF',
  border: '#424244',
  white: '#FFFFFF',
};

export type ThemeColors = typeof lightColors;
