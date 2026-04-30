import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from './Text';
import Button from './Button';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = {
  balance: string;
  onWithdraw: () => void;
};

/**
 * Current balance card with Withdraw Now button.
 */
export default function WalletBalanceCard({ balance, onWithdraw }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.gray200 }]}>
      <Text variant="body" color={theme.colors.mutedText} style={styles.label}>
        Current Balance
      </Text>
      {/* Use themed Text with explicit lineHeight to prevent clipping */}
      <Text
        weight="bold"
        color={theme.colors.text}
        style={styles.amount}
        numberOfLines={1}
      >
        {balance}
      </Text>
      <Button label="Withdraw Now" onPress={onWithdraw} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
  },
  amount: {
    fontSize: 36,
    lineHeight: 44,
    textAlign: 'center',
  },
});
