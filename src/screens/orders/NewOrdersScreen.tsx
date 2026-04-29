import React, { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native";
import { useAppTheme } from "../../theme/ThemeProvider";
import { useTranslations } from "../../localization/LocalizationProvider";
import Text from "../../components/Text";
import OrderCard from "../../components/OrderCard";
import SegmentedTabs from "../../components/SegmentedTabs";
import { useNewOrders } from "../../hooks/useNewOrders";

type OrderTypeFilter = "delivery" | "pickup";

export default function NewOrdersScreen() {
  const [filterType, setFilterType] = useState<OrderTypeFilter>("delivery");
  const { t } = useTranslations("app");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useNewOrders({
    params: { limit: 10, orderType: filterType },
  });

  const orders = data?.pages.flatMap((page) => page?.items) ?? [];
  const { theme } = useAppTheme();

  const tabs = [
    { key: "delivery", label: t("orders_tab_delivery") },
    { key: "pickup", label: t("orders_tab_pickup") },
  ];

  const handleAccept = (orderId: string) => {
    console.log("Accept order:", orderId);
  };

  const handleReject = (orderId: string) => {
    console.log("Reject order:", orderId);
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      );
    }
    if (!hasNextPage && orders.length > 0) {
      return (
        <View style={styles.footerMessage}>
          <Text style={{ color: theme.colors.gray500, textAlign: "center" }}>
            {t("orders_no_more")}
          </Text>
        </View>
      );
    }
    return null;
  };

  const emptyLabel =
    filterType === "delivery"
      ? t("orders_empty_delivery")
      : t("orders_empty_pickup");

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <SegmentedTabs
        tabs={tabs}
        activeKey={filterType}
        onTabPress={(key) => setFilterType(key as OrderTypeFilter)}
      />

      {isLoading && !data ? (
        <View style={styles.centered}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.orderId}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          )}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={theme.colors.primary}
            />
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text
                style={{ color: theme.colors.gray500, textAlign: "center" }}
              >
                {emptyLabel}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { paddingHorizontal: 16 },
  footerLoader: { paddingVertical: 20, alignItems: "center" },
  footerMessage: { paddingVertical: 10, alignItems: "center" },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});
