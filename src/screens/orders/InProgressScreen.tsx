import React from "react";
import GenericOrderList from "../../components/orders/GenericOrderList";
import { useInProgressOrders } from "../../hooks/useOrderQueries";
import {
  useUpdateOrderStatus,
  useUpdatePreparingTime,
} from "../../hooks/useOrderMutations";
import { OrderStatus } from "../../api/orderServicesTypes";

export default function InProgressScreen() {
  const updateStatus = useUpdateOrderStatus();
  const updateTime = useUpdatePreparingTime();

  const handleMarkReady = (orderId: string) => {
    updateStatus.mutate({ orderId, data: { status: OrderStatus.READY } });
  };

  const handleUpdatePreparingTime = (orderId: string, minutes: number) => {
    updateTime.mutate({ orderId, data: { preparingTimeInMinutes: minutes } });
  };

  const renderActions = () => ({
    onMarkReady: handleMarkReady,
    onUpdatePreparingTime: handleUpdatePreparingTime,
    isMarkingReady: updateStatus.isPending,
    isUpdatingTime: updateTime.isPending,
  });

  return (
    <GenericOrderList
      useOrdersHook={useInProgressOrders}
      renderActions={renderActions}
    />
  );
}