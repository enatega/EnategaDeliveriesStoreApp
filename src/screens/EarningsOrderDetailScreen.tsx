import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../theme/ThemeProvider';
import { MainStackParamList } from '../navigation/types';
import ScreenHeader from '../components/ScreenHeader';
import EarningsOrderCard from '../components/EarningsOrderCard';
import Text from '../components/Text';

type Props = NativeStackScreenProps<MainStackParamList, 'EarningsOrderDetail'>;

// ─── Dummy data ───────────────────────────────────────────────────────────────

const ORDERS = [
  { id: '1', orderId: '#1234UA', status: 'Delivered', payment: '$150' },
  { id: '2', orderId: '#1234UA', status: 'Delivered', payment: '$150' },
  { id: '3', orderId: '#1234UA', status: 'Delivered', payment: '$150' },
  { id: '4', orderId: '#1234UA', status: 'Delivered', payment: '$150' },
];

const TOTAL_EARNINGS = '$600';

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EarningsOrderDetailScreen({ navigation }: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader title="Earnings" onBack={() => navigation.goBack()} />

      {/* Total earnings row */}
      <View style={[styles.totalRow, { borderBottomColor: theme.colors.gray200 }]}>
        <Text variant="body" color={theme.colors.text}>
          Total Earnings
        </Text>
        <Text variant="body" weight="bold" color={theme.colors.text}>
          {TOTAL_EARNINGS}
        </Text>
      </View>

      {/* Order cards */}
      <FlatList
        data={ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <EarningsOrderCard
            orderId={item.orderId}
            status={item.status}
            payment={item.payment}
          />
        )}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  separator: {
    height: 12,
  },
});
