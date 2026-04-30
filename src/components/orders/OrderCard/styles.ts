import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 14,
  },
  orderIdBold: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
  },
  customerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  customerName: {
    fontSize: 15,
  },
  orderTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  orderTypeText: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 4,
    marginTop: 2,
  },
  address: {
    fontSize: 13,
    flex: 1,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  itemsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  colHeader: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  colHeaderRight: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "right",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  foodImageBox: {
    width: 48,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  foodImage: {
    width: "100%",
    height: "100%",
  },
  foodImagePlaceholder: {
    width: "100%",
    height: "100%",
  },
  itemInfo: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    fontSize: 14,
  },
  itemQty: {
    fontSize: 12,
  },
  itemPrice: {
    fontSize: 14,
    minWidth: 36,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 2,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 16,
  },
  commentBox: {
    borderRadius: 4,
    paddingVertical: 6,
    gap: 4,
  },
  commentLabel: {
    fontSize: 14,
  },
  commentText: {
    fontSize: 15,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnReject: {
    borderWidth: 1.5,
    borderColor: "#EF4444",
    backgroundColor: "transparent",
  },
  btnRejectText: {
    fontSize: 16,
  },
  btnAccept: {},
  btnAcceptText: {
    fontSize: 16,
  },
  // In Progress specific styles
  riderStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  riderStatusText: {
    fontSize: 12,
    color: "#B91C1C",
    fontWeight: "500",
  },
  riderInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  riderInfoText: {
    fontSize: 12,
    color: "#4B5563",
  },
  preparingStatusBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  preparingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  preparingText: {
    fontSize: 14,
    color: "#047857",
    fontWeight: "500",
  },
  timerText: {
    fontSize: 20,
    color: "#047857",
    fontWeight: "600",
  },
  inProgressActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  btnPlusTime: {
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPlusTimeText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  btnMarkReady: {
    flex: 1,
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnMarkReadyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  // Ready specific styles
  readyTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  readyRiderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#D1FAE5",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  readyRiderText: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
  pickupRiderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FEF9C3",
    borderColor: "#FDE047",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  pickupRiderText: {
    fontSize: 14,
    color: "#CA8A04",
    fontWeight: "500",
  },
  actionButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  riderDetailsBox: {
    backgroundColor: "#F9FAFB",
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
    gap: 6,
  },
  riderNameText: {
    fontSize: 15,
  },
  riderVehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  riderVehicleText: {
    fontSize: 13,
  },
  btnConfirmPickup: {
    height: 48,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  btnConfirmPickupText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Completed specific styles
  deliveredBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  deliveredBadgeText: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "500",
  },
  completedRiderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  completedRiderInfo: {
    gap: 4,
  },
  completedRiderLabel: {
    fontSize: 12,
  },
  completedRiderName: {
    fontSize: 15,
  },
  completedFooterBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    marginHorizontal: -16,
    marginBottom: -16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
  },
  completedFooterCol: {
    gap: 4,
  },
  completedFooterLabel: {
    fontSize: 12,
  },
  completedFooterValue: {
    fontSize: 14,
  },
  riderArrivedBadge: {
    backgroundColor: "#D1FAE5",
    borderColor: "#A7F3D0",
  },
});
