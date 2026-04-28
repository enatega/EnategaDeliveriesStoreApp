import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import Text from '../../components/Text';

/**
 * Pickup tab — orders ready for customer self-pickup.
 */
export default function PickupScreen() {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="subtitle" weight="semiBold" color={theme.colors.mutedText}>
        Pickup
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
