import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = {
  date: string;
  label: string;
  amount: string;
  onPress?: () => void;
};

/**
 * Single row in the earnings activity list.
 * date | label | amount | chevron
 */
export default function EarningsActivityRow({ date, label, amount, onPress }: Props) {
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: theme.colors.gray200, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text variant="caption" color={theme.colors.gray500} style={styles.date}>
        {date}
      </Text>
      <Text variant="body" weight="semiBold" color={theme.colors.text} style={styles.label}>
        {label}
      </Text>
      <Text variant="body" weight="bold" color={theme.colors.text} style={styles.amount}>
        {amount}
      </Text>
      <View style={[styles.chevron, { borderColor: theme.colors.gray500 }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 8,
  },
  date: {
    fontSize: 12,
    minWidth: 72,
  },
  label: {
    flex: 1,
    fontSize: 14,
  },
  amount: {
    fontSize: 14,
  },
  chevron: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    transform: [{ rotate: '45deg' }],
    marginLeft: 4,
  },
});
