import React from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useAppTheme } from "../theme/ThemeProvider";
import { useTranslations } from "../localization/LocalizationProvider";
import Text from "../components/Text";
import ToggleSwitch from "../components/ToggleSwitch";
import {
  useProfileQuery,
  useAvailabilityQuery,
} from "../hooks/useProfileQueries";
import { useUpdateAvailability } from "../hooks/useProfileMutations";

export default function ProfileScreen() {
  const { theme, themeMode, setThemeMode } = useAppTheme();
  const { t } = useTranslations("app");

  const { data: profileData, isLoading: profileLoading } = useProfileQuery();

  // ─── Availability (same pattern as sidebar) ────────────────────────────────
  const { data: availabilityData, isLoading: availabilityLoading } =
    useAvailabilityQuery();
  const updateAvailability = useUpdateAvailability();

  // Derive current availability
  const currentAvailability = availabilityData?.store_available ?? true;

  const handleAvailabilityToggle = (newValue: boolean) => {
    updateAvailability.mutate({ storeAvailable: newValue });
  };

  const isAvailabilityBusy =
    availabilityLoading || updateAvailability.isPending;

  // Loading state for profile data
  if (profileLoading || !profileData) {
    return (
      <View
        style={[
          styles.flex,
          styles.center,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const { profile, basicInformation, contactInformation } = profileData;

  // Compute initials from the profile name
  const initials = profile.name
    ? profile.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "JS";

  const coverImage = profile.image || null;
  const storeId = basicInformation.storeId
    ? basicInformation.storeId.length > 10
      ? basicInformation.storeId.substring(0, 10) + "..."
      : basicInformation.storeId
    : "";

  const isDark = themeMode === "dark";
  const toggleTheme = async () => setThemeMode(isDark ? "light" : "dark");

  const infoRows = [
    { label: t("profile_vehicle_plate"), value: "—" },
    { label: t("profile_address"), value: basicInformation.city ?? "—" },
    { label: t("profile_phone"), value: contactInformation.phoneNumber ?? "—" },
    { label: t("profile_username"), value: profile.email ?? "—" },
    { label: t("profile_wallet_balance"), value: "—" },
  ];

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Hero banner with avatar + availability ── */}
        <ImageBackground
          source={coverImage ? { uri: coverImage } : undefined}
          style={styles.heroBanner}
          imageStyle={styles.heroBannerImage}
        >
          <View style={styles.heroBannerOverlay} />

          <View style={styles.heroBottom}>
            {/* Avatar + name */}
            <View style={styles.heroLeft}>
              <View
                style={[
                  styles.avatarCircle,
                  { backgroundColor: theme.colors.background },
                ]}
              >
                <Text
                  variant="body"
                  weight="semiBold"
                  color={theme.colors.primary}
                >
                  {initials}
                </Text>
              </View>
              <View style={styles.nameBlock}>
                <Text variant="body" weight="semiBold" color="#FFFFFF">
                  {profile.name}
                </Text>
                <Text variant="caption" color="rgba(255,255,255,0.8)">
                  {storeId ?? ""}
                </Text>
              </View>
            </View>

            {/* Availability toggle (fully self‑contained) */}
            <View style={styles.availabilityBlock}>
              <Text
                variant="caption"
                color="#FFFFFF"
                style={styles.availabilityLabel}
              >
                {t("profile_availability")}
              </Text>
              <ToggleSwitch
                value={currentAvailability}
                onValueChange={
                  isAvailabilityBusy ? undefined : handleAvailabilityToggle
                }
                disabled={isAvailabilityBusy}
              />
              <Text variant="caption" color="rgba(255,255,255,0.8)">
                {availabilityLoading
                  ? t("loading")
                  : updateAvailability.isPending
                    ? t("updating")
                    : currentAvailability
                      ? t("available")
                      : t("unavailable")}
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* ── Info rows ── */}
        <View style={styles.section}>
          {/* Bank details header */}
          <View
            style={[styles.row, { borderBottomColor: theme.colors.gray300 }]}
          >
            <Text
              variant="caption"
              weight="semiBold"
              color={theme.colors.text}
              style={styles.rowLabel}
            >
              {t("profile_bank_details")}
            </Text>
            <Text variant="caption" color="#0EA5E9">
              {t("profile_updated")}
            </Text>
          </View>

          {infoRows.map((row) => (
            <View
              key={row.label}
              style={[styles.row, { borderBottomColor: theme.colors.gray300 }]}
            >
              <Text
                variant="caption"
                color={theme.colors.gray900}
                style={styles.rowLabel}
              >
                {row.label}
              </Text>
              <Text variant="caption" color="#868686">
                {row.value}
              </Text>
            </View>
          ))}

          {/* Theme toggle */}
          <View
            style={[styles.row, { borderBottomColor: theme.colors.gray300 }]}
          >
            <Text
              variant="caption"
              weight="semiBold"
              color={theme.colors.text}
              style={styles.rowLabel}
            >
              {t("profile_theme")}
            </Text>
            <ToggleSwitch value={isDark} onValueChange={toggleTheme} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  heroBanner: {
    height: 160,
    backgroundColor: "#374151",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  heroBannerImage: { resizeMode: "cover" },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  heroBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  nameBlock: { gap: 4 },
  availabilityBlock: {
    alignItems: "flex-end",
    gap: 4,
  },
  availabilityLabel: { fontSize: 12 },
  section: {
    paddingHorizontal: 15,
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    minHeight: 51,
  },
  rowLabel: { flex: 1 },
});
