import React from "react";
import { Image, View } from "react-native";
import { useTranslations } from "../../../localization/LocalizationProvider";
import Text from "../../Text";
import { OrderItem } from "../../../api/orderServicesTypes";
import { styles } from "./styles";

type Props = {
    items: OrderItem[];
    totalAmount: number;
    theme: any;
};

export default function OrderItems({ items, totalAmount, theme }: Props) {
    const { t } = useTranslations("app");

    if (!items || items.length === 0) return null;

    return (
        <>
            <View style={[styles.divider, { backgroundColor: theme.colors.gray200 }]} />
            <View style={styles.itemsHeader}>
                <Text style={styles.colHeader}>{t("order_card_col_order")}</Text>
                <Text style={styles.colHeaderRight}>{t("order_card_col_price")}</Text>
            </View>
            {items.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                    <View
                        style={[
                            styles.foodImageBox,
                            { backgroundColor: theme.colors.gray200, borderColor: theme.colors.gray200 },
                        ]}
                    >
                        {item.image ? (
                            <Image source={{ uri: item.image }} style={styles.foodImage} resizeMode="cover" />
                        ) : (
                            <View style={[styles.foodImagePlaceholder, { backgroundColor: theme.colors.gray200 }]} />
                        )}
                    </View>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName} weight="semiBold">
                            {item.name}
                        </Text>
                        <Text style={styles.itemQty} weight="semiBold">
                            x{item.quantity}
                        </Text>
                    </View>
                    <Text style={styles.itemPrice} weight="semiBold">
                        ${item.totalPrice}
                    </Text>
                </View>
            ))}
            <View style={[styles.divider, { backgroundColor: theme.colors.gray200 }]} />
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel} weight="semiBold">
                    {t("order_card_total")}
                </Text>
                <Text style={styles.totalValue} weight="semiBold">
                    ${totalAmount}
                </Text>
            </View>
        </>
    );
}