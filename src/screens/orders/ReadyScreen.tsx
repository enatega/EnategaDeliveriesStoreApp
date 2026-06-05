import React from "react";
import GenericOrderList from "../../components/orders/GenericOrderList";
import { useReadyOrders } from "../../hooks/useOrderQueries";
import { useUpdateOrderStatus } from "../../hooks/useOrderMutations";
import { OrderStatus } from "../../api/orderServicesTypes";

export default function ReadyScreen() {
  const updateStatus = useUpdateOrderStatus();

  const handleConfirmPickup = (orderId: string) => {
    console.log("[ReadyScreen] confirm pickup for instant order", {
      orderId,
      payload: {
        status: OrderStatus.OUT_FOR_DELIVERY,
      },
    });
    updateStatus.mutate({ orderId, data: { status: OrderStatus.OUT_FOR_DELIVERY } });
  };

  const renderActions = (order: { isInstantOrder: boolean }) => ({
    onConfirmPickup: order.isInstantOrder ? handleConfirmPickup : undefined,
    isConfirmingPickup: updateStatus.isPending,
  });

  return (
    <GenericOrderList
      useOrdersHook={useReadyOrders}
      renderActions={renderActions}
    />
  );
}
