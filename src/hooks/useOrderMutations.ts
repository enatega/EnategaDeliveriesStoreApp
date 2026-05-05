// src/hooks/useOrderMutations.ts

import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { orderServices } from "../api/orderServices";
import { ApiError } from "../api/apiClient";
import {
  AcceptOrderResponse,
  RejectOrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
  UpdatePreparingTimeRequest,
  UpdatePreparingTimeResponse,
  OrderStatus,
} from "../api/orderServicesTypes";
import {
  newOrdersKeys,
  inProgressOrdersKeys,
  readyOrdersKeys,
  pickupOrdersKeys,
  completedOrdersKeys,
} from "../api/queryKeys";

// ─── Accept Order ─────────────────────────────────────────────────
export function useAcceptOrder(
  options?: UseMutationOptions<AcceptOrderResponse, ApiError, string>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderServices.acceptOrder(orderId),
    onSuccess: (data, orderId, onMutateResult, context) => {
      // Invalidate all order lists because the order moved from "new" to "in-progress"
      queryClient.invalidateQueries({ queryKey: newOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inProgressOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: readyOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: completedOrdersKeys.lists() });
      options?.onSuccess?.(data, orderId, onMutateResult, context);
    },
    ...options,
  });
}

// ─── Reject Order ─────────────────────────────────────────────────
export function useRejectOrder(
  options?: UseMutationOptions<RejectOrderResponse, ApiError, string>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => orderServices.rejectOrder(orderId),
    onSuccess: (data, orderId, onMutateResult, context) => {
      // Invalidate all lists because rejected order disappears from active tabs
      queryClient.invalidateQueries({ queryKey: newOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inProgressOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: readyOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: completedOrdersKeys.lists() });
      options?.onSuccess?.(data, orderId, onMutateResult, context);
    },
    ...options,
  });
}

// ─── Update Order Status (e.g., set to "ready") ───────────────────
export function useUpdateOrderStatus(
  options?: UseMutationOptions<
    UpdateOrderStatusResponse,
    ApiError,
    { orderId: string; data: UpdateOrderStatusRequest }
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }) =>
      orderServices.updateOrderStatus(orderId, data),
    onSuccess: (response, variables, onMutateResult, context) => {
      // Invalidate affected lists based on new status
      // For example, if moving to "ready", it leaves in-progress and enters ready
      queryClient.invalidateQueries({ queryKey: inProgressOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: readyOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.lists() });
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    ...options,
  });
}

// ─── Update Preparing Time ────────────────────────────────────────
export function useUpdatePreparingTime(
  options?: UseMutationOptions<
    UpdatePreparingTimeResponse,
    ApiError,
    { orderId: string; data: UpdatePreparingTimeRequest }
  >,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, data }) =>
      orderServices.updatePreparingTime(orderId, data),
    onSuccess: (response, variables, onMutateResult, context) => {
      // After updating preparing time, the order remains in the same list,
      // but we might want to refetch to show the updated value.
      queryClient.invalidateQueries({ queryKey: inProgressOrdersKeys.lists() });
      options?.onSuccess?.(response, variables, onMutateResult, context);
    },
    ...options,
  });
}
