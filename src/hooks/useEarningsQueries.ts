import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ApiError } from "../api/apiClient";
import { earningsService } from "../api/earningsService";
import {
  EarningsHistoryResponse,
  EarningsGraphResponse,
  GetEarningsGraphParams,
  GetEarningsHistoryParams,
} from "../api/earningsServiceTypes";
import { earningsKeys } from "../api/queryKeys";

type UseEarningsGraphOptions = {
  params?: GetEarningsGraphParams;
} & Omit<
  UseQueryOptions<EarningsGraphResponse, ApiError>,
  "queryKey" | "queryFn"
>;

export function useEarningsGraphQuery({
  params = {},
  ...options
}: UseEarningsGraphOptions = {}) {
  return useQuery<EarningsGraphResponse, ApiError>({
    queryKey: earningsKeys.graphList(params),
    queryFn: () => earningsService.getEarningsGraph(params),
    staleTime: 60 * 1000,
    ...options,
  });
}

type UseEarningsHistoryOptions = {
  params?: GetEarningsHistoryParams;
} & Omit<
  UseQueryOptions<EarningsHistoryResponse, ApiError>,
  "queryKey" | "queryFn"
>;

export function useEarningsHistoryQuery({
  params = {},
  ...options
}: UseEarningsHistoryOptions = {}) {
  return useQuery<EarningsHistoryResponse, ApiError>({
    queryKey: earningsKeys.historyList(params),
    queryFn: () => earningsService.getEarningsHistory(params),
    staleTime: 60 * 1000,
    ...options,
  });
}
