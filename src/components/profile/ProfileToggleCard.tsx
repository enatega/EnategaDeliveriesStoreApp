import React from "react";
import { Feather } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useAppTheme } from "../../theme/ThemeProvider";
import Text from "../Text";

type Props = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
  rightContent: React.ReactNode;
  children?: React.ReactNode;
};

export default function ProfileToggleCard({
  icon,
  title,
  subtitle,
  rightContent,
  children,
}: Props) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: theme.colors.gray300,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.left}>
          <View style={[styles.iconCircle, { backgroundColor: theme.colors.tertiary }]}>
            <Feather name={icon} size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.textWrap}>
            <Text weight="semiBold" style={styles.title}>
              {title}
            </Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.right}>{rightContent}</View>
      </View>
      {children ? <View style={styles.expandedContent}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  right: {
    alignItems: "center",
    gap: 6,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    lineHeight: 20,
    color: "#111827",
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6B7280",
  },
  expandedContent: {
    gap: 12,
  },
});
