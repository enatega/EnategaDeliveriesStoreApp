import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { buildTheme, Theme } from './theme';

export type ThemeMode = 'system' | 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
};

const THEME_STORAGE_KEY = 'deliveries_store_app_theme_mode';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(THEME_STORAGE_KEY)
      .then((savedMode) => {
        if (savedMode && ['system', 'light', 'dark'].includes(savedMode)) {
          setThemeModeState(savedMode as ThemeMode);
        }
      })
      .finally(() => {
        setIsLoaded(true);
      });
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await SecureStore.setItemAsync(THEME_STORAGE_KEY, mode);
  };

  const activeScheme =
    themeMode === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : themeMode;

  const theme = useMemo(() => buildTheme(activeScheme), [activeScheme]);

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      setThemeMode,
    }),
    [theme, themeMode]
  );

  if (!isLoaded) {
    return null;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }

  return context;
}
