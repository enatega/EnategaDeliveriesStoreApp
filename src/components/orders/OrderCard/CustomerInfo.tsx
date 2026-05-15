import React from "react";
import { View, Pressable } from "react-native";
import { useTranslations } from "../../../localization/LocalizationProvider";
import Text from "../../Text";
import { styles } from "./styles";
import { Feather } from "@expo/vector-icons";

type Props = {
    customerName: string;
    orderType: "delivery" | "pickup";
    address: string | null;
    theme: any;
};

export default function CustomerInfo({ customerName, orderType, address, theme }: Props) {
    const { t } = useTranslations("app");

    return (
        <>
            <View style={[styles.divider, { backgroundColor: theme.colors.gray200 }]} />
            <View style={styles.customerRow}>
                <View style={styles.customerAvatar} />
                <View style={styles.customerTextWrap}>
                    <Text style={styles.customerLabel}>{t("order_card_customer_name")}</Text>
                    <Text style={styles.customerName} weight="medium">
                        {customerName}
                    </Text>
                </View>
            </View>
            {address ? (
                <>
                    <View style={[styles.divider, { backgroundColor: theme.colors.gray200 }]} />
                    <View style={styles.addressRow}>
                        <View style={styles.rowIconWrap}>
                            <Feather name="map-pin" size={16} color="#111827" />
                        </View>
                        <View style={styles.addressTextWrap}>
                            <Text style={styles.addressLabel}>{t("order_card_address")}</Text>
                            <Text style={styles.address} numberOfLines={2} weight="medium">
                                {address}
                            </Text>
                        </View>
                        {orderType === "delivery" ? (
                            <Pressable style={styles.viewMapButton}>
                                <Feather name="map" size={14} color="#4B5563" />
                                <Text style={styles.viewMapText}>{t("order_card_view_map")}</Text>
                            </Pressable>
                        ) : null}
                    </View>
                </>
            ) : null}
        </>
    );
}
