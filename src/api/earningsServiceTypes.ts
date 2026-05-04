export type GetEarningsGraphParams = {
  page?: number;
  limit?: number;
};

export type GetEarningsHistoryParams = {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export type GetEarningsSummaryParams = {
  page?: number;
  limit?: number;
  startDate: string;
  endDate: string;
};

export interface EarningsGraphItem {
  label: string;
  total_amount: number;
}

export interface EarningsGraphResponse {
  graph: EarningsGraphItem[];
  total_weeks: number;
  start_date: string;
  end_date: string;
}

export interface EarningsHistoryItem {
  order_id: string;
  payment_amount: number;
  status: string;
  created_at: string;
  label: string;
}

export interface EarningsHistoryResponse {
  data: EarningsHistoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EarningsSummaryResponse {
  total_orders: number;
  total_earnings: number;
  start_date: string;
  end_date: string;
}
