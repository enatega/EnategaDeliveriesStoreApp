import React from "react";
import GenericOrderList from "../../components/orders/GenericOrderList";
import { useReadyOrders } from "../../hooks/useOrderQueries";
import { useUpdateOrderStatus } from "../../hooks/useOrderMutations";
import { OrderStatus } from "../../api/orderServicesTypes";

export default function ReadyScreen() {
  const updateStatus = useUpdateOrderStatus();

  // Todo30April: need huzaifa assistance here for confirming the status of the order. 
  const handleConfirmPickup = (orderId: string) => {
    updateStatus.mutate({ orderId, data: { status: OrderStatus.PICKED_UP } });
  };

  const renderActions = () => ({
    onConfirmPickup: handleConfirmPickup,
    isConfirmingPickup: updateStatus.isPending,
  });

  return (
    <GenericOrderList
      useOrdersHook={useReadyOrders}
      renderActions={renderActions}
    />
  );
}