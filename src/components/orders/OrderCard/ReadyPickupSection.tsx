import React from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { useTranslations } from "../../../localization/LocalizationProvider";
import Text from "../../Text";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import LocationPin from "../../LocationPin";
import { OrderStatus } from "../../../api/orderServicesTypes";
import { styles } from "./styles";
import { getReadableRiderStatus } from "./riderStatusLabel";

type Props = {
    status: OrderStatus;
    orderId: string;
    riderArrived: boolean;
    riderStatus: string | null;
    riderStatusLabel: string | null;
    riderName: string | null;
    riderVehicle: string | null;
    riderPhone: string | null;
    onConfirmPickup?: (orderId: string) => void;
    showConfirmButton?: boolean;
    isConfirmingPickup?: boolean;
    theme: any;
};

export default function ReadyPickupSection({
    status,
    orderId,
    riderArrived,
    riderStatus,
    riderStatusLabel,
    riderName,
    riderVehicle,
    riderPhone,
    onConfirmPickup,
    showConfirmButton = false,
    isConfirmingPickup,
    theme,
}: Props) {
    const { t } = useTranslations("app");
    const isReady = status === OrderStatus.READY;
    const isOutForDelivery = status === OrderStatus.OUT_FOR_DELIVERY || riderStatus === "out_for_delivery";
    const formattedRiderStatus = getReadableRiderStatus(status, riderStatus, riderStatusLabel);
    const shouldShowAssignedFallback = !formattedRiderStatus && !!riderName && isReady;

    return (
        <>
            <View style={[styles.divider, { backgroundColor: theme.colors.gray200, marginVertical: 8 }]} />
            <View style={styles.readyTopRow}>
                <View style={styles.readyStatusColumn}>
                    {!!formattedRiderStatus && (
                        <View style={styles.riderStatusBadge}>
                            <Feather name="navigation" size={14} color="#1D4ED8" />
                            <Text style={[styles.riderStatusText, { color: "#1D4ED8" }]}>{formattedRiderStatus}</Text>
                        </View>
                    )}
                    {shouldShowAssignedFallback && (
                        <View style={styles.riderStatusBadge}>
                            <Feather name="user-check" size={14} color="#1D4ED8" />
                            <Text style={[styles.riderStatusText, { color: "#1D4ED8" }]}>Rider assigned</Text>
                        </View>
                    )}
                    {isReady && riderArrived && (
                        <View style={styles.readyRiderBadge}>
                            <LocationPin color="#059669" />
                            <Text style={[styles.readyRiderText, { color: "#059669" }]}>{t("order_card_rider_arrived")}</Text>
                        </View>
                    )}
                    {isOutForDelivery && (
                        <View style={styles.pickupRiderBadge}>
                            <Feather name="navigation" size={14} color="#CA8A04" style={{ transform: [{ rotate: "45deg" }] }} />
                            <Text style={styles.pickupRiderText}>{t("order_card_heading_customer")}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.actionButtonsRow}>
                    <Pressable style={styles.iconBtn}>
                        <Feather name="phone" size={20} color="#374151" />
                    </Pressable>
                    <Pressable style={styles.iconBtn}>
                        <MaterialCommunityIcons name="message-outline" size={20} color="#374151" />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>1</Text>
                        </View>
                    </Pressable>
                </View>
            </View>

            {riderName && (
                <View style={styles.riderDetailsBox}>
                    <Text style={styles.riderNameText} weight="semiBold">
                        {riderName}
                    </Text>
                    <View style={styles.riderVehicleRow}>
                        <MaterialCommunityIcons name="bike" size={16} color="#4B5563" />
                        <Text style={styles.riderVehicleText}>
                            {riderVehicle ? `${riderVehicle} • ` : ""}
                            {riderPhone || ""}
                        </Text>
                    </View>
                </View>
            )}

            {showConfirmButton && isReady && (
                <Pressable
                    style={[styles.btnConfirmPickup, { backgroundColor: theme.colors.primary }, isConfirmingPickup && { opacity: 0.6 }]}
                    onPress={() => onConfirmPickup?.(orderId)}
                    disabled={isConfirmingPickup}
                >
                    {isConfirmingPickup ? (
                        <ActivityIndicator size="small" color={theme.colors.gray900} />
                    ) : (
                        <Text style={[styles.btnConfirmPickupText, { color: theme.colors.gray900 }]}>
                            {t("order_card_confirm_pickup")}
                        </Text>
                    )}
                </Pressable>
            )}
        </>
    );
}
