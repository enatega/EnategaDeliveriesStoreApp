import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import Button from './Button';
import { useAppTheme } from '../theme/ThemeProvider';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

type DateRange = { start: Date; end: Date };

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: (range: DateRange) => void;
  initialRange?: DateRange;
};

/**
 * Calendar range picker modal.
 * Select a start date, then select an end date to highlight the full range.
 */
export default function CalendarRangePicker({ visible, onClose, onApply, initialRange }: Props) {
  const { theme } = useAppTheme();

  const today = new Date();
  const [viewYear, setViewYear] = useState(initialRange?.start.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialRange?.start.getMonth() ?? today.getMonth());
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(initialRange ?? null);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  

  const prevMonth = () => {
    setSelectedRange(null);
    setRangeStart(null);
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    setSelectedRange(null);
    setRangeStart(null);
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  // Build calendar grid — 6 rows × 7 cols
  const buildGrid = (): (Date | null)[][] => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const cells: (Date | null)[] = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push(new Date(viewYear, viewMonth - 1, prevMonthDays - i));
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(new Date(viewYear, viewMonth, d));
    }
    // Next month padding
    while (cells.length % 7 !== 0) {
      cells.push(new Date(viewYear, viewMonth + 1, cells.length - firstDay - daysInMonth + 1));
    }

    const rows: (Date | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  };

  const handleDayPress = (date: Date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    if (!isCurrentMonth(start)) return;

    if (!rangeStart) {
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      setRangeStart(start);
      setSelectedRange({ start, end });
      return;
    }

    const normalizedStart = rangeStart <= start ? rangeStart : start;
    const normalizedEnd = rangeStart <= start ? start : rangeStart;
    const end = new Date(normalizedEnd);
    end.setHours(23, 59, 59, 999);

    setSelectedRange({ start: normalizedStart, end });
    setRangeStart(null);
  };

  const isInRange = (date: Date): boolean => {
    if (!selectedRange) return false;
    return isCurrentMonth(date) && date >= selectedRange.start && date <= selectedRange.end;
  };

  const isRangeStart = (date: Date): boolean => {
    if (!selectedRange) return false;
    return isCurrentMonth(date) && date.toDateString() === selectedRange.start.toDateString();
  };

  const isRangeEnd = (date: Date): boolean => {
    if (!selectedRange) return false;
    return isCurrentMonth(date) && date.toDateString() === selectedRange.end.toDateString();
  };

  const isCurrentMonth = (date: Date): boolean => date.getMonth() === viewMonth;

  const grid = buildGrid();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
          {/* Close button */}
          <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close calendar">
            <View style={[styles.closeCircle, { borderColor: theme.colors.gray300 }]}>
              <Text color={theme.colors.text} style={styles.closeX}>✕</Text>
            </View>
          </Pressable>

          {/* Month navigation */}
          <View style={styles.monthNav}>
            <Pressable onPress={prevMonth} hitSlop={12} accessibilityLabel="Previous month">
              <Text style={styles.navArrow} color={theme.colors.gray500}>{'<'}</Text>
            </Pressable>
            <Text variant="body" weight="bold" color={theme.colors.text}>
              {MONTHS[viewMonth]}
            </Text>
            <Pressable onPress={nextMonth} hitSlop={12} accessibilityLabel="Next month">
              <Text style={styles.navArrow} color={theme.colors.gray500}>{'>'}</Text>
            </Pressable>
          </View>

          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {DAYS.map((d, i) => (
              <Text key={i} variant="caption" color={theme.colors.gray400} style={styles.dayHeader}>
                {d}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          {grid.map((row, rowIdx) => (
            <View key={rowIdx} style={styles.week}>
              {row.map((date, colIdx) => {
                if (!date) return <View key={colIdx} style={styles.dayCell} />;

                const inRange = isInRange(date);
                const isStart = isRangeStart(date);
                const isEnd = isRangeEnd(date);
                const isCurrent = isCurrentMonth(date);

                return (
                  <Pressable
                    key={colIdx}
                    onPress={() => handleDayPress(date)}
                    disabled={!isCurrent}
                    style={[
                      styles.dayCell,
                      inRange && styles.inRangeCell,
                      inRange && { backgroundColor: theme.colors.primary },
                      isStart && styles.rangeStart,
                      isEnd && styles.rangeEnd,
                    ]}
                    accessibilityLabel={date.toDateString()}
                  >
                    <Text
                      variant="body"
                      color={inRange ? '#111827' : isCurrent ? theme.colors.text : theme.colors.gray400}
                      weight={inRange ? 'semiBold' : 'regular'}
                      style={styles.dayText}
                    >
                      {date.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}

          {/* Apply button */}
          <View style={styles.applyBtn}>
            <Button
              label="Apply"
              onPress={() => {
                if (selectedRange) onApply(selectedRange);
                onClose();
              }}
              disabled={!selectedRange}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    paddingTop: 16,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: {
    fontSize: 14,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  navArrow: {
    fontSize: 18,
    fontWeight: '600',
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
  },
  week: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  dayCell: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inRangeCell: {
    borderRadius: 0,
  },
  rangeStart: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  rangeEnd: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  dayText: {
    fontSize: 16,
  },
  applyBtn: {
    marginTop: 20,
  },
});
