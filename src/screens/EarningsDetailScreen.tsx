import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../theme/ThemeProvider';
import { MainStackParamList } from '../navigation/types';
import EarningsActivityRow from '../components/EarningsActivityRow';
import CalendarRangePicker from '../components/CalendarRangePicker';
import Text from '../components/Text';
import {
  useEarningsDailyQuery,
  useEarningsSummaryQuery,
} from '../hooks/useEarningsQueries';

type Props = NativeStackScreenProps<MainStackParamList, 'EarningsDetail'>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d: Date) =>
  `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EarningsDetailScreen({ navigation }: Props) {
  const { theme } = useAppTheme();

  const defaultStart = new Date(2023, 0, 21); // 01/21/2023
  const defaultEnd = new Date(2023, 1, 20);   // 02/20/2023

  const [range, setRange] = useState({ start: defaultStart, end: defaultEnd });
  const [calendarOpen, setCalendarOpen] = useState(false);

  const dateRangeLabel = `${formatDate(range.start)} - ${formatDate(range.end)}`;
  const dateRangeParams = useMemo(
    () => ({
      page: 1,
      limit: 10,
      startDate: range.start.toISOString(),
      endDate: range.end.toISOString(),
    }),
    [range.end, range.start],
  );
  const { data: earningsDailyData } = useEarningsDailyQuery({
    params: dateRangeParams,
    staleTime: Infinity,
  });
  const { data: earningsSummaryData } = useEarningsSummaryQuery({
    params: dateRangeParams,
    staleTime: Infinity,
  });

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      {/* Header: back + date range + filter icon */}
      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8} accessibilityLabel="Go back">
          <View style={[styles.backChevron, { borderColor: theme.colors.text }]} />
        </Pressable>

        <Text variant="body" weight="bold" color={theme.colors.text} style={styles.headerTitle}>
          {dateRangeLabel}
        </Text>

        <Pressable
          onPress={() => setCalendarOpen(true)}
          hitSlop={8}
          accessibilityLabel="Filter by date"
        >
          <FilterIcon color={theme.colors.text} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary card */}
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.gray200 }]}>
          <Text variant="body" weight="semiBold" color={theme.colors.text} style={styles.summaryTitle}>
            Summary
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="caption" color={theme.colors.gray500}>Orders</Text>
              <Text variant="subtitle" weight="bold" color={theme.colors.text}>
                {earningsSummaryData?.total_orders ?? 0}
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: theme.colors.gray300 }]} />
            <View style={styles.summaryItem}>
              <Text variant="caption" color={theme.colors.gray500}>Total Earnings</Text>
              <Text variant="subtitle" weight="bold" color={theme.colors.text}>
                ${earningsSummaryData?.total_earnings ?? 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Activity list */}
        <View style={styles.activityList}>
          <EarningsActivityRow
            items={earningsDailyData?.earnings_by_date ?? []}
            onPressItem={(item) =>
              navigation.navigate('EarningsOrderDetail', { date: item.date })
            }
          />
        </View>
      </ScrollView>

      {/* Calendar range picker */}
      <CalendarRangePicker
        visible={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        onApply={(r) => setRange(r)}
        initialRange={range}
      />
    </View>
  );
}

// ─── Filter icon ──────────────────────────────────────────────────────────────

function FilterIcon({ color }: { color: string }) {
  return (
    <View style={filterStyles.wrapper}>
      <View style={[filterStyles.line1, { backgroundColor: color }]} />
      <View style={[filterStyles.line2, { backgroundColor: color }]} />
      <View style={[filterStyles.line3, { backgroundColor: color }]} />
    </View>
  );
}

const filterStyles = StyleSheet.create({
  wrapper: { width: 20, height: 16, justifyContent: 'space-between' },
  line1: { height: 2, borderRadius: 1, width: '100%' },
  line2: { height: 2, borderRadius: 1, width: '70%', alignSelf: 'center' },
  line3: { height: 2, borderRadius: 1, width: '40%', alignSelf: 'center' },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  backChevron: {
    width: 10,
    height: 10,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
  },
  summaryCard: {
    margin: 16,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    gap: 4,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  activityList: {
    paddingHorizontal: 16,
  },
});
