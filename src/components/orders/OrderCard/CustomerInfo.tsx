import React from "react";
import { View } from "react-native";
import { useTranslations } from "../../../localization/LocalizationProvider";
import Text from "../../Text";
import LocationPin from "../../LocationPin";
import { styles } from "./styles";

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
            <View style={styles.customerRow}>
                <Text style={styles.customerName} weight="semiBold">
                    {customerName}
                </Text>
                <View
                    style={[
                        styles.orderTypeBadge,
                        { backgroundColor: orderType === "delivery" ? "#E0F2FE" : "#F3E8FF" },
                    ]}
                >
                    <Text
                        style={[
                            styles.orderTypeText,
                            { color: orderType === "delivery" ? "#0369A1" : "#6B21A5" },
                        ]}
                    >
                        {orderType === "delivery" ? t("order_card_type_delivery") : t("order_card_type_pickup")}
                    </Text>
                </View>
            </View>
            {address ? (
                <View style={styles.addressRow}>
                    <LocationPin color={theme.colors.gray500} />
                    <Text style={styles.address}>{address}</Text>
                </View>
            ) : null}
        </>
    );
}