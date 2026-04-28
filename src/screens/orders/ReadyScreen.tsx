import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../theme/ThemeProvider';
import Text from '../../components/Text';

/**
 * Ready tab — orders prepared and waiting for pickup/handover.
 */
export default function ReadyScreen() {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="subtitle" weight="semiBold" color={theme.colors.mutedText}>
        Ready
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
