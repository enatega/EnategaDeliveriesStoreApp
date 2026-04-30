import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import ToggleSwitch from './ToggleSwitch';
import { useAppTheme } from '../theme/ThemeProvider';

export type TimeSlot = {
  id: string;
  open: string;
  close: string;
};

type Props = {
  day: string;           // e.g. "MON"
  enabled: boolean;
  slots: TimeSlot[];
  onToggle: (enabled: boolean) => void;
  onSlotChange: (slotId: string, field: 'open' | 'close', value: string) => void;
  onAddSlot: () => void;
  onRemoveSlot: (slotId: string) => void;
};

/**
 * Card for a single day's work schedule.
 * Shows day label + toggle + time slot rows + add slot button.
 */
export default function DayScheduleCard({
  day,
  enabled,
  slots,
  onToggle,
  onSlotChange,
  onAddSlot,
  onRemoveSlot,
}: Props) {
  const { theme } = useAppTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.gray200 }]}>
      {/* Day label + toggle */}
      <View style={styles.header}>
        <Text variant="body" weight="bold" color={theme.colors.text} style={styles.dayLabel}>
          {day}
        </Text>
        <ToggleSwitch value={enabled} onValueChange={onToggle} />
      </View>

      {/* Time slots */}
      {enabled && (
        <View style={styles.slotsContainer}>
          {slots.map((slot) => (
            <View key={slot.id} style={styles.slotRow}>
              {/* Open time */}
              <Pressable
                style={[styles.timeBox, { borderColor: theme.colors.gray300, backgroundColor: theme.colors.background }]}
                onPress={() => {/* time picker will go here */}}
                accessibilityLabel={`${day} open time`}
              >
                <Text variant="body" color={theme.colors.text} style={styles.timeText}>
                  {slot.open}
                </Text>
              </Pressable>

              {/* Dash separator */}
              <View style={[styles.dash, { backgroundColor: theme.colors.gray400 }]} />

              {/* Close time */}
              <Pressable
                style={[styles.timeBox, { borderColor: theme.colors.gray300, backgroundColor: theme.colors.background }]}
                onPress={() => {/* time picker will go here */}}
                accessibilityLabel={`${day} close time`}
              >
                <Text variant="body" color={theme.colors.text} style={styles.timeText}>
                  {slot.close}
                </Text>
              </Pressable>

              {/* Add / remove slot button */}
              {slots.length > 1 ? (
                <Pressable
                  onPress={() => onRemoveSlot(slot.id)}
                  style={[styles.addBtn, { backgroundColor: '#EF4444' }]}
                  accessibilityLabel="Remove slot"
                >
                  <Text style={styles.addBtnText} color="#FFFFFF">−</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={onAddSlot}
                  style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}
                  accessibilityLabel="Add slot"
                >
                  <Text style={styles.addBtnText} color={theme.colors.gray900}>+</Text>
                </Pressable>
              )}
            </View>
          ))}

          {/* Extra add button when multiple slots exist */}
          {slots.length > 1 && (
            <Pressable
              onPress={onAddSlot}
              style={[styles.addExtraBtn, { borderColor: theme.colors.primary }]}
              accessibilityLabel="Add another slot"
            >
              <Text variant="caption" color={theme.colors.primary} weight="semiBold">
                + Add slot
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 15,
    letterSpacing: 0.5,
  },
  slotsContainer: {
    gap: 10,
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 15,
    textAlign: 'center',
  },
  dash: {
    width: 12,
    height: 2,
    borderRadius: 1,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '600',
  },
  addExtraBtn: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
});
