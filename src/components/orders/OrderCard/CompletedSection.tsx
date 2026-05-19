import React from "react";
import { View, Pressable } from "react-native";
import Text from "../../Text";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import { useTranslations } from "../../../localization/LocalizationProvider";

type Props = {
    riderName: string | null;
    createdAt: string;
    unreadMessagesCount?: number;
    onOpenChat?: () => void;
    theme: any;
};

export default function CompletedSection({
    riderName,
    createdAt,
    unreadMessagesCount = 0,
    onOpenChat,
    theme,
}: Props) {
    const dateStr = new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const timeStr = new Date(createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const { t } = useTranslations('app');

    return (
        <>
            <View style={[styles.divider, { backgroundColor: theme.colors.gray200, marginVertical: 8 }]} />
            <View style={styles.completedRiderRow}>
                <View style={styles.completedRiderInfo}>
                    <Text style={styles.completedRiderLabel}>{t("order_card_rider_name")}</Text>
                    <Text style={styles.completedRiderName} weight="semiBold">
                        {riderName || ''}
                    </Text>
                </View>
                <View style={styles.actionButtonsRow}>
                    <Pressable style={styles.iconBtn}>
                        <Feather name="phone" size={20} color="#374151" />
                    </Pressable>
                    <Pressable style={styles.iconBtn} onPress={onOpenChat}>
                        <Feather name="message-circle" size={20} color="#374151" />
                        {unreadMessagesCount > 0 ? (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{unreadMessagesCount}</Text>
                            </View>
                        ) : null}
                    </Pressable>
                </View>
            </View>

            <View style={styles.completedFooterBox}>
                <View style={styles.completedFooterCol}>
                    <Text style={styles.completedFooterLabel}>{t("order_card_payment_method")}</Text>
                    <Text style={styles.completedFooterValue} weight="semiBold">
                        {t("order_card_payment_cod")}
                    </Text>
                </View>
                <View style={[styles.completedFooterCol, { alignItems: "flex-end" }]}>
                    <Text style={styles.completedFooterLabel}>{t("order_card_date_time")}</Text>
                    <Text style={styles.completedFooterValue} weight="semiBold">
                        {dateStr} - {timeStr}
                    </Text>
                </View>
            </View>
        </>
    );
}
