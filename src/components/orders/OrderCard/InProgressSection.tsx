import React from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { useTranslations } from "../../../localization/LocalizationProvider";
import Text from "../../Text";
import { Feather } from "@expo/vector-icons";
import Svg from "../../Svg";
import CountdownTimer from "../../CountdownTimer";
import { styles } from "./styles";

type Props = {
    orderId: string;
    riderArrived: boolean;
    riderName: string | null;
    riderVehicle: string | null;
    preparingTimeInMinutes: number;
    startTime: number | null;
    onMarkReady: (orderId: string) => void;
    onUpdatePreparingTime: (orderId: string, minutes: number) => void;
    theme: any;
    isMarkingReady?: boolean;
    isUpdatingTime?: boolean;
};

export default function InProgressSection({
    orderId,
    riderArrived,
    riderName,
    riderVehicle,
    preparingTimeInMinutes,
    startTime,
    onMarkReady,
    onUpdatePreparingTime,
    isMarkingReady,
    isUpdatingTime,
    theme,
}: Props) {
    const { t } = useTranslations("app");

    return (
        <>
            <View style={[styles.divider, { backgroundColor: theme.colors.gray200, marginVertical: 12 }]} />
            <View style={{ gap: 10 }}>
                {riderArrived && (
                    <View style={[styles.riderStatusBadge, styles.riderArrivedBadge]}>
                        <Feather name="check-circle" size={14} color="#059669" />
                        <Text style={[styles.riderStatusText, { color: "#059669" }]}>{t("order_card_rider_arrived")}</Text>
                    </View>
                )}
                {riderName && (
                    <View style={styles.riderInfoRow}>
                        <Feather name="phone" size={14} color="#4B5563" />
                        <Text style={styles.riderInfoText}>
                            {riderName} {riderVehicle ? `• ${riderVehicle}` : ""}
                        </Text>
                    </View>
                )}
                <View style={[styles.preparingStatusBox, { backgroundColor: theme.colors.green50 }]}>
                    <View style={styles.preparingLeft}>
                        <Svg name="timer" width={40} height={40} />
                        <Text style={styles.preparingText}>{t("order_card_preparing")}</Text>
                    </View>
                    {startTime && (
                        <CountdownTimer
                            startTimeMs={startTime}
                            totalMinutes={preparingTimeInMinutes}
                            style={styles.timerText}
                        />
                    )}
                </View>
            </View>

            <View style={styles.inProgressActions}>
                <Pressable
                    style={[styles.btnPlusTime, isUpdatingTime && { opacity: 0.6 }]}
                    onPress={() => onUpdatePreparingTime(orderId, (preparingTimeInMinutes || 0) + 5)}
                    disabled={isUpdatingTime}
                >
                    {isUpdatingTime ? (
                        <ActivityIndicator size="small" color="#374151" />
                    ) : (
                        <Text style={styles.btnPlusTimeText}>+5m</Text>
                    )}
                </Pressable>
                <Pressable
                    style={[styles.btnMarkReady, { backgroundColor: theme.colors.primary }, isMarkingReady && { opacity: 0.6 }]}
                    onPress={() => onMarkReady(orderId)}
                    disabled={isMarkingReady}
                >
                    {isMarkingReady ? (
                        <ActivityIndicator size="small" color={theme.colors.gray900} />
                    ) : (
                        <Text style={[styles.btnMarkReadyText, { color: theme.colors.gray900 }]}>
                            {t("order_card_mark_ready")}
                        </Text>
                    )}
                </Pressable>
            </View>
        </>
    );
}