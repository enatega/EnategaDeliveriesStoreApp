import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslations } from "../localization/LocalizationProvider";
import { useProfileQuery } from "../hooks/useProfileQueries";
import { useCurrencyFormatter } from "../hooks/useCurrency";
import Text from "../components/Text";
import ScreenHeader from "../components/ScreenHeader";
import { MainStackParamList } from "../navigation/types";

export default function ProfileDetailsScreen() {
  const { t } = useTranslations("app");
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { data: profileData } = useProfileQuery();
  const { formatAmount } = useCurrencyFormatter();

  const city = profileData?.basicInformation.city?.trim() || "-";
  const phone = profileData?.contactInformation.phoneNumber?.trim() || "-";
  const username = profileData?.profile.email || "-";
  const vehiclePlate = "";
  const showVehiclePlate = Boolean(vehiclePlate.trim());

  return (
    <View style={[styles.container, { backgroundColor: "#F3F4F6" }]}>
      <ScreenHeader title={t("profile_user_profile")} onBack={() => navigation.goBack()} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.cardGroup}>
          <DetailRow icon="home" label={t("profile_bank_details")} value={t("profile_updated")} valuePill showDivider />
          {showVehiclePlate ? (
            <DetailRow icon="truck" label={t("profile_vehicle_plate")} value={vehiclePlate} showDivider />
          ) : null}
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
};

function DetailRow({ icon, label, value, showDivider = false, valuePill = false, valueHighlight = false }: DetailRowProps) {
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
        <Text style={[styles.value, valueHighlight ? styles.valueHighlight : null]} numberOfLines={1}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  cardGroup: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: "#E5E7EB" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(144,227,109,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  label: { flex: 1, fontSize: 14, lineHeight: 20, color: "#111827" },
  value: { maxWidth: 120, fontSize: 12, lineHeight: 16, color: "#6B7280", textAlign: "right" },
  valueHighlight: { color: "#90E36D", fontWeight: "600" },
  updatedPill: {
    backgroundColor: "#90E36D",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  updatedPillText: { fontSize: 12, lineHeight: 16, color: "#111827", fontWeight: "500" },
});
