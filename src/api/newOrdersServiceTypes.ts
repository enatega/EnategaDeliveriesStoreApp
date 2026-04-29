// ──────────────────────────────────────────────────────────────────
// Request Parameters
// ──────────────────────────────────────────────────────────────────

export type GetNewOrdersParams = {
  offset?: number;      // default 0
  limit?: number;       // default 10
  search?: string;
  orderType?: 'all' | 'delivery' | 'pickup';
};

// ──────────────────────────────────────────────────────────────────
// Order Item (product inside an order)
// ──────────────────────────────────────────────────────────────────

export interface NewOrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  selectedOptions: string | null; // or more specific if needed
}

// ──────────────────────────────────────────────────────────────────
// New Order (pending / scheduled)
// ──────────────────────────────────────────────────────────────────

export interface NewOrder {
  orderId: string;
  orderCode: string;        // e.g. "#7481F79D"
  status: 'pending' | 'scheduled';  // API returns these two for "new orders"
  statusLabel: string;      // e.g. "New Order"
  orderType: 'delivery' | 'pickup';
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  pickupAddress: string;
  orderAmount: number;
  itemCount: number;
  items: NewOrderItem[];
  customerComment: string;
  preparingTimeInMinutes: number | null;
  riderName: string | null;
  riderPhone: string | null;
  riderVehicle: string | null;
  riderArrived: boolean;
  createdAt: string;        // ISO date
  canAccept: boolean;
  canReject: boolean;
}

// ──────────────────────────────────────────────────────────────────
// Paginated response from the API
// ──────────────────────────────────────────────────────────────────

export interface PaginatedNewOrdersResponse {
  items: NewOrder[];
  offset: number;
  limit: number;
  total: number;
  isEnd: boolean;
  nextOffset: number | null;
}