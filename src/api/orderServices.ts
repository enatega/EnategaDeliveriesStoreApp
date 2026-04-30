import apiClient from "./apiClient";
import {
  GetOrdersParams,
  PaginatedOrdersResponse,
  AcceptOrderResponse,
  RejectOrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  UpdatePreparingTimeRequest,
  UpdatePreparingTimeResponse,
} from "./orderServicesTypes";

const BASE_PATH = "/apps/deliveries/store/home/orders";

export const orderServices = {
  // ─── New Orders (pending/scheduled) ─────────────────────────────
  getNewOrders: (params: GetOrdersParams = {}) =>
    apiClient.get<PaginatedOrdersResponse>(
      `${BASE_PATH}/new`,
      params as Record<string, unknown>,
    ),

  // ─── In‑Progress Orders (accepted, preparing, rider_assigned, etc.) ──
  getInProgressOrders: (params: GetOrdersParams = {}) =>
    apiClient.get<PaginatedOrdersResponse>(
      `${BASE_PATH}/in-progress`,
      params as Record<string, unknown>,
    ),

  // ─── Ready Orders ───────────────────────────────────────────────
  getReadyOrders: (params: GetOrdersParams = {}) =>
    apiClient.get<PaginatedOrdersResponse>(
      `${BASE_PATH}/ready`,
      params as Record<string, unknown>,
    ),

  // ─── Pickup Orders (rider arrived / assigned) ──────────────────
  getPickupOrders: (params: GetOrdersParams = {}) =>
    apiClient.get<PaginatedOrdersResponse>(
      `${BASE_PATH}/pickup`,
      params as Record<string, unknown>,
    ),

  // ─── Completed / Cancelled / Failed Orders ─────────────────────
  getCompletedOrders: (params: GetOrdersParams = {}) =>
    apiClient.get<PaginatedOrdersResponse>(
      `${BASE_PATH}/completed`,
      params as Record<string, unknown>,
    ),

  // ─── Mutations ──────────────────────────────────────────────────
  acceptOrder: (orderId: string) =>
    apiClient.patch<AcceptOrderResponse>(`${BASE_PATH}/${orderId}/accept`),

  rejectOrder: (orderId: string) =>
    apiClient.patch<RejectOrderResponse>(`${BASE_PATH}/${orderId}/reject`),

  updateOrderStatus: (orderId: string, data: UpdateOrderStatusRequest) =>
    apiClient.patch<UpdateOrderStatusResponse>(
      `${BASE_PATH}/${orderId}/status`,
      data,
    ),

  updatePreparingTime: (orderId: string, data: UpdatePreparingTimeRequest) =>
    apiClient.patch<UpdatePreparingTimeResponse>(
      `${BASE_PATH}/${orderId}/preparing-time`,
      data,
    ),
};
