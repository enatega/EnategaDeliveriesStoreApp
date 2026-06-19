import React, { useCallback, useState } from "react";
import GenericOrderList from "../../components/orders/GenericOrderList";
import { useNewOrders } from "../../hooks/useOrderQueries";
import {
  useAcceptOrder,
  useRejectOrder,
  useUpdatePreparingTime,
} from "../../hooks/useOrderMutations";
import SetPreparingTimeModal from "../../components/SetPreparingTimeModal";
import RejectOrderModal from "../../components/RejectOrderModal";
import { Order, OrderStatus } from "../../api/orderServicesTypes";
import { startOrderAlertLoop, stopOrderAlertLoop } from "../../hooks/orderAlertSound";

export default function NewOrdersScreen() {
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectingOrderCode, setRejectingOrderCode] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const acceptMutation = useAcceptOrder();
  const rejectMutation = useRejectOrder();
  const updateTimeMutation = useUpdatePreparingTime();

  const handleAccept = async (order: Order) => {
    console.log("[NewOrdersScreen] Accept tapped", {
      orderId: order.orderId,
      orderCode: order.orderCode,
      isInstantOrder: order.isInstantOrder,
      status: order.status,
    });

    if (!order.isInstantOrder) {
      try {
        console.log("[NewOrdersScreen] Accepting non-instant order directly", {
          orderId: order.orderId,
          isInstantOrder: order.isInstantOrder,
        });
        await acceptMutation.mutateAsync(order.orderId);
        console.log("[NewOrdersScreen] Non-instant order accepted without preparing time", {
          orderId: order.orderId,
        });
      } catch (error) {
        const runtimeError = error as { message?: string; stack?: string; name?: string };
        console.log("[NewOrdersScreen] failed to accept non-instant order", {
          orderId: order.orderId,
          error,
          errorName: runtimeError?.name,
          errorMessage: runtimeError?.message,
          errorStack: runtimeError?.stack,
        });
      }
      return;
    }

    setPendingOrderId(order.orderId);
    setModalVisible(true);
    console.log("[NewOrdersScreen] Showing preparing time modal for instant order", {
      orderId: order.orderId,
    });
  };

  const handleReject = (orderId: string, orderCode?: string) => {
    setRejectingOrderId(orderId);
    setRejectingOrderCode(orderCode ?? null);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectingOrderId) return;
    rejectMutation.mutate(
      { orderId: rejectingOrderId, data: { reason } },
      {
        onSettled: () => {
          setRejectingOrderId(null);
          setRejectingOrderCode(null);
        },
      },
    );
  };

  const closeRejectModal = () => {
    if (rejectMutation.isPending) return;
    setRejectingOrderId(null);
    setRejectingOrderCode(null);
  };

  const handleSetPreparingTime = async (minutes: number) => {
    if (!pendingOrderId) return;

    const orderId = pendingOrderId;
    console.log("[NewOrdersScreen] Preparing time confirmed", {
      orderId,
      preparingTimeInMinutes: minutes,
    });
    setModalVisible(false);
    setPendingOrderId(null);
    try {
      console.log("[NewOrdersScreen] Accepting order", { orderId });
      await acceptMutation.mutateAsync(orderId);
      console.log("[NewOrdersScreen] Accept order success", { orderId });

      console.log("[NewOrdersScreen] Setting preparing time", {
        orderId,
        preparingTimeInMinutes: minutes,
      });
      await updateTimeMutation.mutateAsync({
        orderId,
        data: { preparingTimeInMinutes: minutes },
      });
      console.log("[NewOrdersScreen] Preparing time success", {
        orderId,
        preparingTimeInMinutes: minutes,
      });
    } catch (error) {
      const runtimeError = error as { message?: string; stack?: string; name?: string };
      console.log("[NewOrdersScreen] failed to accept order / set preparing time", {
        orderId,
        error,
        errorName: runtimeError?.name,
        errorMessage: runtimeError?.message,
        errorStack: runtimeError?.stack,
      });
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setPendingOrderId(null);
  };

  const renderActions = (order: Order) => ({
    onAccept: () => handleAccept(order),
    onReject: () => handleReject(order.orderId, order.orderCode),
    isAccepting: acceptMutation.isPending || updateTimeMutation.isPending,
    isRejecting: rejectMutation.isPending,
  });

  const handleOrdersDataChange = useCallback((orders: Order[]) => {
    const hasPendingActionableOrder = orders.some((order) =>
      (order.status === OrderStatus.PENDING || order.status === OrderStatus.SCHEDULED)
      && order.canAccept,
    );

    if (hasPendingActionableOrder) {
      void startOrderAlertLoop();
      return;
    }

    void stopOrderAlertLoop();
  }, []);

  return (
    <>
      <GenericOrderList
        useOrdersHook={useNewOrders}
        renderActions={renderActions}
        listContext="new"
        onOrdersDataChange={handleOrdersDataChange}
        autoScrollToTopOnNewItem
      />
      <SetPreparingTimeModal
        visible={modalVisible}
        onClose={closeModal}
        onDone={handleSetPreparingTime}
      />
      <RejectOrderModal
        visible={Boolean(rejectingOrderId)}
        orderCode={rejectingOrderCode}
        isSubmitting={rejectMutation.isPending}
        onClose={closeRejectModal}
        onConfirm={handleRejectConfirm}
      />
    </>
  );
}
