import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider, useAppTheme } from './src/theme/ThemeProvider';
import QueryProvider from './src/providers/QueryProvider';
import { LocalizationProvider } from './src/localization/LocalizationProvider';
import { AuthProvider } from './src/auth/AuthProvider';
import './src/localization/i18n';

function ThemedApp() {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <RootNavigator />
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <QueryProvider>
          <LocalizationProvider>
            <AuthProvider>
              <ThemedApp />
            </AuthProvider>
          </LocalizationProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
