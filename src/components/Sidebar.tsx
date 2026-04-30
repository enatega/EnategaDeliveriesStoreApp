import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from './Text';
import ToggleSwitch from './ToggleSwitch';
import { useAppTheme } from '../theme/ThemeProvider';
import { useAuth } from '../auth/AuthProvider';
import { useLogoutMutation } from '../hooks/useAuthMutations';

// ─── Icons (inline SVG-free using View shapes) ───────────────────────────────

function IconBox({ children }: { children: React.ReactNode }) {
  return <View style={styles.iconBox}>{children}</View>;
}

function ChevronRight({ color }: { color: string }) {
  return (
    <View style={[styles.chevron, { borderColor: color }]} />
  );
}

// ─── Menu item types ──────────────────────────────────────────────────────────

type MenuItemBase = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

type MenuItemNav = MenuItemBase & { type: 'nav'; onPress: () => void };
type MenuItemToggle = MenuItemBase & {
  type: 'toggle';
  value: boolean;
  onToggle: (v: boolean) => void;
  subLabel?: string;
};
type MenuItem = MenuItemNav | MenuItemToggle;

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  onClose: () => void;
  availability: boolean;
  onAvailabilityChange: (v: boolean) => void;
  onNavigate: (screen: 'Language' | 'BankManagement' | 'WorkSchedule') => void;
  onSwitchTab?: (tab: 'Profile') => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

const DRAWER_WIDTH = 300;
const ANIMATION_DURATION = 280;

