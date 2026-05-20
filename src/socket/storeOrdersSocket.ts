import { io, type ManagerOptions, type Socket, type SocketOptions } from "socket.io-client";
import { apiConfig } from "../api/apiConfig";

type SocketOptionsInput = Partial<ManagerOptions & SocketOptions>;
export type SocketSubscriptionCleanup = () => void;
export type SocketEventHandler<TArgs extends unknown[] = unknown[]> = (...args: TArgs) => void;

export type SocketReceivedMessage = {
  sender: string;
  receiver: string;
  text: string;
};
export type SocketSentMessage = {
  sender: string;
  receiver: string;
  text: string;
};

type StoreHomeOrderCardDto = {
  orderId: string;
  orderCode: string;
  status:
    | "scheduled"
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "rider_assigned"
    | "picked_up"
    | "out_for_delivery"
    | "arrived"
    | "delivered"
    | "cancelled"
    | "rejected"
    | "failed";
  statusLabel: string;
  orderType: "delivery" | "pickup";
  customerName: string;
  customerPhone: string | null;
  deliveryAddress: string | null;
  pickupAddress: string | null;
  orderAmount: number;
  itemCount: number;
  items: Array<{
    productId: string;
    name: string;
    image: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    selectedOptions: string | null;
  }>;
  customerComment: string | null;
  preparingTimeInMinutes: number | null;
  preparationStartedAt: string | null;
  remainingSeconds: number | null;
  riderName: string | null;
  riderPhone: string | null;
  riderVehicle: string | null;
  riderArrived: boolean;
  riderStatus: string | null;
  riderStatusLabel: string | null;
  createdAt: string;
  canAccept: boolean;
  canReject: boolean;
};

export type StoreHomeOrderCreatedPayload = {
  storeId: string;
  order: StoreHomeOrderCardDto;
};

export type StoreOrderStatusUpdatedPayload = {
  orderId: string;
  status:
    | "scheduled"
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "rider_assigned"
    | "picked_up"
    | "out_for_delivery"
    | "arrived"
    | "delivered"
    | "cancelled"
    | "rejected"
    | "failed";
  riderStatus: string | null;
  riderId: string | null;
  updatedAt: string;
};

export type StoreRiderStatusUpdatedPayload = {
  orderId: string;
  riderStatus: string | null;
  riderId: string | null;
  riderName: string | null;
  updatedAt: string;
};

type StoreSocketSession = {
  token: string | null;
  userId: string | null;
};

function normalizeUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function buildSocketUrl() {
  const baseUrl = normalizeUrl(process.env.EXPO_PUBLIC_SOCKET_URL ?? apiConfig.baseUrl);
  return `${baseUrl}/deliveries`;
}

class StoreOrdersSocketClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private userId: string | null = null;

  private buildAuth(token: string | null) {
    return token ? { token } : {};
  }

  private emitAddUser(socket: Socket) {
    if (!this.userId) return;
    socket.emit("add-user", this.userId);
  }

  private ensureSocket(options?: SocketOptionsInput) {
    if (this.socket) {
      this.socket.auth = this.buildAuth(this.token);
      return this.socket;
    }

    this.socket = io(buildSocketUrl(), {
      autoConnect: false,
      path: process.env.EXPO_PUBLIC_SOCKET_PATH ?? "/socket.io",
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1_000,
      reconnectionDelayMax: 10_000,
      randomizationFactor: 0.5,
      timeout: 20_000,
      auth: this.buildAuth(this.token),
      ...options,
    });

    this.socket.on("connect", () => {
      this.emitAddUser(this.socket as Socket);
    });

    return this.socket;
  }

  private subscribe<TArgs extends unknown[] = unknown[]>(
    event: string,
    handler: SocketEventHandler<TArgs>,
  ): SocketSubscriptionCleanup {
    const socket = this.ensureSocket();
    const wrapped = (...args: TArgs) => handler(...args);
    socket.on(event, wrapped);

    return () => {
      socket.off(event, wrapped);
    };
  }

  connect(options?: SocketOptionsInput) {
    const socket = this.ensureSocket(options);

    if (!this.token) return socket;

    if (!socket.connected) {
      socket.connect();
    }

    return socket;
  }

  disconnect() {
    if (!this.socket?.connected) return;
    this.socket.disconnect();
  }

  updateSession(session: StoreSocketSession) {
    const tokenChanged = this.token !== session.token;
    this.token = session.token;
    this.userId = session.userId;

    if (!this.socket) return;

    this.socket.auth = this.buildAuth(this.token);

    if (!this.token) {
      this.disconnect();
      return;
    }

    if (tokenChanged && this.socket.connected) {
      this.socket.disconnect().connect();
      return;
    }

    if (this.socket.connected) {
      this.emitAddUser(this.socket);
    }
  }

  subscribeStoreHomeOrderCreated(handler: (payload: StoreHomeOrderCreatedPayload) => void) {
    return this.subscribe<[StoreHomeOrderCreatedPayload]>("store-home-order-created", handler);
  }

  subscribeOrderStatusUpdated(handler: (payload: StoreOrderStatusUpdatedPayload) => void) {
    return this.subscribe<[StoreOrderStatusUpdatedPayload]>("order-status-updated", handler);
  }

  subscribeRiderStatusUpdated(handler: (payload: StoreRiderStatusUpdatedPayload) => void) {
    return this.subscribe<[StoreRiderStatusUpdatedPayload]>("rider-status-updated", handler);
  }

  onReceiveMessage(
    handler: (message: SocketReceivedMessage) => void,
  ): SocketSubscriptionCleanup {
    return this.subscribe<[SocketReceivedMessage]>("receive-message", (message) => {
      console.log("Received socket message:", message);
      handler(message);
    });
  }

  sendMessage(message: SocketSentMessage) {
    const socket = this.socket;

    if (!socket?.connected) {
      console.log("[Socket] Send message skipped because socket is not connected", {
        receiver: message.receiver,
        sender: message.sender,
      });
      return false;
    }

    console.log("[Socket] Sending socket message", {
      receiver: message.receiver,
      sender: message.sender,
    });
    socket.emit("send-message", message);
    return true;
  }
}

export const storeOrdersSocketClient = new StoreOrdersSocketClient();
