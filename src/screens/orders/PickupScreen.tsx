import React, { useState } from "react";
import GenericOrderList from "../../components/orders/GenericOrderList";
import { usePickupOrders } from "../../hooks/useOrderQueries";
import { useConfirmNonInstantPickup } from "../../hooks/useOrderMutations";
import { Order, OrderStatus } from "../../api/orderServicesTypes";

export default function PickupScreen() {
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(null);
  const confirmNonInstantPickupMutation = useConfirmNonInstantPickup();

  const handleConfirmNonInstantPickup = (orderId: string) => {
    console.log("[PickupScreen] confirm pickup for non-instant order", {
      orderId,
      payload: {
        is_confirm_pickup: true,
      },
    });
    setConfirmingOrderId(orderId);
    confirmNonInstantPickupMutation.mutate(
      {
        orderId,
        data: { isConfirmPickup: true },
      },
      {
        onSettled: () => {
          setConfirmingOrderId((current) => (current === orderId ? null : current));
        },
      },
    );
  };

  const renderActions = (order: Order) => ({
    onConfirmPickup:
      !order.isInstantOrder
      && order.status === OrderStatus.PICKED_UP
      && !order.isConfirmPickup
      ? (orderId: string) => {
          console.log("[PickupScreen] confirm pickup tapped", {
            orderId,
            isInstantOrder: order.isInstantOrder,
            status: order.status,
            isConfirmPickup: order.isConfirmPickup,
            orderCode: order.orderCode,
          });
          handleConfirmNonInstantPickup(orderId);
        }
      : undefined,
    isConfirmingPickup:
      confirmNonInstantPickupMutation.isPending && confirmingOrderId === order.orderId,
  });

  return (
    <GenericOrderList
      useOrdersHook={usePickupOrders}
      renderActions={renderActions}
      listContext="pickup"
    />
  );
}