export default function Sidebar({
  visible,
  onClose,
  availability,
  onAvailabilityChange,
  onNavigate,
  onSwitchTab,
}: Props) {
  const { theme } = useAppTheme();
  const { session } = useAuth();
  const logoutMutation = useLogoutMutation();
  const insets = useSafeAreaInsets();

  // Keep drawer mounted while animating out
  const [mounted, setMounted] = useState(visible);

  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const animateOpen = useCallback(() => {
    // Reset to start position before mounting/animating
    translateX.setValue(-DRAWER_WIDTH);
    backdropOpacity.setValue(0);
    setMounted(true);
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateX, backdropOpacity]);

  const animateClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => setMounted(false));
  }, [translateX, backdropOpacity]);

  useEffect(() => {
    if (visible) {
      animateOpen();
    } else {
      animateClose();
    }
  }, [visible, animateOpen, animateClose]);

  if (!mounted) return null;

  const user = session.user;
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'JS';

  const menuItems: MenuItem[] = [
    {
      key: 'availability',
      type: 'toggle',
      label: 'Availability',
      icon: <ClockIcon />,
      value: availability,
      onToggle: onAvailabilityChange,
      subLabel: availability ? 'Available' : 'Unavailable',
    },
    {
      key: 'language',
      type: 'nav',
      label: 'Language',
      icon: <LanguageIcon />,
      onPress: () => { onClose(); onNavigate('Language'); },
    },
    {
      key: 'bank',
      type: 'nav',
      label: 'Bank Management',
      icon: <BankIcon />,
      onPress: () => { onClose(); onNavigate('BankManagement'); },
    },
    {
      key: 'schedule',
      type: 'nav',
      label: 'Work schedule',
      icon: <ScheduleIcon />,
      onPress: () => { onClose(); onNavigate('WorkSchedule'); },
    },
    {
      key: 'profile',
      type: 'nav',
      label: 'Profile',
      icon: <ProfileMenuIcon />,
      onPress: () => { onClose(); onSwitchTab?.('Profile'); },
    },
    {
      key: 'privacy',
      type: 'nav',
      label: 'Privacy Policy',
      icon: <ShieldIcon />,
      onPress: onClose,
    },
    {
      key: 'about',
      type: 'nav',
      label: 'About Us',
      icon: <InfoIcon />,
      onPress: onClose,
    },
    {
      key: 'help',
      type: 'nav',
      label: 'Help',
      icon: <HelpIcon />,
      onPress: onClose,
    },
    {
      key: 'logout',
      type: 'nav',
      label: 'Logout',
      icon: <LogoutIcon />,
      onPress: () => logoutMutation.mutate(),
    },
  ];

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, styles.container]} pointerEvents="box-none">
      {/* Animated backdrop */}
      <TouchableWithoutFeedback onPress={onClose} accessibilityLabel="Close sidebar">
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />
      </TouchableWithoutFeedback>

      {/* Animated drawer */}
      <Animated.View
        style={[
          styles.drawer,
          { backgroundColor: theme.colors.background, transform: [{ translateX }] },
        ]}
      >
        {/* Green header */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View style={styles.avatarCircle}>
            <Text variant="body" weight="semiBold" color={theme.colors.primary}>
              {initials}
            </Text>
          </View>
          <Text variant="subtitle" weight="bold" color="#FFFFFF" style={styles.userName}>
            {user?.name ?? 'John Smith'}
          </Text>
          <Text variant="caption" color="rgba(255,255,255,0.85)">
            ID-7853
          </Text>
        </View>

        {/* Menu list */}
        <ScrollView
          style={styles.menuScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.menuContent, { paddingBottom: insets.bottom + 24 }]}
        >
          {menuItems.map((item, idx) => (
            <View
              key={item.key}
              style={[
                styles.row,
                {
                  borderBottomColor: theme.colors.gray200,
                  borderBottomWidth: idx < menuItems.length - 1 ? 1 : 0,
                },
              ]}
            >
              <IconBox>{item.icon}</IconBox>

              <Text
                variant="body"
                weight="semiBold"
                color={theme.colors.text}
                style={styles.rowLabel}
              >
                {item.label}
              </Text>

              {item.type === 'toggle' ? (
                <View style={styles.toggleWrapper}>
                  <ToggleSwitch value={item.value} onValueChange={item.onToggle} />
                  {item.subLabel ? (
                    <Text variant="caption" color={theme.colors.mutedText}>
                      {item.subLabel}
                    </Text>
                  ) : null}
                </View>
              ) : (
                <Pressable
                  onPress={item.onPress}
                  style={StyleSheet.absoluteFill}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                />
              )}

              {item.type === 'nav' && <ChevronRight color={theme.colors.text} />}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─── Inline icon components ───────────────────────────────────────────────────

function ClockIcon() {
  return (
    <View style={iconStyles.base}>
      <View style={iconStyles.clockOuter} />
      <View style={iconStyles.clockHand} />
    </View>
  );
}

function LanguageIcon() {
  return (
    <View style={iconStyles.base}>
      <View style={iconStyles.langLine1} />
      <View style={iconStyles.langLine2} />
      <View style={iconStyles.langLine3} />
    </View>
  );
}

function BankIcon() {
  return (
    <View style={iconStyles.base}>
      <View style={iconStyles.bankTop} />
      <View style={iconStyles.bankBottom} />
    </View>
  );
}

function ScheduleIcon() {
  return (
    <View style={iconStyles.base}>
      <View style={iconStyles.scheduleOuter} />
      <View style={iconStyles.scheduleInner} />
    </View>
  );
}

function ProfileMenuIcon() {
  return (
    <View style={iconStyles.base}>
      <View style={iconStyles.profileHead} />
      <View style={iconStyles.profileBody} />
    </View>
  );
}

function ShieldIcon() {
  return (
    <View style={iconStyles.base}>
      <View style={iconStyles.shield} />
    </View>
  );
}

function InfoIcon() {
  return (
    <View style={iconStyles.base}>
      <View style={iconStyles.infoCircle} />
    </View>
  );
}

function HelpIcon() {
  return (
    <View style={iconStyles.base}>
      <View style={iconStyles.helpCircle} />
    </View>
  );
}

function LogoutIcon() {
  return (
    <View style={iconStyles.base}>
      <View style={iconStyles.logoutArrow} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    zIndex: 999,
    elevation: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 999,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 24,
  },
  header: {
    backgroundColor: '#90E36D',
    paddingBottom: 14,
    paddingHorizontal: 20,
    gap: 4,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    lineHeight: 20,
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
  },
  toggleWrapper: {
    alignItems: 'flex-end',
    gap: 2,
  },
  chevron: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
});

const iconStyles = StyleSheet.create({
  base: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Clock
  clockOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#374151',
    position: 'absolute',
  },
  clockHand: {
    width: 1.5,
    height: 5,
    backgroundColor: '#374151',
    position: 'absolute',
    top: 2,
    left: 9,
    borderRadius: 1,
  },
  // Language
  langLine1: { width: 14, height: 1.5, backgroundColor: '#374151', marginBottom: 2 },
  langLine2: { width: 10, height: 1.5, backgroundColor: '#374151', marginBottom: 2 },
  langLine3: { width: 14, height: 1.5, backgroundColor: '#374151' },
  // Bank
  bankTop: {
    width: 16,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 1,
    marginBottom: 2,
  },
  bankBottom: {
    width: 16,
    height: 8,
    borderWidth: 1.5,
    borderColor: '#374151',
    borderRadius: 1,
  },
  // Schedule
  scheduleOuter: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 1.5,
    borderColor: '#374151',
    position: 'absolute',
  },
  scheduleInner: {
    width: 8,
    height: 1.5,
    backgroundColor: '#374151',
    position: 'absolute',
    top: 9,
  },
  // Profile
  profileHead: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#374151',
    position: 'absolute',
    top: 0,
  },
  profileBody: {
    width: 14,
    height: 7,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderWidth: 1.5,
    borderColor: '#374151',
    position: 'absolute',
    bottom: 0,
  },
  // Shield
  shield: {
    width: 14,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#374151',
    borderRadius: 3,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  // Info
  infoCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#374151',
  },
  // Help
  helpCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#374151',
  },
  // Logout
  logoutArrow: {
    width: 12,
    height: 12,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#374151',
    transform: [{ rotate: '45deg' }],
  },
});
