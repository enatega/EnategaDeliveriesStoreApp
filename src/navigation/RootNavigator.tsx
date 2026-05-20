import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAppTheme } from '../theme/ThemeProvider';
import { useAuth } from '../auth/AuthProvider';
import { useStoreOrderSocketSync } from '../hooks/useStoreOrderSocketSync';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { buildNavigationTheme } from './navigationTheme';
import SplashScreen from '../screens/SplashScreen';

export default function RootNavigator() {
  const { theme } = useAppTheme();
  const { isAuthenticated, isReady } = useAuth();
  const [splashFinished, setSplashFinished] = useState(false);
  useStoreOrderSocketSync();

  if (!splashFinished || !isReady) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  return (
    <NavigationContainer theme={buildNavigationTheme(theme)}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
