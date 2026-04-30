import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../theme/ThemeProvider';
import WalletBalanceCard from '../components/WalletBalanceCard';
import WalletTransactionRow from '../components/WalletTransactionRow';
import WithdrawBottomSheet from '../components/WithdrawBottomSheet';
import WithdrawSuccessModal from '../components/WithdrawSuccessModal';
import Text from '../components/Text';

// ─── Dummy data ───────────────────────────────────────────────────────────────

const BALANCE = '$250';
const AVAILABLE_AMOUNT = '$250';

const PENDING_REQUESTS = [
  { id: '1', label: 'Requested', date: '17 Dec 2025', amount: '$100' },
];

const TRANSACTIONS = [
  { id: '1', label: 'Cash out', date: '20 Feb', amount: '$100' },
  { id: '2', label: 'Cash out', date: '20 Feb', amount: '$60' },
  { id: '3', label: 'Cash out', date: '20 Feb', amount: '$50' },
  { id: '4', label: 'Cash out', date: '20 Feb', amount: '$46' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

/**
 * Wallet tab content.
 * Shell (header, bottom nav, sidebar) is provided by MainLayout in HomeScreen.
 */
export default function WalletScreen() {
  const { theme } = useAppTheme();
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleWithdrawConfirm = (_amount: string) => {
    setWithdrawOpen(false);
    setSuccessOpen(true);
    // API integration will be wired here
  };

  return (
    <>
      <ScrollView
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance card */}
        <WalletBalanceCard
          balance={BALANCE}
          onWithdraw={() => setWithdrawOpen(true)}
        />

        {/* Pending Requests */}
        <View style={styles.section}>
          <Text variant="subtitle" weight="bold" color={theme.colors.text} style={styles.sectionTitle}>
            Pending Request
          </Text>
          {PENDING_REQUESTS.map((item) => (
            <WalletTransactionRow
              key={item.id}
              iconType="pending"
              label={item.label}
              date={item.date}
              amount={item.amount}
              amountColor="#EF4444"
            />
          ))}
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text variant="subtitle" weight="bold" color={theme.colors.text} style={styles.sectionTitle}>
            Recent Transactions
          </Text>
          {TRANSACTIONS.map((item) => (
            <WalletTransactionRow
              key={item.id}
              iconType="cashout"
              label={item.label}
              date={item.date}
              amount={item.amount}
            />
          ))}
        </View>
      </ScrollView>

      {/* Withdraw bottom sheet */}
      <WithdrawBottomSheet
        visible={withdrawOpen}
        availableAmount={AVAILABLE_AMOUNT}
        onClose={() => setWithdrawOpen(false)}
        onConfirm={handleWithdrawConfirm}
      />

      {/* Success modal */}
      <WithdrawSuccessModal
        visible={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 8,
  },
});
