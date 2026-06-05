import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAppTheme } from "../theme/ThemeProvider";
import { useTranslations } from "../localization/LocalizationProvider";
import Text from "../components/Text";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import ToggleSwitch from "../components/ToggleSwitch";
import ProfileToggleCard from "../components/profile/ProfileToggleCard";
import { useProfileQuery, useAvailabilityQuery } from "../hooks/useProfileQueries";
import { useUpdateAvailability, useUpdateInstantDelivery } from "../hooks/useProfileMutations";
import { useLogoutMutation } from "../hooks/useAuthMutations";
import { MainStackParamList } from "../navigation/types";

function withAlpha(hexColor: string, alphaHex: string) {
  if (!/^#([0-9A-F]{6})$/i.test(hexColor)) {
    return hexColor;
  }

  return `${hexColor}${alphaHex}`;
}

export default function ProfileScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslations("app");
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const { data: profileData, isLoading: profileLoading } = useProfileQuery();
  const { data: availabilityData, isLoading: availabilityLoading } = useAvailabilityQuery();
  const updateAvailability = useUpdateAvailability();
  const [instantDeliveryEnabled, setInstantDeliveryEnabled] = useState(false);
  const [instantDeliveryDays, setInstantDeliveryDays] = useState("");
  const [instantDeliveryError, setInstantDeliveryError] = useState("");
  const updateInstantDelivery = useUpdateInstantDelivery({
    onError: () => {
      setInstantDeliveryEnabled(profileData?.profile.isInstantDelivery ?? false);
    },
  });
  const logoutMutation = useLogoutMutation();

  const serverInstantDeliveryEnabled = profileData?.profile.isInstantDelivery ?? false;
  const serverInstantDeliveryDays =
    profileData?.profile.instantDeliveryTime !== null &&
    profileData?.profile.instantDeliveryTime !== undefined
      ? String(profileData.profile.instantDeliveryTime)
      : "";

  useEffect(() => {
    setInstantDeliveryEnabled(serverInstantDeliveryEnabled);
  }, [serverInstantDeliveryEnabled]);

  useEffect(() => {
    setInstantDeliveryDays(serverInstantDeliveryDays);
  }, [serverInstantDeliveryDays]);

  useEffect(() => {
    if (instantDeliveryEnabled) {
      setInstantDeliveryError("");
    }
  }, [instantDeliveryEnabled]);

  if (profileLoading || !profileData) {
    return (
      <View style={[styles.flex, styles.center, { backgroundColor: "#F3F4F6" }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const { profile, basicInformation } = profileData;
  const initials = profile.name
    ? profile.name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
    : "JS";

  const currentAvailability = availabilityData?.store_available ?? true;
  const isAvailabilityBusy = availabilityLoading || updateAvailability.isPending;
  const isInstantDeliveryBusy = updateInstantDelivery.isPending;

  const handleInstantDeliveryToggle = (newValue: boolean) => {
    console.log("[ProfileScreen] instant delivery toggle", {
      nextValue: newValue,
      currentServerValue: serverInstantDeliveryEnabled,
      currentInputDays: instantDeliveryDays,
    });
    setInstantDeliveryError("");
    setInstantDeliveryEnabled(newValue);

    if (newValue) {
      console.log("[ProfileScreen] instant delivery payload", {
        is_instant_delivery: true,
        instant_delivery_time: null,
      });
      updateInstantDelivery.mutate({
        isInstantDelivery: true,
        instantDeliveryTime: null,
      });
      return;
    }

    if (!instantDeliveryDays.trim()) {
      setInstantDeliveryDays(serverInstantDeliveryDays || "1");
    }
  };

  const handleInstantDeliverySave = () => {
    const parsedDays = Number.parseInt(instantDeliveryDays.trim(), 10);
    console.log("[ProfileScreen] instant delivery save attempt", {
      rawDays: instantDeliveryDays,
      parsedDays,
    });

    if (!Number.isFinite(parsedDays) || parsedDays <= 0) {
      console.log("[ProfileScreen] instant delivery validation failed", {
        rawDays: instantDeliveryDays,
        parsedDays,
      });
      setInstantDeliveryError(t("profile_instant_delivery_days_error"));
      return;
    }

    setInstantDeliveryError("");
    console.log("[ProfileScreen] instant delivery payload", {
      is_instant_delivery: false,
      instant_delivery_time: parsedDays,
    });
    updateInstantDelivery.mutate({
      isInstantDelivery: false,
      instantDeliveryTime: parsedDays,
    });
  };

  const openExternalUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Unable to open link", url);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("Unable to open link", url);
    }
  };

  const menuPrimary = [
    {
      key: "language",
      icon: "globe",
      title: t("profile_language"),
      subtitle: t("profile_language_subtitle"),
      onPress: () => navigation.navigate("Language"),
    },
    {
      key: "bank",
      icon: "credit-card",
      title: t("profile_bank_management"),
      subtitle: t("profile_bank_management_subtitle"),
      onPress: () => navigation.navigate("BankManagement"),
    },
    {
      key: "schedule",
      icon: "clock",
      title: t("profile_work_schedule"),
      subtitle: t("profile_work_schedule_subtitle"),
      onPress: () => navigation.navigate("WorkSchedule"),
    },
    {
      key: "scheduled-orders",
      icon: "list",
      title: t("profile_scheduled_orders"),
      subtitle: t("profile_scheduled_orders_subtitle"),
      onPress: () => navigation.navigate("ScheduledOrders"),
    },
  ] as const;

  const menuSecondary = [
    {
      key: "privacy",
      icon: "shield",
      title: t("profile_privacy_policy"),
      subtitle: t("profile_privacy_policy_subtitle"),
      onPress: () => openExternalUrl("https://multivendor.enatega.com/terms"),
    },
    {
      key: "about",
      icon: "info",
      title: t("profile_about_us"),
      subtitle: t("profile_about_us_subtitle"),
      onPress: () => openExternalUrl("https://multivendor.enatega.com/about"),
    },
    {
      key: "help",
      icon: "help-circle",
      title: t("profile_help"),
      subtitle: t("profile_help_subtitle"),
      onPress: () => openExternalUrl("https://ninjascode.com/"),
    },
  ] as const;

  return (
    <View style={[styles.flex, { backgroundColor: theme.colors.gray50 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.hero, { backgroundColor: theme.colors.primary }]}>
          <View
            style={[
              styles.heroShapeLarge,
              { backgroundColor: withAlpha(theme.colors.secondary, "22") },
            ]}
          />
          <View style={styles.profileRow}>
            {profile.image?.trim() ? (
              <Image source={{ uri: profile.image }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text weight="semiBold" color={theme.colors.primary} style={styles.avatarText}>
                  {initials}
                </Text>
              </View>
            )}
            <View style={styles.profileTextWrap}>
              <Text weight="semiBold" style={styles.profileName}>
                {profile.name}
              </Text>
              <Text style={styles.profileId}>ID-{(basicInformation.storeId ?? "7853").toString().slice(0, 4)}</Text>
            </View>
          </View>
        </View>

        <ProfileToggleCard
          icon="clock"
          title={t("profile_availability")}
          subtitle={t("profile_availability_subtitle")}
          rightContent={
            <>
              <ToggleSwitch
                value={currentAvailability}
                onValueChange={(newValue) => updateAvailability.mutate({ storeAvailable: newValue })}
                disabled={isAvailabilityBusy}
              />
              <Text style={styles.availableText}>
                {currentAvailability ? t("Available") : t("Unavailable")}
              </Text>
            </>
          }
        />

        <ProfileToggleCard
          icon="zap"
          title={t("profile_instant_delivery")}
          subtitle={t("profile_instant_delivery_subtitle")}
          rightContent={
            <>
              <ToggleSwitch
                value={instantDeliveryEnabled}
                onValueChange={handleInstantDeliveryToggle}
                disabled={isInstantDeliveryBusy}
              />
              <Text style={styles.availableText}>
                {instantDeliveryEnabled
                  ? t("profile_instant_delivery_on")
                  : t("profile_instant_delivery_off")}
              </Text>
            </>
          }
        >
          {!instantDeliveryEnabled ? (
            <View style={styles.instantDeliveryExpanded}>
              <TextInput
                label={t("profile_instant_delivery_days_label")}
                value={instantDeliveryDays}
                onChangeText={(value) => {
                  setInstantDeliveryDays(value.replace(/[^0-9]/g, ""));
                  if (instantDeliveryError) {
                    setInstantDeliveryError("");
                  }
                }}
                keyboardType="number-pad"
                placeholder={t("profile_instant_delivery_days_placeholder")}
                error={instantDeliveryError}
                editable={!isInstantDeliveryBusy}
              />
              <Button
                label={t("profile_update")}
                onPress={handleInstantDeliverySave}
                loading={isInstantDeliveryBusy}
                disabled={isInstantDeliveryBusy}
              />
            </View>
          ) : null}
        </ProfileToggleCard>

        <Text weight="medium" style={styles.sectionTitle}>
          {t("profile_account_settings")}
        </Text>

        <View style={styles.cardGroup}>
          <Pressable
            style={[styles.menuRow, styles.menuRowDivider]}
            onPress={() => navigation.navigate("ProfileDetails")}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.colors.tertiary }]}>
              <Feather name="user" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.menuTextWrap}>
              <Text weight="semiBold" style={styles.menuTitle}>
                {t("profile_user_profile")}
              </Text>
              <Text style={styles.menuSubtitle}>{t("profile_user_profile_subtitle")}</Text>
            </View>
            <Feather name="chevron-right" size={20} color="#111827" />
          </Pressable>

          {menuPrimary.map((item, index) => (
            <MenuRow
              key={item.key}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={item.onPress}
              showDivider={index < menuPrimary.length - 1}
            />
          ))}
        </View>

        <View style={styles.cardGroup}>
          {menuSecondary.map((item, index) => (
            <MenuRow
              key={item.key}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              onPress={item.onPress}
              showDivider={index < menuSecondary.length - 1}
            />
          ))}
        </View>

        <Pressable
          style={styles.logoutCard}
          onPress={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <View style={styles.iconCircleDanger}>
            <Feather name="log-out" size={18} color="#EF4444" />
          </View>
          <View style={styles.menuTextWrap}>
            <Text weight="semiBold" style={styles.logoutTitle}>
              {t("auth_logout")}
            </Text>
            <Text style={styles.menuSubtitle}>{t("profile_logout_subtitle")}</Text>
          </View>
          <Feather name="chevron-right" size={20} color="#111827" />
        </Pressable>
      </ScrollView>
    </View>
  );
}

type MenuRowProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
  onPress?: (() => void) | undefined;
  showDivider?: boolean;
};

function MenuRow({ icon, title, subtitle, onPress, showDivider = false }: MenuRowProps) {
  const { theme } = useAppTheme();

  return (
    <Pressable onPress={onPress} style={[styles.menuRow, showDivider ? styles.menuRowDivider : null]}>
      <View style={[styles.iconCircle, { backgroundColor: theme.colors.tertiary }]}>
        <Feather name={icon} size={18} color={theme.colors.primary} />
      </View>
      <View style={styles.menuTextWrap}>
        <Text weight="semiBold" style={styles.menuTitle}>
          {title}
        </Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color="#111827" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { justifyContent: "center", alignItems: "center" },
  contentContainer: {
    paddingBottom: 120,
    gap: 12,
  },
  hero: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    height: 150,
    justifyContent: "center",
    paddingHorizontal: 16,
    overflow: "hidden",
    marginTop: 6,
  },
  heroShapeLarge: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    right: -60,
    top: 36,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    zIndex: 1,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
  },
  avatarText: {
    fontSize: 16,
    lineHeight: 24,
  },
  profileTextWrap: {
    gap: 4,
  },
  profileName: {
    fontSize: 16,
    lineHeight: 24,
    color: "#111827",
  },
  profileId: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
    fontWeight: "500",
  },
  availableText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#4B5563",
  },
  instantDeliveryExpanded: {
    gap: 12,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
  cardGroup: {
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
  },
  menuRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleDanger: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(239,68,68,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextWrap: {
    flex: 1,
    gap: 4,
  },
  menuTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#111827",
  },
  menuSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: "#6B7280",
  },
  logoutCard: {
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FEF2F2",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  logoutTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#EF4444",
  },
});
