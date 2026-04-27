import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Text from './Text';
import { useAppTheme } from '../theme/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary';

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
};

export default function Button({ label, onPress, variant = 'primary', disabled = false }: Props) {
  const { theme } = useAppTheme();

  const containerStyle: ViewStyle = {
    backgroundColor:
      variant === 'primary'
        ? theme.colors.primary
        : theme.isDark
          ? theme.colors.surface
          : theme.colors.white,
    borderColor: variant === 'secondary' ? theme.colors.border : theme.colors.primary,
    borderWidth: variant === 'secondary' ? 1 : 0,
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.container, containerStyle, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text
        variant="body"
        weight="semiBold"
        color={variant === 'primary' ? theme.colors.white : theme.colors.text}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.5,
  },
});
