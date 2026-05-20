import apiClient from "./apiClient";
import {
  GetOrdersParams,
  Order,
  OrderItem,
  PaginatedOrdersResponse,
  AcceptOrderResponse,
  RejectOrderResponse,
  RejectOrderRequest,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  UpdatePreparingTimeRequest,
  UpdatePreparingTimeResponse,
} from "./orderServicesTypes";
import { apiConfig } from "./apiConfig";

const BASE_PATH = "/apps/deliveries/store/home/orders";

function getApiOrigin() {
  try {
    return new URL(apiConfig.baseUrl).origin;
  } catch {
    return "";
  }
}

function normalizeImageUrl(image: string | null): string | null {
  if (!image) return null;
  const trimmed = image.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return encodeURI(trimmed);
  }

  try {
    return encodeURI(new URL(trimmed, apiConfig.baseUrl).toString());
  } catch {
    const apiOrigin = getApiOrigin();
    if (!apiOrigin) return trimmed;
    const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return encodeURI(`${apiOrigin}${normalizedPath}`);
  }
}

function extractImageCandidate(item: Record<string, unknown>): string | null {
  const directCandidates: unknown[] = [
    item.image,
    item.imageUrl,
    item.imageURL,
    item.image_url,
    item.productImage,
    item.product_image,
    item.thumbnail,
    item.photo,
    item.url,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  const nestedCandidates: unknown[] = [item.image, item.thumbnail, item.photo];
  for (const candidate of nestedCandidates) {
    if (candidate && typeof candidate === "object") {
      const record = candidate as Record<string, unknown>;
      const nested = [record.url, record.src, record.uri, record.path].find(
        (value) => typeof value === "string" && value.trim().length > 0,
      );

      if (typeof nested === "string") {
        return nested;
      }
    }
  }

  return null;
}

function normalizeOrderItem(item: OrderItem): OrderItem {
  const runtimeItem = item as unknown as Record<string, unknown>;
  return {
    ...item,
    image: normalizeImageUrl(extractImageCandidate(runtimeItem)),
  };
}

function stripCourierComment(comment: string | null): string | null {
  if (!comment) return null;
  const trimmed = comment.trim();
  if (!trimmed) return null;

  const courierSectionPattern = /\n\s*(courier|rider)\s*:/i;
  const match = trimmed.match(courierSectionPattern);
  if (!match || typeof match.index !== "number") {
    return trimmed;
  }

  const storeOnlyComment = trimmed.slice(0, match.index).trim();
  return storeOnlyComment || null;
}

function normalizeOrder(order: Order): Order {
  const runtimeOrder = order as unknown as Record<string, unknown>;
  const customerProfileImageRaw =
    (typeof runtimeOrder.customerProfileImage === "string" && runtimeOrder.customerProfileImage)
    || (typeof runtimeOrder.customerProfilePicture === "string" && runtimeOrder.customerProfilePicture)
    || (typeof runtimeOrder.customer_profile_image === "string" && runtimeOrder.customer_profile_image)
    || (typeof runtimeOrder.customer_profile_picture === "string" && runtimeOrder.customer_profile_picture)
    || null;

  const summarySource =
    (runtimeOrder.summary as Record<string, unknown> | undefined)
    ?? (runtimeOrder.orderSummary as Record<string, unknown> | undefined)
    ?? (runtimeOrder.order_summary as Record<string, unknown> | undefined);

  const toNullableNumber = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return null;
  };

  const orderSummary = summarySource
    ? {
      orderNumber:
        typeof summarySource.orderNumber === "string"
          ? summarySource.orderNumber
          : typeof summarySource.order_number === "string"
            ? summarySource.order_number
            : null,
      itemSubtotal: toNullableNumber(summarySource.itemSubtotal ?? summarySource.item_subtotal),
      discountAmount: toNullableNumber(summarySource.discountAmount ?? summarySource.discount_amount),
      taxAmount: toNullableNumber(summarySource.taxAmount ?? summarySource.tax_amount),
      packingCharges: toNullableNumber(summarySource.packingCharges ?? summarySource.packing_charges),
      deliveryFee: toNullableNumber(summarySource.deliveryFee ?? summarySource.delivery_fee),
      courierTip: toNullableNumber(summarySource.courierTip ?? summarySource.courier_tip),
      totalAmount: toNullableNumber(summarySource.totalAmount ?? summarySource.total_amount),
      note: typeof summarySource.note === "string" ? summarySource.note : null,
    }
    : null;

  return {
    ...order,
    customerProfileImage: normalizeImageUrl(customerProfileImageRaw),
    items: order.items.map(normalizeOrderItem),
    customerComment: stripCourierComment(order.customerComment),
    restaurantNote:
      typeof runtimeOrder.restaurantNote === "string"
        ? runtimeOrder.restaurantNote
        : typeof runtimeOrder.restaurant_note === "string"
          ? runtimeOrder.restaurant_note
          : null,
    orderSummary,
  };
}

function normalizeOrdersResponse(response: PaginatedOrdersResponse): PaginatedOrdersResponse {
  return {
    ...response,
    items: response.items.map(normalizeOrder),
  };
}

function logOrdersAddonDebug(source: string, response: PaginatedOrdersResponse) {
  response.items.forEach((order) => {
    const addonSnapshot = order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
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
  const normalizedResponse = normalizeOrdersResponse(response);
  logOrdersAddonDebug(source, normalizedResponse);
  return normalizedResponse;
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

  rejectOrder: (orderId: string, data: RejectOrderRequest) =>
    apiClient.patch<RejectOrderResponse>(`${BASE_PATH}/${orderId}/reject`, data),

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
