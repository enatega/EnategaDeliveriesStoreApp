import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import { useAppTheme } from '../theme/ThemeProvider';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderStatus = 'new' | 'processing' | 'ready' | 'delivered';

export type OrderItem = {
  name: string;
  description: string;
  quantity: number;
  price: number;
  imageUrl?: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  amount: number;
  paymentMethod: string;
  dateTime: string;
  customerName?: string;
  customerAddress?: string;
  items?: OrderItem[];
  comment?: string;
};

type Props = {
  order: Order;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrderCard({ order, onAccept, onReject }: Props) {
  const { theme } = useAppTheme();

  const showActions = order.status === 'new';

  return (
    <View style={[styles.card, { backgroundColor: '#FDFDFD', borderColor: theme.colors.gray200 }]}>

      {/* ── Row 1: Order ID + time ── */}
      <View style={styles.topRow}>
        <Text style={styles.orderId} color={theme.colors.gray900}>
          Order ID:{' '}
          <Text style={styles.orderIdBold} color={theme.colors.gray900} weight="semiBold">
            {order.id}
          </Text>
        </Text>
        <Text style={styles.time} color={theme.colors.gray500}>
          {order.dateTime}
        </Text>
      </View>

      {/* ── Row 2: Customer name ── */}
      {order.customerName ? (
        <Text style={styles.customerName} color={theme.colors.gray900} weight="semiBold">
          {order.customerName}
        </Text>
      ) : null}

      {/* ── Row 3: Address ── */}
      {order.customerAddress ? (
        <View style={styles.addressRow}>
          <LocationPin color={theme.colors.gray500} />
          <Text style={styles.address} color={theme.colors.gray500}>
            {order.customerAddress}
          </Text>
        </View>
      ) : null}

      {/* ── Divider ── */}
      {order.items && order.items.length > 0 ? (
        <>
          <View style={[styles.divider, { backgroundColor: theme.colors.gray200 }]} />

          {/* ── Items header ── */}
          <View style={styles.itemsHeader}>
            <Text style={styles.colHeader} color={theme.colors.gray500}>
              ORDER
            </Text>
            <Text style={styles.colHeaderRight} color={theme.colors.gray500}>
              PRICE
            </Text>
          </View>

          {/* ── Item rows ── */}
          {order.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              {/* Food image */}
              <View style={[styles.foodImageBox, { backgroundColor: theme.colors.gray200, borderColor: theme.colors.gray200 }]}>
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.foodImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.foodImagePlaceholder, { backgroundColor: theme.colors.gray200 }]} />
                )}
              </View>

              {/* Name + desc + qty */}
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} color={theme.colors.gray900} weight="semiBold">
                  {item.name}
                </Text>
                <Text style={styles.itemDesc} color={theme.colors.gray600}>
                  {item.description}
                </Text>
                <Text style={styles.itemQty} color={theme.colors.gray900} weight="semiBold">
                  x{item.quantity}
                </Text>
              </View>

              {/* Price */}
              <Text style={styles.itemPrice} color={theme.colors.gray900} weight="semiBold">
                ${item.price}
              </Text>
            </View>
          ))}

          {/* ── Total ── */}
          <View style={[styles.divider, { backgroundColor: theme.colors.gray200 }]} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel} color={theme.colors.gray900} weight="semiBold">
              Total
            </Text>
            <Text style={styles.totalValue} color={theme.colors.gray900} weight="semiBold">
              ${order.amount}
            </Text>
          </View>
        </>
      ) : null}

      {/* ── Comment ── */}
      {order.comment ? (
        <View style={[styles.commentBox, { backgroundColor: theme.colors.background }]}>
          <Text style={styles.commentLabel} color={theme.colors.gray600} weight="semiBold">
            Comment
          </Text>
          <Text style={styles.commentText} color={theme.colors.gray900}>
            {order.comment}
          </Text>
        </View>
      ) : null}

      {/* ── Accept / Reject buttons (new orders only) ── */}
      {showActions ? (
        <View style={styles.actions}>
          <Pressable
            style={[styles.btn, styles.btnReject]}
            onPress={() => onReject?.(order.id)}
            accessibilityRole="button"
            accessibilityLabel="Reject order"
          >
            <Text style={styles.btnRejectText} color="#EF4444" weight="semiBold">
              Reject
            </Text>
          </Pressable>
          <Pressable
            style={[styles.btn, styles.btnAccept, { backgroundColor: theme.colors.primary }]}
            onPress={() => onAccept?.(order.id)}
            accessibilityRole="button"
            accessibilityLabel="Accept order"
          >
            <Text style={styles.btnAcceptText} color={theme.colors.gray900} weight="semiBold">
              Accept
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

// ─── Location pin icon ────────────────────────────────────────────────────────

function LocationPin({ color }: { color: string }) {
  return (
    <View style={pinStyles.wrapper}>
      <View style={[pinStyles.circle, { borderColor: color }]} />
      <View style={[pinStyles.tail, { backgroundColor: color }]} />
    </View>
  );
}

const pinStyles = StyleSheet.create({
  wrapper: {
    width: 12,
    height: 16,
    alignItems: 'center',
    marginTop: 1,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  tail: {
    width: 1.5,
    height: 5,
    borderRadius: 1,
    marginTop: -1,
  },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  // Top row
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 14,
  },
  orderIdBold: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
  },
  // Customer
  customerName: {
    fontSize: 15,
    marginTop: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: 2,
  },
  address: {
    fontSize: 13,
    flex: 1,
  },
  // Divider
  divider: {
    height: 1,
    marginVertical: 4,
  },
  // Items
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  colHeaderRight: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  foodImageBox: {
    width: 48,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  foodImagePlaceholder: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    fontSize: 14,
  },
  itemDesc: {
    fontSize: 12,
  },
  itemQty: {
    fontSize: 12,
  },
  itemPrice: {
    fontSize: 14,
    minWidth: 36,
    textAlign: 'right',
  },
  // Total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 16,
  },
  // Comment
  commentBox: {
    borderRadius: 4,
    paddingVertical: 6,
    gap: 4,
  },
  commentLabel: {
    fontSize: 14,
  },
  commentText: {
    fontSize: 15,
    fontStyle: 'italic',
  },
  // Actions
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnReject: {
    borderWidth: 1.5,
    borderColor: '#EF4444',
    backgroundColor: 'transparent',
  },
  btnRejectText: {
    fontSize: 16,
  },
  btnAccept: {},
  btnAcceptText: {
    fontSize: 16,
  },
});
