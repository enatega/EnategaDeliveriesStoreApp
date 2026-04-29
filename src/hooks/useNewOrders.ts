// src/hooks/useNewOrders.ts

import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { newOrdersService } from "../api/newOrdersService";
import {
  GetNewOrdersParams,
  PaginatedNewOrdersResponse,
} from "../api/newOrdersServiceTypes";
import { ApiError } from "../api/apiClient";
import { newOrdersKeys } from "../api/queryKeys";

export type UseNewOrdersOptions = {
  params?: GetNewOrdersParams;
} & Omit<
  UseInfiniteQueryOptions<PaginatedNewOrdersResponse, ApiError>,
  "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam" | "select"
>;

export function useNewOrders({
  params = {},
  ...queryOptions
}: UseNewOrdersOptions = {}) {
  return useInfiniteQuery({
    queryKey: newOrdersKeys.list(params),
    queryFn: ({ pageParam }) =>
      newOrdersService.getNewOrders({
        ...params,
        offset: (pageParam as number) ?? 0,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    staleTime: 60 * 1000,
    ...queryOptions,
  });
}
