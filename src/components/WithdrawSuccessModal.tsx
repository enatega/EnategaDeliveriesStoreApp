import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Text from './Text';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = {
  visible: boolean;
  onClose: () => void;
};

/**
 * Success confirmation modal shown after a withdrawal is submitted.
 */
export default function WithdrawSuccessModal({ visible, onClose }: Props) {
  const { theme } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* Card */}
      <View style={styles.centeredWrapper} pointerEvents="box-none">
        <View style={[styles.card, { backgroundColor: theme.colors.background }]}>
          {/* Close button */}
          <Pressable
            onPress={onClose}
            style={styles.closeBtn}
            accessibilityLabel="Close"
            hitSlop={8}
          >
            <View style={[styles.closeCircle, { borderColor: theme.colors.gray300 }]}>
              <Text color={theme.colors.text} style={styles.closeX}>✕</Text>
            </View>
          </Pressable>

          {/* Money bag emoji */}
          <Text style={styles.emoji}>💰</Text>

          {/* Title */}
          <Text
            variant="subtitle"
            weight="bold"
            color={theme.colors.text}
            style={styles.title}
          >
            Your request for withdrawal has been submitted
          </Text>

          {/* Subtitle */}
          <Text variant="body" color={theme.colors.mutedText} style={styles.subtitle}>
            Usually it takes 1-2 business days
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centeredWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    marginBottom: 4,
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
  emoji: {
    fontSize: 52,
    lineHeight: 64,
    textAlign: 'center',
    marginVertical: 4,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 26,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
  },
});
