import { GetOrdersParams } from "./orderServicesTypes";

export const authKeys = {
  all: ["auth"] as const,
  session: () => [...authKeys.all, "session"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

// Base key for all order‑related queries
export const ordersKeys = {
  all: ["orders"] as const,
  new: () => [...ordersKeys.all, "new"] as const,
  inProgress: () => [...ordersKeys.all, "inProgress"] as const,
  ready: () => [...ordersKeys.all, "ready"] as const,
  pickup: () => [...ordersKeys.all, "pickup"] as const,
  completed: () => [...ordersKeys.all, "completed"] as const,
};

// For infinite lists with params
export const newOrdersKeys = {
  all: ordersKeys.new,
  lists: () => [...ordersKeys.new(), "list"] as const,
  list: (params: GetOrdersParams) =>
    [...newOrdersKeys.lists(), params] as const,
};

export const inProgressOrdersKeys = {
  all: ordersKeys.inProgress,
  lists: () => [...ordersKeys.inProgress(), "list"] as const,
  list: (params: GetOrdersParams) =>
    [...inProgressOrdersKeys.lists(), params] as const,
};

export const readyOrdersKeys = {
  all: ordersKeys.ready,
  lists: () => [...ordersKeys.ready(), "list"] as const,
  list: (params: GetOrdersParams) =>
    [...readyOrdersKeys.lists(), params] as const,
};

export const pickupOrdersKeys = {
  all: ordersKeys.pickup,
  lists: () => [...ordersKeys.pickup(), "list"] as const,
  list: (params: GetOrdersParams) =>
    [...pickupOrdersKeys.lists(), params] as const,
};

export const completedOrdersKeys = {
  all: ordersKeys.completed,
  lists: () => [...ordersKeys.completed(), "list"] as const,
  list: (params: GetOrdersParams) =>
    [...completedOrdersKeys.lists(), params] as const,
};
