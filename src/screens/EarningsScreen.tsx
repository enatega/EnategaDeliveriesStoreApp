import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppTheme } from '../theme/ThemeProvider';
import { MainStackParamList } from '../navigation/types';
import BarChart, { BarChartDataPoint } from '../components/BarChart';
import EarningsActivityRow from '../components/EarningsActivityRow';
import Text from '../components/Text';

type Props = NativeStackScreenProps<MainStackParamList, 'EarningsDetail'> | { navigation?: any };

// ─── Dummy data ───────────────────────────────────────────────────────────────

const CHART_DATA: BarChartDataPoint[] = [
  { label: '23 Jan-\n29 Jan', value: 200, displayValue: '$200' },
  { label: '23 Jan-\n29 Jan', value: 400, displayValue: '$400' },
  { label: '23 Jan-\n29 Jan', value: 600, displayValue: '$600' },
  { label: '23 Jan-\n29 Jan', value: 300, displayValue: '$300' },
];

const ACTIVITY_DATA = [
  { id: '1', date: '20.02.2023', label: 'Total Earning', amount: '$600' },
  { id: '2', date: '20.02.2023', label: 'Total Earning', amount: '$100' },
  { id: '3', date: '20.02.2023', label: 'Total Earning', amount: '$100' },
  { id: '4', date: '20.02.2023', label: 'Total Earning', amount: '$100' },
  { id: '5', date: '20.02.2023', label: 'Total Earning', amount: '$100' },
  { id: '6', date: '20.02.2023', label: 'Total Earning', amount: '$100' },
  { id: '7', date: '20.02.2023', label: 'Total Earning', amount: '$100' },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function EarningsScreen({ navigation }: any) {
  const { theme } = useAppTheme();

  const handleSeeMore = () => navigation?.navigate?.('EarningsDetail');
  const handleRowPress = () => navigation?.navigate?.('EarningsOrderDetail');

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Bar chart */}
      <View style={styles.chartSection}>
        <BarChart data={CHART_DATA} height={200} />
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
        {ACTIVITY_DATA.map((item) => (
          <EarningsActivityRow
            key={item.id}
            date={item.date}
            label={item.label}
            amount={item.amount}
            onPress={handleRowPress}
          />
        ))}
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
