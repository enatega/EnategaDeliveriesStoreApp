import React from "react";
import { View } from "react-native";
import { useTranslations } from "../../../localization/LocalizationProvider";
import Text from "../../Text";
import { OrderStatus } from "../../../api/orderServicesTypes";
import { styles } from "./styles";

type Props = {
    orderCode: string;
    status: OrderStatus;
    createdAt: string;
    deliveredBadgeLabel?: string;
};

export default function OrderHeader({ orderCode, status, createdAt, deliveredBadgeLabel }: Props) {
    const { t } = useTranslations("app");
    const formattedDateTime = new Date(createdAt).toLocaleString();

    return (
        <View style={styles.topRow}>
            <Text style={styles.orderId}>
                {t("order_card_id_label")}{" "}
                <Text style={styles.orderIdBold} weight="semiBold">
                    {orderCode}
                </Text>
            </Text>
            {status === OrderStatus.DELIVERED ? (
                <View style={styles.deliveredBadge}>
                    <Text style={styles.deliveredBadgeText}>{deliveredBadgeLabel || t("order_card_delivered")}</Text>
                </View>
            ) : (
                <Text style={styles.time}>{formattedDateTime}</Text>
            )}
        </View>
    );
}