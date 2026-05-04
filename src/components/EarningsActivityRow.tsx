import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import { useAppTheme } from '../theme/ThemeProvider';

export type EarningsActivityItem = {
  order_id: string;
  payment_amount: number;
  status: string;
  created_at: string;
  label: string;
};

type Props = {
  items: EarningsActivityItem[];
  onPressItem?: (item: EarningsActivityItem) => void;
};

function formatDisplayDate(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function Row({
  item,
  onPress,
}: {
  item: EarningsActivityItem;
  onPress?: (item: EarningsActivityItem) => void;
}) {
  const { theme } = useAppTheme();
  console.log('EarningsActivityItem:', item.created_at);
  

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: theme.colors.gray200, opacity: pressed ? 0.7 : 1 },
      ]}
    >

      <Text variant="caption" color={theme.colors.gray500} style={styles.date}>
        {formatDisplayDate(item.created_at)}
      </Text>
      <Text variant="body" weight="semiBold" color={theme.colors.text} style={styles.label}>
        {item.label}
      </Text>

      <Text variant="body" weight="bold" color={theme.colors.text} style={styles.amount}>
        ${item.payment_amount}
      </Text>
      <View style={[styles.chevron, { borderColor: theme.colors.gray500 }]} />
    </Pressable>
  );
}

export default function EarningsActivityRow({ items, onPressItem }: Props) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.order_id}
      renderItem={({ item }) => <Row item={item} onPress={onPressItem} />}
      scrollEnabled={false}
    />
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
    marginRight: 6,
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
