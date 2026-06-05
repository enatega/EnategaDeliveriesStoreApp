// src/hooks/useOrderMutations.ts

import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { InfiniteData } from "@tanstack/react-query";
import { orderServices } from "../api/orderServices";
import { ApiError } from "../api/apiClient";
import {
  AcceptOrderResponse,
  ConfirmPickupRequest,
  ConfirmPickupResponse,
  RejectOrderResponse,
  RejectOrderRequest,
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
import { PaginatedOrdersResponse } from "../api/orderServicesTypes";

// ─── Accept Order ─────────────────────────────────────────────────
export function useAcceptOrder(
  options?: UseMutationOptions<AcceptOrderResponse, ApiError, string>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};
  return useMutation({
    mutationFn: (orderId: string) => orderServices.acceptOrder(orderId),
    onSuccess: (data, orderId, onMutateResult, context) => {
      // Invalidate all order lists because the order moved from "new" to "in-progress"
      queryClient.invalidateQueries({ queryKey: newOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inProgressOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: readyOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: completedOrdersKeys.lists() });
      onSuccess?.(data, orderId, onMutateResult, context);
    },
    ...restOptions,
  });
}

// ─── Reject Order ─────────────────────────────────────────────────
export function useRejectOrder(
  options?: UseMutationOptions<
    RejectOrderResponse,
    ApiError,
    { orderId: string; data: RejectOrderRequest }
  >,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restOptions } = options ?? {};
  return useMutation({
    mutationFn: ({ orderId, data }) => orderServices.rejectOrder(orderId, data),
    onSuccess: (data, variables, onMutateResult, context) => {
      // Invalidate all lists because rejected order disappears from active tabs
      queryClient.invalidateQueries({ queryKey: newOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: inProgressOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: readyOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: completedOrdersKeys.lists() });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
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
  const { onSuccess, ...restOptions } = options ?? {};
  return useMutation({
    mutationFn: ({ orderId, data }) =>
      orderServices.updateOrderStatus(orderId, data),
    onSuccess: (response, variables, onMutateResult, context) => {
      // Invalidate affected lists based on new status
      // For example, if moving to "ready", it leaves in-progress and enters ready
      queryClient.invalidateQueries({ queryKey: inProgressOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: readyOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.lists() });
      onSuccess?.(response, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}

// ─── Confirm Pickup (non-instant pickup flow) ────────────────────
export function useConfirmNonInstantPickup(
  options?: UseMutationOptions<
    ConfirmPickupResponse,
    ApiError,
    { orderId: string; data: ConfirmPickupRequest }
  >,
) {
  const queryClient = useQueryClient();
  const { onError, onMutate: _ignoredOnMutate, onSuccess, ...restOptions } = options ?? {};
  return useMutation({
    mutationFn: ({ orderId, data }) =>
      orderServices.confirmNonInstantPickup(orderId, data),
    onMutate: async (variables) => {
      console.log("[useConfirmNonInstantPickup] onMutate", {
        orderId: variables.orderId,
        payload: {
          is_confirm_pickup: variables.data.isConfirmPickup,
        },
      });
    },
    onError: (error, variables, onMutateResult, context) => {
      console.log("[useConfirmNonInstantPickup] onError", {
        orderId: variables.orderId,
        payload: {
          is_confirm_pickup: variables.data.isConfirmPickup,
        },
        errorMessage: error.message,
        errorStatus: error.status,
        errorCode: error.code,
        errorData: error.data,
      });
      onError?.(error, variables, onMutateResult, context);
    },
    onSuccess: (response, variables, onMutateResult, context) => {
      console.log("[useConfirmNonInstantPickup] onSuccess", {
        orderId: variables.orderId,
        payload: {
          is_confirm_pickup: variables.data.isConfirmPickup,
        },
        response,
      });
      queryClient.invalidateQueries({ queryKey: readyOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pickupOrdersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: completedOrdersKeys.lists() });
      onSuccess?.(response, variables, onMutateResult, context);
    },
    ...restOptions,
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
  const { onError, onMutate: _ignoredOnMutate, onSuccess, ...restOptions } = options ?? {};
  return useMutation({
    mutationFn: ({ orderId, data }) =>
      orderServices.updatePreparingTime(orderId, data),
    onMutate: async (
      variables,
    ): Promise<{
      previousInProgress: [
        readonly unknown[],
        InfiniteData<PaginatedOrdersResponse, unknown> | undefined,
      ][];
    }> => {
      console.log("[useUpdatePreparingTime] onMutate:start", {
        orderId: variables.orderId,
        preparingTimeInMinutes: variables.data.preparingTimeInMinutes,
      });
      await queryClient.cancelQueries({ queryKey: inProgressOrdersKeys.lists() });

      const previousInProgress = queryClient.getQueriesData<
        InfiniteData<PaginatedOrdersResponse>
      >({ queryKey: inProgressOrdersKeys.lists() });

      queryClient.setQueriesData<InfiniteData<PaginatedOrdersResponse>>(
        { queryKey: inProgressOrdersKeys.lists() },
        (previous) => {
          if (!previous) {
            console.log("[useUpdatePreparingTime] onMutate:missing previous cache", {
              orderId: variables.orderId,
            });
            return previous;
          }
          if (!Array.isArray(previous.pages)) {
            console.log("[useUpdatePreparingTime] onMutate:invalid pages", {
              orderId: variables.orderId,
              previousType: typeof previous,
              hasPages: Object.prototype.hasOwnProperty.call(previous, "pages"),
            });
            return previous;
          }

          return {
            ...previous,
            pages: previous.pages.map((page, pageIndex) => ({
              ...page,
              items: (Array.isArray(page.items) ? page.items : (() => {
                console.log("[useUpdatePreparingTime] onMutate:page items undefined", {
                  orderId: variables.orderId,
                  pageIndex,
                  pageKeys: Object.keys(page ?? {}),
                });
                return [];
              })()).map((item) => {
                if (item.orderId !== variables.orderId) return item;

                const currentRemaining = item.remainingSeconds ?? 0;
                const bumpedRemaining = Math.max(currentRemaining, 0) + 5 * 60;

                return {
                  ...item,
                  preparingTimeInMinutes: variables.data.preparingTimeInMinutes,
                  remainingSeconds: bumpedRemaining,
                };
              }),
            })),
          };
        },
      );

      return { previousInProgress };
    },
    onError: (error, variables, onMutateResult, context) => {
      console.log("[useUpdatePreparingTime] onError", {
        orderId: variables.orderId,
        preparingTimeInMinutes: variables.data.preparingTimeInMinutes,
        errorName: error?.name,
        errorMessage: error?.message,
      });
      onMutateResult?.previousInProgress?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      onError?.(error, variables, onMutateResult, context);
    },
    onSuccess: (response, variables, onMutateResult, context) => {
      console.log("[useUpdatePreparingTime] onSuccess", {
        orderId: variables.orderId,
        response,
      });
      // Keep UI responsive by updating the local in-progress cache immediately.
      queryClient.setQueriesData<InfiniteData<PaginatedOrdersResponse>>(
        { queryKey: inProgressOrdersKeys.lists() },
        (previous) => {
          if (!previous) {
            console.log("[useUpdatePreparingTime] onSuccess:missing previous cache", {
              orderId: variables.orderId,
            });
            return previous;
          }
          if (!Array.isArray(previous.pages)) {
            console.log("[useUpdatePreparingTime] onSuccess:invalid pages", {
              orderId: variables.orderId,
              previousType: typeof previous,
              hasPages: Object.prototype.hasOwnProperty.call(previous, "pages"),
            });
            return previous;
          }

          return {
            ...previous,
            pages: previous.pages.map((page, pageIndex) => ({
              ...page,
              items: (Array.isArray(page.items) ? page.items : (() => {
                console.log("[useUpdatePreparingTime] onSuccess:page items undefined", {
                  orderId: variables.orderId,
                  pageIndex,
                  pageKeys: Object.keys(page ?? {}),
                });
                return [];
              })()).map((item) => {
                if (item.orderId !== variables.orderId) return item;

                const currentRemaining = item.remainingSeconds ?? 0;
                const bumpedRemaining = Math.max(currentRemaining, 0) + 5 * 60;

                return {
                  ...item,
                  preparingTimeInMinutes: response.preparingTimeInMinutes,
                  remainingSeconds: bumpedRemaining,
                };
              }),
            })),
          };
        },
      );
      onSuccess?.(response, variables, onMutateResult, context);
    },
    ...restOptions,
  });
}
