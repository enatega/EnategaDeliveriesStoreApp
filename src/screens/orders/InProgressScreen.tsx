import React from "react";
import { Alert } from "react-native";
import GenericOrderList from "../../components/orders/GenericOrderList";
import { useInProgressOrders } from "../../hooks/useOrderQueries";
import {
  useRejectOrder,
  useUpdateOrderStatus,
  useUpdatePreparingTime,
} from "../../hooks/useOrderMutations";
import { OrderStatus } from "../../api/orderServicesTypes";

export default function InProgressScreen() {
  const updateStatus = useUpdateOrderStatus();
  const rejectMutation = useRejectOrder();
  const updateTime = useUpdatePreparingTime({
    onMutate: (variables) => {
      console.log("[InProgressScreen] updatePreparingTime onMutate", variables);
    },
    onSuccess: (data, variables) => {
      console.log("[InProgressScreen] updatePreparingTime onSuccess", {
        variables,
        response: data,
      });
    },
    onError: (error) => {
      console.log("[InProgressScreen] updatePreparingTime onError", {
        message: error.message,
        status: error.status,
        code: error.code,
        data: error.data,
      });
      Alert.alert("Unable to update preparing time", error.message);
    },
  });

  const handleMarkReady = (orderId: string) => {
    updateStatus.mutate({ orderId, data: { status: OrderStatus.READY } });
  };

  const handleUpdatePreparingTime = (orderId: string, minutes: number) => {
    console.log("[InProgressScreen] handleUpdatePreparingTime", {
      orderId,
      minutes,
    });
    updateTime.mutate({ orderId, data: { preparingTimeInMinutes: minutes } });
  };
  const handleReject = (orderId: string) => {
    rejectMutation.mutate(orderId);
  };

  const renderActions = () => ({
    onReject: handleReject,
    onMarkReady: handleMarkReady,
    onUpdatePreparingTime: handleUpdatePreparingTime,
    isRejecting: rejectMutation.isPending,
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
