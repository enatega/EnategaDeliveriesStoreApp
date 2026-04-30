import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = {
  orderId: string;
  status: string;
  payment: string;
};

/**
 * Expandable order card used on the Earnings order detail screen.
 * Shows Order ID + status badge, Payment row, and collapsible Order Details.
 */
export default function EarningsOrderCard({ orderId, status, payment }: Props) {
  const { theme } = useAppTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={[styles.card, { borderColor: theme.colors.gray200, backgroundColor: theme.colors.surface }]}>
      {/* Row 1: Order ID + status badge */}
      <View style={styles.topRow}>
        <Text variant="body" color={theme.colors.text}>
          Order ID{' '}
          <Text variant="body" weight="semiBold" color={theme.colors.text}>
            {orderId}
          </Text>
        </Text>
        <View style={styles.badge}>
          <Text variant="caption" color="#16A34A" style={styles.badgeText}>
            {status}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.colors.gray200 }]} />

      {/* Row 2: Payment */}
      <View style={styles.paymentRow}>
        <Text variant="body" color={theme.colors.text}>
          Payment
        </Text>
        <Text variant="body" weight="bold" color={theme.colors.text}>
          {payment}
        </Text>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.colors.gray200 }]} />

      {/* Row 3: Order Details toggle */}
      <Pressable
        onPress={() => setExpanded((v) => !v)}
        style={styles.detailsRow}
        accessibilityRole="button"
        accessibilityLabel="Toggle order details"
      >
        <Text variant="body" color={theme.colors.text}>
          Order Details
        </Text>
        <View
          style={[
            styles.chevron,
            { borderColor: theme.colors.gray500 },
            expanded && styles.chevronUp,
          ]}
        />
      </Pressable>

      {/* Expanded details placeholder */}
      {expanded && (
        <View style={[styles.expandedContent, { borderTopColor: theme.colors.gray200 }]}>
          <Text variant="caption" color={theme.colors.mutedText}>
            Order details will appear here once API is integrated.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  badge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
  },
  divider: {
    height: 1,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  chevron: {
    width: 9,
    height: 9,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
  },
  chevronUp: {
    transform: [{ rotate: '-135deg' }],
    marginTop: 4,
  },
  expandedContent: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
});
