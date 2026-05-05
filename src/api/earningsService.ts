import apiClient from "./apiClient";
import {
  EarningsDailyResponse,
  EarningsGraphResponse,
  EarningsHistoryResponse,
  EarningsSummaryResponse,
  GetEarningsDailyParams,
  GetEarningsGraphParams,
  GetEarningsHistoryParams,
  GetEarningsSummaryParams,
} from "./earningsServiceTypes";

const BASE_PATH = "/apps/deliveries/store/wallet/earnings";

export const earningsService = {
  getEarningsGraph: (params: GetEarningsGraphParams = {}) =>
    apiClient.get<EarningsGraphResponse>(
      `${BASE_PATH}/graph`,
      params as Record<string, unknown>,
    ),
  getEarningsDaily: (params: GetEarningsDailyParams = {}) =>
    apiClient.get<EarningsDailyResponse>(
      `${BASE_PATH}/daily`,
      {
        page: params.page,
        limit: params.limit,
        ...(params.startDate ? { startDate: params.startDate } : {}),
        ...(params.endDate ? { endDate: params.endDate } : {}),
      },
    ),
  getEarningsSummary: (params: GetEarningsSummaryParams) =>
    apiClient.get<EarningsSummaryResponse>(
      `${BASE_PATH}/summary`,
      {
        page: params.page,
        limit: params.limit,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    ),
  getEarningsHistory: (params: GetEarningsHistoryParams) =>
    apiClient.get<EarningsHistoryResponse>(
      `${BASE_PATH}/history`,
      {
        page: params.page,
        limit: params.limit,
        startDate: params.startDate,
        endDate: params.endDate,
      },
    ),
};
