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

function logOrdersAddonDebug(source: string, response: PaginatedOrdersResponse) {
  response.items.forEach((order) => {
    const addonSnapshot = order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      selectedOptions: item.selectedOptions,
      hasAddons: Boolean(item.selectedOptions),
    }));

    console.log(`[Orders API][${source}]`, {
      orderId: order.orderId,
      orderCode: order.orderCode,
      hasAnyAddons: addonSnapshot.some((entry) => entry.hasAddons),
      addonSnapshot,
    });
  });
}

async function getOrdersWithDebug(
  source: string,
  path: string,
  params: GetOrdersParams = {},
) {
  const response = await apiClient.get<PaginatedOrdersResponse>(
    path,
    params as Record<string, unknown>,
  );

  logOrdersAddonDebug(source, response);

  return response;
}

export const orderServices = {
  // ─── New Orders (pending/scheduled) ─────────────────────────────
  getNewOrders: (params: GetOrdersParams = {}) =>
    getOrdersWithDebug("new", `${BASE_PATH}/new`, params),

  // ─── In‑Progress Orders (accepted, preparing, rider_assigned, etc.) ──
  getInProgressOrders: (params: GetOrdersParams = {}) =>
    getOrdersWithDebug("in-progress", `${BASE_PATH}/in-progress`, params),

  // ─── Ready Orders ───────────────────────────────────────────────
  getReadyOrders: (params: GetOrdersParams = {}) =>
    getOrdersWithDebug("ready", `${BASE_PATH}/ready`, params),

  // ─── Pickup Orders (rider arrived / assigned) ──────────────────
  getPickupOrders: (params: GetOrdersParams = {}) =>
    getOrdersWithDebug("pickup", `${BASE_PATH}/pickup`, params),

  // ─── Completed / Cancelled / Failed Orders ─────────────────────
  getCompletedOrders: (params: GetOrdersParams = {}) =>
    getOrdersWithDebug("completed", `${BASE_PATH}/completed`, params),

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
      {
        preparingTimeInMinutes: data.preparingTimeInMinutes,
        preparing_time_in_minutes: data.preparingTimeInMinutes,
      },
    ),
};
