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
    setPendingOrderId(orderId);
    setModalVisible(true);
  };

  const handleReject = (orderId: string) => {
    rejectMutation.mutate(orderId);
  };

  const handleSetPreparingTime = async (minutes: number) => {
    if (!pendingOrderId) return;

    const orderId = pendingOrderId;

    try {
      await acceptMutation.mutateAsync(orderId);
      await updateTimeMutation.mutateAsync({
        orderId,
        data: { preparingTimeInMinutes: minutes },
      });
      setModalVisible(false);
      setPendingOrderId(null);
    } catch {
      // Keep modal open so user can retry if needed.
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setPendingOrderId(null);
  };

  const renderActions = () => ({
    onAccept: handleAccept,
    onReject: handleReject,
    isAccepting: acceptMutation.isPending || updateTimeMutation.isPending,
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
