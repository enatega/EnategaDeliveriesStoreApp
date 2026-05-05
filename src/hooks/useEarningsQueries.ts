import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { ApiError } from "../api/apiClient";
import { earningsService } from "../api/earningsService";
import {
  EarningsDailyResponse,
  EarningsGraphResponse,
  EarningsHistoryResponse,
  EarningsSummaryResponse,
  GetEarningsGraphParams,
  GetEarningsDailyParams,
  GetEarningsHistoryParams,
  GetEarningsSummaryParams,
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

type UseEarningsDailyOptions = {
  params?: GetEarningsDailyParams;
} & Omit<
  UseQueryOptions<EarningsDailyResponse, ApiError>,
  "queryKey" | "queryFn"
>;

export function useEarningsDailyQuery({
  params = {},
  ...options
}: UseEarningsDailyOptions = {}) {
  return useQuery<EarningsDailyResponse, ApiError>({
    queryKey: earningsKeys.dailyList(params),
    queryFn: () => earningsService.getEarningsDaily(params),
    staleTime: 60 * 1000,
    ...options,
  });
}

type UseEarningsSummaryOptions = {
  params: GetEarningsSummaryParams;
} & Omit<
  UseQueryOptions<EarningsSummaryResponse, ApiError>,
  "queryKey" | "queryFn"
>;

export function useEarningsSummaryQuery({
  params,
  ...options
}: UseEarningsSummaryOptions) {
  return useQuery<EarningsSummaryResponse, ApiError>({
    queryKey: earningsKeys.summaryDetail(params),
    queryFn: () => earningsService.getEarningsSummary(params),
    staleTime: 60 * 1000,
    ...options,
  });
}

type UseEarningsHistoryOptions = {
  params: GetEarningsHistoryParams;
} & Omit<
  UseQueryOptions<EarningsHistoryResponse, ApiError>,
  "queryKey" | "queryFn"
>;

export function useEarningsHistoryQuery({
  params,
  ...options
}: UseEarningsHistoryOptions) {
  return useQuery<EarningsHistoryResponse, ApiError>({
    queryKey: earningsKeys.historyList(params),
    queryFn: () => earningsService.getEarningsHistory(params),
    staleTime: 60 * 1000,
    ...options,
  });
}
