import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';

export type TabKey = 'Home' | 'Wallet' | 'Earnings' | 'Profile';

type Tab = {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
};

type Props = {
  tabs: Tab[];
  activeTab: TabKey;
  onTabPress: (key: TabKey) => void;
};

export default function BottomTabBar({ tabs, activeTab, onTabPress }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onTabPress(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
          >
            <View style={styles.iconWrapper}>{tab.icon}</View>
            <Text
              variant="caption"
              style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tab: {
    alignItems: 'center',
    gap: 7,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
  },
  labelActive: {
    color: '#90E36D',
  },
  labelInactive: {
    color: '#9CA3AF',
  },
});
