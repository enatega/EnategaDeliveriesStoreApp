import React from "react";
import GenericOrderList from "../../components/orders/GenericOrderList";
import { usePickupOrders } from "../../hooks/useOrderQueries";
import { useConfirmNonInstantPickup } from "../../hooks/useOrderMutations";
import { Order, OrderStatus } from "../../api/orderServicesTypes";

export default function PickupScreen() {
  const confirmNonInstantPickupMutation = useConfirmNonInstantPickup();

  const handleConfirmNonInstantPickup = (orderId: string) => {
    console.log("[PickupScreen] confirm pickup for non-instant order", {
      orderId,
      payload: {
        is_confirm_pickup: true,
      },
    });
    confirmNonInstantPickupMutation.mutate({
      orderId,
      data: { isConfirmPickup: true },
    });
  };

  const renderActions = (order: Order) => ({
    onConfirmPickup: !order.isInstantOrder && order.status === OrderStatus.PICKED_UP
      ? (orderId: string) => {
          console.log("[PickupScreen] confirm pickup tapped", {
            orderId,
            isInstantOrder: order.isInstantOrder,
            status: order.status,
            orderCode: order.orderCode,
          });
          handleConfirmNonInstantPickup(orderId);
        }
      : undefined,
    isConfirmingPickup: confirmNonInstantPickupMutation.isPending,
  });

  return (
    <GenericOrderList
      useOrdersHook={usePickupOrders}
      renderActions={renderActions}
    />
  );
}
