import React from "react";
import GenericOrderList from "../../components/orders/GenericOrderList";
import { usePickupOrders } from "../../hooks/useOrderQueries";

export default function PickupScreen() {
  const renderActions = () => ({});

  return (
    <GenericOrderList
      useOrdersHook={usePickupOrders}
      renderActions={renderActions}
    />
  );
}
