import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../theme/ThemeProvider';
import { MainStackParamList } from '../navigation/types';
import ScreenHeader from '../components/ScreenHeader';
import DayScheduleCard, { TimeSlot } from '../components/DayScheduleCard';
import Button from '../components/Button';

type Props = NativeStackScreenProps<MainStackParamList, 'WorkSchedule'>;

// ─── Types ────────────────────────────────────────────────────────────────────

type DayKey = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

type DaySchedule = {
  key: DayKey;
  enabled: boolean;
  slots: TimeSlot[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

let slotCounter = 100;
const newSlotId = () => String(++slotCounter);

const defaultSlot = (): TimeSlot => ({
  id: newSlotId(),
  open: '00:00',
  close: '23:59',
});

// ─── Initial dummy data (matches Figma — all days enabled, one slot each) ────

const INITIAL_SCHEDULE: DaySchedule[] = [
  { key: 'MON', enabled: true,  slots: [{ id: '1', open: '00:00', close: '23:59' }] },
  { key: 'TUE', enabled: true,  slots: [{ id: '2', open: '00:00', close: '23:59' }] },
  { key: 'WED', enabled: true,  slots: [{ id: '3', open: '00:00', close: '23:59' }] },
  { key: 'THU', enabled: true,  slots: [{ id: '4', open: '00:00', close: '23:59' }] },
  { key: 'FRI', enabled: true,  slots: [{ id: '5', open: '00:00', close: '23:59' }] },
  { key: 'SAT', enabled: false, slots: [{ id: '6', open: '00:00', close: '23:59' }] },
  { key: 'SUN', enabled: false, slots: [{ id: '7', open: '00:00', close: '23:59' }] },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function WorkScheduleScreen({ navigation }: Props) {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [saving, setSaving] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const toggleDay = (key: DayKey, enabled: boolean) => {
    setSchedule((prev) =>
      prev.map((d) => (d.key === key ? { ...d, enabled } : d))
    );
  };

  const updateSlot = (
    dayKey: DayKey,
    slotId: string,
    field: 'open' | 'close',
    value: string
  ) => {
    setSchedule((prev) =>
      prev.map((d) =>
        d.key === dayKey
          ? {
              ...d,
              slots: d.slots.map((s) =>
                s.id === slotId ? { ...s, [field]: value } : s
              ),
            }
          : d
      )
    );
  };

  const addSlot = (dayKey: DayKey) => {
    setSchedule((prev) =>
      prev.map((d) =>
        d.key === dayKey
          ? { ...d, slots: [...d.slots, defaultSlot()] }
          : d
      )
    );
  };

  const removeSlot = (dayKey: DayKey, slotId: string) => {
    setSchedule((prev) =>
      prev.map((d) =>
        d.key === dayKey
          ? { ...d, slots: d.slots.filter((s) => s.id !== slotId) }
          : d
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // API integration will be wired here
    setTimeout(() => {
      setSaving(false);
      navigation.goBack();
    }, 800);
  };

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader title="Work Schedule" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {schedule.map((day) => (
          <DayScheduleCard
            key={day.key}
            day={day.key}
            enabled={day.enabled}
            slots={day.slots}
            onToggle={(enabled) => toggleDay(day.key, enabled)}
            onSlotChange={(slotId, field, value) =>
              updateSlot(day.key, slotId, field, value)
            }
            onAddSlot={() => addSlot(day.key)}
            onRemoveSlot={(slotId) => removeSlot(day.key, slotId)}
          />
        ))}
      </ScrollView>

      {/* Sticky footer */}
      <View style={[styles.footer, { backgroundColor: theme.colors.background, borderTopColor: theme.colors.gray200, paddingBottom: insets.bottom + 16 }]}>
        <Button
          label="Update Schedule"
          onPress={handleSave}
          loading={saving}
          disabled={saving}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
});
