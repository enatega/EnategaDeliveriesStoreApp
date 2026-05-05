import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../theme/ThemeProvider';
import { MainStackParamList } from '../navigation/types';
import BarChart, { BarChartDataPoint } from '../components/BarChart';
import EarningsActivityRow from '../components/EarningsActivityRow';
import Text from '../components/Text';
import { useEarningsDailyQuery, useEarningsGraphQuery } from '../hooks/useEarningsQueries';

type Props = NativeStackScreenProps<MainStackParamList, 'EarningsDetail'> | { navigation?: any };

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EarningsScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { data: earningsGraphData } = useEarningsGraphQuery({
    params: { page: 1, limit: 10 },
  });

  const chartData = useMemo<BarChartDataPoint[]>(
    () =>
      earningsGraphData?.graph.map((item) => ({
        label: item.label.replace(' - ', '-\n'),
        value: item.total_amount,
        displayValue: `$${item.total_amount}`,
      })) ?? [],
    [earningsGraphData],
  );
  const { data: earningsDailyData } = useEarningsDailyQuery({
    params: { page: 1, limit: 10 },
  });

  const handleSeeMore = () => navigation?.navigate?.('EarningsDetail');
  const handleRowPress = (item: { date: string }) =>
    navigation?.navigate?.('EarningsOrderDetail', { date: item.date });

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Bar chart */}
      <View style={styles.chartSection}>
        <BarChart data={chartData} height={200} />
      </View>

      {/* Recent Activity header */}
      <View style={styles.sectionHeader}>
        <Text variant="subtitle" weight="bold" color={theme.colors.text}>
          Recent Activity
        </Text>
        <Pressable onPress={handleSeeMore} accessibilityRole="button">
          <Text variant="body" color="#0EA5E9">
            See More
          </Text>
        </Pressable>
      </View>

      {/* Activity rows */}
      <View style={styles.activityList}>
        <EarningsActivityRow
          items={earningsDailyData?.earnings_by_date ?? []}
          onPressItem={handleRowPress}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 32,
  },
  chartSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  activityList: {
    paddingHorizontal: 16,
  },
});
