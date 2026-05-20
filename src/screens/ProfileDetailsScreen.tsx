import React from "react";
import { Image, ImageBackground, ScrollView, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslations } from "../localization/LocalizationProvider";
import { useProfileQuery } from "../hooks/useProfileQueries";
import { useCurrencyFormatter } from "../hooks/useCurrency";
import Text from "../components/Text";
import ScreenHeader from "../components/ScreenHeader";
import { MainStackParamList } from "../navigation/types";
import { useAuth } from "../auth/AuthProvider";
const profileBackground = require("../assets/images/profileBackground.png");

export default function ProfileDetailsScreen() {
  const { t } = useTranslations("app");
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { data: profileData } = useProfileQuery();
  const { formatAmount } = useCurrencyFormatter();
  const { session } = useAuth();

  const city = profileData?.basicInformation.city?.trim() || t("profile_not_added");
  const phone = profileData?.contactInformation.phoneNumber?.trim() || t("profile_not_added");
  const username = profileData?.profile.name?.trim() || t("profile_not_added");
  const initials = profileData?.profile.name
    ? profileData.profile.name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
    : "SP";
  const vehiclePlate = t("profile_not_added");
  const profileName = profileData?.profile.name?.trim() || "John Smith";
  const storeId = profileData?.basicInformation.storeId || "7853";
  const profileImage = profileData?.profile.image?.trim() || "";
  const isApproved = profileData?.profile.approvalStatus === "approved";
  const coverSource = profileImage ? { uri: profileImage } : profileBackground;

  return (
    <View style={[styles.container, { backgroundColor: "#F3F4F6" }]}>
      <ScreenHeader title={t("profile_title")} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <ImageBackground source={coverSource} style={styles.cover} imageStyle={styles.coverImage}>
          <View style={styles.coverOverlay} />
          <View style={styles.heroRow}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImageFallback}>
                <Text weight="bold" style={styles.profileImageFallbackText}>
                  {initials}
                </Text>
              </View>
            )}
            <View style={styles.heroTextWrap}>
              <Text weight="semiBold" style={styles.heroName}>{profileName}</Text>
              <Text style={styles.heroId}>ID-{storeId.toString().slice(0, 4)}</Text>
            </View>
          </View>
          {isApproved ? (
            <View style={styles.verifiedPill}>
              <Feather name="check-circle" size={14} color="#111827" />
              <Text style={styles.verifiedText}>Verified Account</Text>
            </View>
          ) : null}
        </ImageBackground>

        <View style={styles.cardGroup}>
          <DetailRow icon="home" label={t("profile_bank_details")} value={t("profile_updated")} valuePill showDivider />
          {/* <DetailRow icon="truck" label={t("profile_vehicle_plate")} value={vehiclePlate} showDivider /> */}
          <DetailRow
            icon="map-pin"
            label={t("profile_address")}
            value={city}
            showDivider
          />
          <DetailRow
            icon="phone"
            label={t("profile_phone")}
            value={phone}
            showDivider
          />
          <DetailRow icon="user" label={t("profile_username")} value={username} showDivider />
          <DetailRow
            icon="credit-card"
            label={t("profile_wallet_balance")}
            value={formatAmount(0, 2)}
            valueHighlight
            showDivider
          />
        </View>
      </ScrollView>
    </View>
  );
}

type DetailRowProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: string;
  showDivider?: boolean;
  valuePill?: boolean;
  valueHighlight?: boolean;
  showChevron?: boolean;
};

function DetailRow({
  icon,
  label,
  value,
  showDivider = false,
  valuePill = false,
  valueHighlight = false,
  showChevron = false,
}: DetailRowProps) {
  return (
    <View style={[styles.row, showDivider ? styles.rowDivider : null]}>
      <View style={styles.iconCircle}>
        <Feather name={icon} size={18} color="#55C171" />
      </View>
      <Text weight="semiBold" style={styles.label}>{label}</Text>
      {valuePill ? (
        <View style={styles.updatedPill}>
          <Feather name="check-circle" size={12} color="#111827" />
          <Text style={styles.updatedPillText}>{value}</Text>
        </View>
      ) : (
        <View style={styles.valueWrap}>
          <Text style={[styles.value, valueHighlight ? styles.valueHighlight : null]} numberOfLines={1}>{value}</Text>
          {showChevron ? <Feather name="chevron-right" size={20} color="#111827" /> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: 28 },
  cover: {
    height: 250,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  coverImage: {
    resizeMode: "cover",
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 24, 39, 0.42)",
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 12,
  },
  heroTextWrap: {
    gap: 2,
  },
  heroName: {
    fontSize: 18,
    lineHeight: 28,
    color: "#FFFFFF",
  },
  heroId: {
    fontSize: 16,
    lineHeight: 34,
    color: "#FFFFFF",
  },
  profileImage: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#E5E7EB",
  },
  profileImageFallback: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageFallbackText: {
    fontSize: 22,
    color: "#90E36D",
  },
  verifiedPill: {
    alignSelf: "flex-start",
    backgroundColor: "#90E36D",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 14,
    lineHeight: 18,
    color: "#111827",
    fontWeight: "500",
  },
  cardGroup: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    overflow: "hidden",
    paddingHorizontal: 18,
    paddingTop: 8,
    marginHorizontal: 10,
    marginTop: 18,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    minHeight: 88,
    paddingVertical: 16,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 24,
    backgroundColor: "rgba(144,227,109,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: { flex: 1, fontSize: 14, lineHeight: 20, color: "#111827" },
  valueWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    maxWidth: 176,
    marginLeft: 8,
  },
  value: { maxWidth: 128, fontSize: 13, lineHeight: 18, color: "#6B7280", textAlign: "right" },
  valueHighlight: { color: "#90E36D", fontWeight: "600" },
  updatedPill: {
    backgroundColor: "#90E36D",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  updatedPillText: { fontSize: 13, lineHeight: 18, color: "#111827", fontWeight: "500" },
});
