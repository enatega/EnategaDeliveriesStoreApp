import { useEffect } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { AppState, type AppStateStatus } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useAuth } from "../auth/AuthProvider";
import { newOrdersKeys } from "../api/queryKeys";
import type { GetOrdersParams, Order, PaginatedOrdersResponse } from "../api/orderServicesTypes";
import {
  storeOrdersSocketClient,
  type StoreHomeOrderCreatedPayload,
} from "../socket/storeOrdersSocket";

function matchesOrderTypeFilter(params: GetOrdersParams | undefined, nextType: Order["orderType"]) {
  const filter = params?.orderType;
  if (!filter || filter === "all") return true;
  return filter === nextType;
}

function prependOrderToInfiniteData(
  previous: InfiniteData<PaginatedOrdersResponse> | undefined,
  incomingOrder: Order,
): InfiniteData<PaginatedOrdersResponse> | undefined {
  if (!previous?.pages?.length) return previous;

  const alreadyExists = previous.pages.some((page) =>
    page.items.some((item) => item.orderId === incomingOrder.orderId),
  );
  if (alreadyExists) return previous;

  const firstPage = previous.pages[0];
  const nextFirstItems = [incomingOrder, ...firstPage.items];
  const cappedFirstItems = nextFirstItems.slice(0, firstPage.limit);

  return {
    ...previous,
    pages: [
      {
        ...firstPage,
        items: cappedFirstItems,
        total: firstPage.total + 1,
      },
      ...previous.pages.slice(1),
    ],
  };
}

export function useStoreOrderSocketSync() {
  const queryClient = useQueryClient();
  const { session, isAuthenticated } = useAuth();

  const token = session.token ?? null;
  const userId = session.user?.id ?? null;
  const currentStoreId = session.profiles?.find((entry) => entry.key === "Store")?.data?.id ?? null;

  useEffect(() => {
    storeOrdersSocketClient.updateSession({ token, userId });

    if (!isAuthenticated || !token) {
      storeOrdersSocketClient.disconnect();
      return;
    }

    storeOrdersSocketClient.connect();

    return () => {
      storeOrdersSocketClient.disconnect();
    };
  }, [isAuthenticated, token, userId]);

  useEffect(() => {
    if (!isAuthenticated || !token || !currentStoreId) {
      return undefined;
    }

    const unsubscribe = storeOrdersSocketClient.subscribeStoreHomeOrderCreated(
      (payload: StoreHomeOrderCreatedPayload) => {
        if (payload.storeId !== currentStoreId) return;

        const incomingOrder = payload.order as Order;

        const matchingQueries = queryClient.getQueriesData<InfiniteData<PaginatedOrdersResponse>>({
          queryKey: newOrdersKeys.lists(),
        });

        matchingQueries.forEach(([queryKey, previous]) => {
          const key = queryKey as readonly unknown[];
          const params = key[3] as GetOrdersParams | undefined;

          if (!matchesOrderTypeFilter(params, incomingOrder.orderType)) {
            return;
          }

          queryClient.setQueryData<InfiniteData<PaginatedOrdersResponse>>(
            queryKey,
            prependOrderToInfiniteData(previous, incomingOrder),
          );
        });
      },
    );

    return unsubscribe;
  }, [currentStoreId, isAuthenticated, queryClient, token]);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      return undefined;
    }

    let appState = AppState.currentState;
    const appStateSubscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      const wasActive = appState === "active";
      appState = nextState;

      if (wasActive && nextState !== "active") {
        storeOrdersSocketClient.disconnect();
        return;
      }

      if (nextState === "active") {
        storeOrdersSocketClient.connect();
      }
    });

    const netInfoSubscription = NetInfo.addEventListener((state) => {
      const isReachable = state.isConnected && state.isInternetReachable !== false;
      if (!isReachable || appState !== "active") return;
      storeOrdersSocketClient.connect();
    });

    return () => {
      appStateSubscription.remove();
      netInfoSubscription();
    };
  }, [isAuthenticated, token]);
}
