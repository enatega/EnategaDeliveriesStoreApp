import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import Text from '../components/Text';

/**
 * Wallet tab content.
 * Shell (header, bottom nav, sidebar) is provided by MainLayout in HomeScreen.
 */
export default function WalletScreen() {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="subtitle" weight="semiBold" color={theme.colors.text}>
        Wallet
      </Text>
      <Text variant="body" color={theme.colors.mutedText} style={styles.sub}>
        Coming soon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sub: {
    textAlign: 'center',
  },
});
