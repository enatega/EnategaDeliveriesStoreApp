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
  const rawId = basicInformation.storeId ?? profile.id ?? "";
  const compactId = rawId
    ? rawId.length > 8
      ? rawId.substring(0, 8)
      : rawId
    : "";
  const profileId = compactId ? `ID-${compactId}` : "ID-0000";

  const isDark = themeMode === "dark";
  const toggleTheme = async () => setThemeMode(isDark ? "light" : "dark");

  const infoRows = [
    { label: t("profile_vehicle_plate"), value: undefined as string | undefined },
    { label: t("profile_address"), value: basicInformation.city },
    { label: t("profile_phone"), value: contactInformation.phoneNumber },
    { label: t("profile_username"), value: profile.email },
    { label: "Password", value: undefined as string | undefined },
    { label: t("profile_wallet_balance"), value: undefined as string | undefined },
  ].filter((row) => {
    const value = (row.value ?? "").toString().trim();
    return value.length > 0;
  });

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.gray50 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <ImageBackground
            source={coverImage ? { uri: coverImage } : undefined}
            style={[
              styles.heroBanner,
              !coverImage && { backgroundColor: theme.colors.gray600 },
            ]}
            imageStyle={styles.heroBannerImage}
          >
            <View style={styles.heroBannerOverlay} />
            <View style={styles.heroCenteredContent}>
              <View style={styles.heroLeft}>
                <View
                  style={[
                    styles.avatarCircle,
                    { backgroundColor: theme.colors.surface },
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
                  <Text
                    variant="body"
                    weight="semiBold"
                    color={theme.colors.white}
                    style={styles.profileName}
                  >
                    {profile.name}
                  </Text>
                  <Text
                    variant="caption"
                    color="rgba(253,253,253,0.99)"
                    style={styles.profileId}
                  >
                    {profileId}
                  </Text>
                </View>
              </View>

              <View style={styles.availabilityBlock}>
                <Text
                  variant="caption"
                  color={theme.colors.white}
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
              </View>
            </View>
          </ImageBackground>
        </View>

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
            <Text variant="caption" color="#0EA5E9" style={styles.updatedText}>
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
                style={[styles.rowLabel, styles.rowKeyText]}
              >
                {row.label}
              </Text>
              <Text variant="caption" color="#868686" style={styles.rowValueText}>
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
  heroSection: {
    marginBottom: 10,
  },
  heroBanner: {
    height: 206,
    width: "100%",
    backgroundColor: "#374151",
  },
  heroBannerImage: { resizeMode: "cover" },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroCenteredContent: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 120,
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
  profileName: {
    fontSize: 17,
    lineHeight: 24,
  },
  profileId: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  availabilityBlock: {
    alignItems: "flex-end",
    gap: 4,
  },
  availabilityLabel: { fontSize: 14, lineHeight: 20, fontWeight: "500" },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
  rowKeyText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  rowValueText: {
    fontSize: 12,
    lineHeight: 16,
  },
  updatedText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
});
