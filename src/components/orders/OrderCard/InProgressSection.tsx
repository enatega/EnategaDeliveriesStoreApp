import React, { useEffect, useMemo, useState } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { useTranslations } from "../../../localization/LocalizationProvider";
import Text from "../../Text";
import { Feather } from "@expo/vector-icons";
import Svg from "../../Svg";
import CountdownTimer from "../../CountdownTimer";
import { styles } from "./styles";
import { getReadableRiderStatus } from "./riderStatusLabel";

type Props = {
    orderId: string;
    riderArrived: boolean;
    riderStatus: string | null;
    riderStatusLabel: string | null;
    riderName: string | null;
    riderVehicle: string | null;
    preparingTimeInMinutes: number;
    remainingSeconds?: number | null;
    startTime: number | null;
    onMarkReady: (orderId: string) => void;
    onUpdatePreparingTime: (orderId: string, minutes: number) => void;
    canMarkReady: boolean;
    theme: any;
    isMarkingReady?: boolean;
    isUpdatingTime?: boolean;
};

export default function InProgressSection({
    orderId,
    riderArrived,
    riderStatus,
    riderStatusLabel,
    riderName,
    riderVehicle,
    preparingTimeInMinutes,
    remainingSeconds,
    startTime,
    onMarkReady,
    onUpdatePreparingTime,
    canMarkReady,
    isMarkingReady,
    isUpdatingTime,
    theme,
}: Props) {
    const { t } = useTranslations("app");
    const formattedRiderStatus = getReadableRiderStatus(null, riderStatus, riderStatusLabel);
    const initialRemainingSeconds = useMemo(() => {
        if (
            typeof remainingSeconds === "number" &&
            (remainingSeconds > 0 || preparingTimeInMinutes <= 0)
        ) {
            return Math.max(0, remainingSeconds);
        }

        return Math.max(0, preparingTimeInMinutes * 60);
    }, [preparingTimeInMinutes, remainingSeconds]);
    const [liveRemainingSeconds, setLiveRemainingSeconds] = useState(initialRemainingSeconds);

    useEffect(() => {
        setLiveRemainingSeconds(initialRemainingSeconds);
    }, [initialRemainingSeconds, orderId]);

    return (
        <>
            <View style={[styles.divider, { backgroundColor: theme.colors.gray200, marginVertical: 12 }]} />
            <View style={{ gap: 10 }}>
                {formattedRiderStatus && (
                    <View style={styles.riderStatusBadge}>
                        <Feather name="navigation" size={14} color="#1D4ED8" />
                        <Text style={[styles.riderStatusText, { color: "#1D4ED8" }]}>
                            {formattedRiderStatus}
                        </Text>
                    </View>
                )}
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
                    <CountdownTimer
                        startTimeMs={startTime}
                        totalMinutes={preparingTimeInMinutes}
                        remainingSecondsOverride={liveRemainingSeconds}
                        style={styles.timerText}
                    />
                </View>
            </View>

            <View style={styles.inProgressActions}>
                <Pressable
                    style={[styles.btnPlusTime, isUpdatingTime && { opacity: 0.6 }]}
                    onPress={() => {
                        const nextMinutes = (preparingTimeInMinutes || 0) + 5;
                        setLiveRemainingSeconds((prev) => Math.max(0, prev) + 5 * 60);
                        console.log("[InProgressSection] +5m tapped", {
                            orderId,
                            currentPreparingTimeInMinutes: preparingTimeInMinutes,
                            nextPreparingTimeInMinutes: nextMinutes,
                        });
                        onUpdatePreparingTime(orderId, nextMinutes);
                    }}
                    disabled={isUpdatingTime}
                >
                    {isUpdatingTime ? (
                        <ActivityIndicator size="small" color="#374151" />
                    ) : (
                        <Text style={styles.btnPlusTimeText}>+5m</Text>
                    )}
                </Pressable>
                <Pressable
                    style={[
                      styles.btnMarkReady,
                      { backgroundColor: canMarkReady ? theme.colors.primary : theme.colors.gray300 },
                      (isMarkingReady || !canMarkReady) && { opacity: 0.6 },
                    ]}
                    onPress={() => {
                      if (!canMarkReady) return;
                      onMarkReady(orderId);
                    }}
                    disabled={isMarkingReady || !canMarkReady}
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
