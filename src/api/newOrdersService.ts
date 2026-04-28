import apiClient from "./apiClient";
import {
  GetNewOrdersParams,
  PaginatedNewOrdersResponse,
} from "./newOrdersServiceTypes";

const NEW_ORDERS_BASE = "/apps/deliveries/store/home/orders/new";

export const newOrdersService = {
  /**
   * GET /api/v1/apps/deliveries/store/home/orders/new
   * Supports offset/limit pagination, search, and orderType filtering.
   */
  getNewOrders: (params: GetNewOrdersParams = {}) =>
    apiClient.get<PaginatedNewOrdersResponse>(
      NEW_ORDERS_BASE,
      params as Record<string, unknown>,
    ),
};
