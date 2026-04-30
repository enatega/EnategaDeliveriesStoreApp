import React, { useState } from "react";
import GenericOrderList from "../../components/orders/GenericOrderList";
import { useNewOrders } from "../../hooks/useOrderQueries";
import {
  useAcceptOrder,
  useRejectOrder,
  useUpdatePreparingTime,
} from "../../hooks/useOrderMutations";
import SetPreparingTimeModal from "../../components/SetPreparingTimeModal";

export default function NewOrdersScreen() {
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const acceptMutation = useAcceptOrder();
  const rejectMutation = useRejectOrder();
  const updateTimeMutation = useUpdatePreparingTime();

  const handleAccept = (orderId: string) => {
    acceptMutation.mutate(orderId, {
      onSuccess: () => {
        setPendingOrderId(orderId);
        setModalVisible(true);
      },
    });
  };

  const handleReject = (orderId: string) => {
    rejectMutation.mutate(orderId);
  };

  const handleSetPreparingTime = (minutes: number) => {
    if (pendingOrderId) {
      updateTimeMutation.mutate(
        { orderId: pendingOrderId, data: { preparingTimeInMinutes: minutes } },
        {
          onSuccess: () => {
            setModalVisible(false);
            setPendingOrderId(null);
          },
        },
      );
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setPendingOrderId(null);
  };

  const renderActions = () => ({
    onAccept: handleAccept,
    onReject: handleReject,
    isAccepting: acceptMutation.isPending,
    isRejecting: rejectMutation.isPending,
  });

  return (
    <>
      <GenericOrderList
        useOrdersHook={useNewOrders}
        renderActions={renderActions}
      />
      <SetPreparingTimeModal
        visible={modalVisible}
        onClose={closeModal}
        onDone={handleSetPreparingTime}
      />
    </>
  );
}
