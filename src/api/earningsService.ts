import apiClient from "./apiClient";
import {
  EarningsHistoryResponse,
  EarningsGraphResponse,
  GetEarningsHistoryParams,
  GetEarningsGraphParams,
} from "./earningsServiceTypes";

const BASE_PATH = "/apps/deliveries/store/wallet/earnings";

export const earningsService = {
  getEarningsGraph: (params: GetEarningsGraphParams = {}) =>
    apiClient.get<EarningsGraphResponse>(
      `${BASE_PATH}/graph`,
      params as Record<string, unknown>,
    ),
  getEarningsHistory: (params: GetEarningsHistoryParams = {}) =>
    apiClient.get<EarningsHistoryResponse>(
      `${BASE_PATH}/history`,
      {
        page: params.page,
        limit: params.limit,
        ...(params.startDate ? { startDate: params.startDate } : {}),
        ...(params.endDate ? { endDate: params.endDate } : {}),
      },
    ),
};
