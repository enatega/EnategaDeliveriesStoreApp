import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import Text from '../../components/Text';

/**
 * New Orders tab — shows incoming orders awaiting acceptance.
 * Will be replaced with real order list when API is wired.
 */
export default function NewOrdersScreen() {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="subtitle" weight="semiBold" color={theme.colors.mutedText}>
        New Orders
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
