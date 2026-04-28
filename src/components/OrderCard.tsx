import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Text from "./Text";
import { useAppTheme } from "../theme/ThemeProvider";
import { useTranslations } from "../localization/LocalizationProvider";
import { NewOrder, NewOrderItem } from "../api/newOrdersServiceTypes";

type Props = {
  order: NewOrder;
  onAccept?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
};

export default function OrderCard({ order, onAccept, onReject }: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations("app");

  const showActions = order.canAccept || order.canReject;
  const formattedDateTime = new Date(order.createdAt).toLocaleString();
  const displayAddress =
    order.orderType === "delivery"
      ? order.deliveryAddress
      : order.pickupAddress;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: "#FDFDFD", borderColor: theme.colors.gray200 },
      ]}
    >
      {/* Row 1: Order ID + time */}
      <View style={styles.topRow}>
        <Text style={styles.orderId} color={theme.colors.gray900}>
          {t("order_card_id_label")}{" "}
          <Text
            style={styles.orderIdBold}
            color={theme.colors.gray900}
            weight="semiBold"
          >
            {order.orderCode}
          </Text>
        </Text>
        <Text style={styles.time} color={theme.colors.gray500}>
          {formattedDateTime}
        </Text>
      </View>

      {/* Row 2: Customer name + order type badge */}
      <View style={styles.customerRow}>
        <Text
          style={styles.customerName}
          color={theme.colors.gray900}
          weight="semiBold"
        >
          {order.customerName}
        </Text>
        <View
          style={[
            styles.orderTypeBadge,
            {
              backgroundColor:
                order.orderType === "delivery" ? "#E0F2FE" : "#F3E8FF",
            },
          ]}
        >
          <Text
            style={[
              styles.orderTypeText,
              { color: order.orderType === "delivery" ? "#0369A1" : "#6B21A5" },
            ]}
          >
            {order.orderType === "delivery"
              ? t("order_card_type_delivery")
              : t("order_card_type_pickup")}
          </Text>
        </View>
      </View>

      {/* Row 3: Address */}
      {displayAddress ? (
        <View style={styles.addressRow}>
          <LocationPin color={theme.colors.gray500} />
          <Text style={styles.address} color={theme.colors.gray500}>
            {displayAddress}
          </Text>
        </View>
      ) : null}

      {/* Items section */}
      {order.items && order.items.length > 0 ? (
        <>
          <View
            style={[styles.divider, { backgroundColor: theme.colors.gray200 }]}
          />

          <View style={styles.itemsHeader}>
            <Text style={styles.colHeader} color={theme.colors.gray500}>
              {t("order_card_col_order")}
            </Text>
            <Text style={styles.colHeaderRight} color={theme.colors.gray500}>
              {t("order_card_col_price")}
            </Text>
          </View>

          {order.items.map((item: NewOrderItem, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View
                style={[
                  styles.foodImageBox,
                  {
                    backgroundColor: theme.colors.gray200,
                    borderColor: theme.colors.gray200,
                  },
                ]}
              >
                {item.image ? (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.foodImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.foodImagePlaceholder,
                      { backgroundColor: theme.colors.gray200 },
                    ]}
                  />
                )}
              </View>

              <View style={styles.itemInfo}>
                <Text
                  style={styles.itemName}
                  color={theme.colors.gray900}
                  weight="semiBold"
                >
                  {item.name}
                </Text>
                <Text
                  style={styles.itemQty}
                  color={theme.colors.gray900}
                  weight="semiBold"
                >
                  x{item.quantity}
                </Text>
              </View>

              <Text
                style={styles.itemPrice}
                color={theme.colors.gray900}
                weight="semiBold"
              >
                ${item.totalPrice}
              </Text>
            </View>
          ))}

          <View
            style={[styles.divider, { backgroundColor: theme.colors.gray200 }]}
          />
          <View style={styles.totalRow}>
            <Text
              style={styles.totalLabel}
              color={theme.colors.gray900}
              weight="semiBold"
            >
              {t("order_card_total")}
            </Text>
            <Text
              style={styles.totalValue}
              color={theme.colors.gray900}
              weight="semiBold"
            >
              ${order.orderAmount}
            </Text>
          </View>
        </>
      ) : null}

      {/* Customer comment */}
      {order.customerComment ? (
        <View
          style={[
            styles.commentBox,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <Text
            style={styles.commentLabel}
            color={theme.colors.gray600}
            weight="semiBold"
          >
            {t("order_card_comment")}
          </Text>
          <Text style={styles.commentText} color={theme.colors.gray900}>
            {order.customerComment}
          </Text>
        </View>
      ) : null}

      {/* Accept / Reject buttons */}
      {showActions ? (
        <View style={styles.actions}>
          {order.canReject && (
            <Pressable
              style={[styles.btn, styles.btnReject]}
              onPress={() => onReject?.(order.orderId)}
              accessibilityRole="button"
              accessibilityLabel={t("order_card_reject")}
            >
              <Text
                style={styles.btnRejectText}
                color="#EF4444"
                weight="semiBold"
              >
                {t("order_card_reject")}
              </Text>
            </Pressable>
          )}
          {order.canAccept && (
            <Pressable
              style={[
                styles.btn,
                styles.btnAccept,
                { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => onAccept?.(order.orderId)}
              accessibilityRole="button"
              accessibilityLabel={t("order_card_accept")}
            >
              <Text
                style={styles.btnAcceptText}
                color={theme.colors.gray900}
                weight="semiBold"
              >
                {t("order_card_accept")}
              </Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </View>
  );
}

// ─── Location pin icon (unchanged) ───────────────────────────────────────────
function LocationPin({ color }: { color: string }) {
  return (
    <View style={pinStyles.wrapper}>
      <View style={[pinStyles.circle, { borderColor: color }]} />
      <View style={[pinStyles.tail, { backgroundColor: color }]} />
    </View>
  );
}

const pinStyles = StyleSheet.create({
  wrapper: {
    width: 12,
    height: 16,
    alignItems: "center",
    marginTop: 1,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
  },
  tail: {
    width: 1.5,
    height: 5,
    borderRadius: 1,
    marginTop: -1,
  },
});

// ─── Styles (unchanged, but added new ones for orderTypeBadge) ───────────────
const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 14,
  },
  orderIdBold: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
  },
  customerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  customerName: {
    fontSize: 15,
  },
  orderTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  orderTypeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    marginTop: 2,
  },
  address: {
    fontSize: 13,
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  colHeaderRight: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "right",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  foodImageBox: {
    width: 48,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  foodImage: {
    width: "100%",
    height: "100%",
  },
  foodImagePlaceholder: {
    width: "100%",
    height: "100%",
  },
  itemInfo: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    fontSize: 14,
  },
  itemQty: {
    fontSize: 12,
  },
  itemPrice: {
    fontSize: 14,
    minWidth: 36,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 16,
  },
  commentBox: {
    borderRadius: 4,
    paddingVertical: 6,
    gap: 4,
  },
  commentLabel: {
    fontSize: 14,
  },
  commentText: {
    fontSize: 15,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnReject: {
    borderWidth: 1.5,
    borderColor: "#EF4444",
    backgroundColor: "transparent",
  },
  btnRejectText: {
    fontSize: 16,
  },
  btnAccept: {},
  btnAcceptText: {
    fontSize: 16,
  },
});
