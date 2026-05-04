import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useAppTheme } from "../../../theme/ThemeProvider";
import { useTranslations } from "../../../localization/LocalizationProvider";
import { Order, OrderStatus } from "../../../api/orderServicesTypes";
import { styles } from "./styles";
import OrderHeader from "./OrderHeader";
import CustomerInfo from "./CustomerInfo";
import OrderItems from "./OrderItems";
import CommentSection from "./CommentSection";
import InProgressSection from "./InProgressSection";
import ReadyPickupSection from "./ReadyPickupSection";
import CompletedSection from "./CompletedSection";
import AcceptRejectButtons from "./AcceptRejectButtons";

type Props = {
  order: Order;
  onAccept?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  onMarkReady?: (orderId: string) => void;
  onConfirmPickup?: (orderId: string) => void;
  onUpdatePreparingTime?: (orderId: string, minutes: number) => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
  isMarkingReady?: boolean;
  isConfirmingPickup?: boolean;
  isUpdatingTime?: boolean;
};

export default function OrderCard({
  order,
  onAccept,
  onReject,
  onMarkReady,
  onConfirmPickup,
  onUpdatePreparingTime,
  isAccepting,
  isRejecting,
  isMarkingReady,
  isConfirmingPickup,
  isUpdatingTime,
}: Props) {
  const { theme } = useAppTheme();
  const { t } = useTranslations("app");

  const displayAddress =
    order.orderType === "delivery" ? order.deliveryAddress : order.pickupAddress;

  // Todo30April: some fixes should be done here because
  // the time is not working correctly may be we need to use remainingSeconds here
  const startTime = order.preparationStartedAt
    ? new Date(order.preparationStartedAt).getTime()
    : null;

  const isInProgress =
    order.status === OrderStatus.PREPARING ||
    order.status === OrderStatus.ACCEPTED ||
    order.status === OrderStatus.RIDER_ASSIGNED;

  const isReadyOrPickup =
    order.status === OrderStatus.READY ||
    order.status === OrderStatus.PICKED_UP ||
    order.status === OrderStatus.OUT_FOR_DELIVERY;

  const isCompleted = order.status === OrderStatus.DELIVERED;

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.gray200 }]}>
      <OrderHeader
        orderCode={order.orderCode}
        status={order.status}
        createdAt={order.createdAt}
      />
      <CustomerInfo
        customerName={order.customerName}
        orderType={order.orderType}
        address={displayAddress}
        theme={theme}
      />
      <OrderItems items={order.items} totalAmount={order.orderAmount} theme={theme} />
      <CommentSection comment={order.customerComment} theme={theme} />

      {isInProgress && onMarkReady && onUpdatePreparingTime && (
        <InProgressSection
          orderId={order.orderId}
          riderArrived={order.riderArrived}
          riderName={order.riderName}
          riderVehicle={order.riderVehicle}
          preparingTimeInMinutes={order.preparingTimeInMinutes ?? 0}
          startTime={startTime}
          onMarkReady={onMarkReady}
          onUpdatePreparingTime={onUpdatePreparingTime}
          isMarkingReady={isMarkingReady}
          isUpdatingTime={isUpdatingTime}
          theme={theme}
        />
      )}

      {isReadyOrPickup && (
        <ReadyPickupSection
          status={order.status}
          orderId={order.orderId}
          riderArrived={order.riderArrived}
          riderName={order.riderName}
          riderVehicle={order.riderVehicle}
          riderPhone={order.riderPhone}
          onConfirmPickup={onConfirmPickup}
          showConfirmButton={order.status === OrderStatus.READY && !!onConfirmPickup}
          isConfirmingPickup={isConfirmingPickup}
          theme={theme}
        />
      )}

      {isCompleted && <CompletedSection riderName={order.riderName} createdAt={order.createdAt} theme={theme} />}

      <AcceptRejectButtons
        canAccept={order.canAccept}
        canReject={order.canReject}
        orderId={order.orderId}
        onAccept={onAccept || (() => { })}
        onReject={onReject || (() => { })}
        isAccepting={isAccepting}
        isRejecting={isRejecting}
        theme={theme}
      />
    </View>
  );
}
