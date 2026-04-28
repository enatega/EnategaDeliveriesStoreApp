import { GetNewOrdersParams } from "./newOrdersServiceTypes";

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  me: () => [...authKeys.all, 'me'] as const,
};


export const newOrdersKeys = {
  all: ['newOrders'] as const,
  lists: () => [...newOrdersKeys.all, 'list'] as const,
  list: (params: GetNewOrdersParams) => [...newOrdersKeys.lists(), params] as const,
};
