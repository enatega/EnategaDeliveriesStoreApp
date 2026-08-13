import type { Order } from '../api/orderServicesTypes';

const LINE_WIDTH = 42;

function selectedOptionLabels(value: unknown): string[] {
  if (!value) return [];

  let parsed = value;
  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }

  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((item) => {
    if (typeof item === 'string') return item.trim() ? [item.trim()] : [];
    if (!item || typeof item !== 'object') return [];
    const option = item as Record<string, unknown>;
    const label = option.title ?? option.name ?? option.label;
    return typeof label === 'string' && label.trim() ? [label.trim()] : [];
  });
}

function row(label: string, value: string) {
  const available = Math.max(1, LINE_WIDTH - value.length - 1);
  const safeLabel = label.length > available ? label.slice(0, available) : label;
  return `${safeLabel}${' '.repeat(Math.max(1, LINE_WIDTH - safeLabel.length - value.length))}${value}`;
}

export function formatOrderInvoice(
  order: Order,
  formatAmount: (value: number, fractionDigits?: number) => string,
) {
  const lines = [
    'INVOICE',
    '-'.repeat(LINE_WIDTH),
    `Order: ${order.orderCode || order.orderId}`,
    `Date: ${new Date(order.createdAt).toLocaleString()}`,
    `Customer: ${order.customerName || '-'}`,
    `Type: ${order.orderType === 'pickup' ? 'Pickup' : 'Delivery'}`,
  ];

  const address = order.orderType === 'pickup' ? order.pickupAddress : order.deliveryAddress;
  if (address) lines.push(`Address: ${address}`);

  lines.push('', 'ITEMS', '-'.repeat(LINE_WIDTH));
  order.items.forEach((item) => {
    lines.push(`${item.quantity} x ${item.name}`);
    selectedOptionLabels(item.selectedOptions).forEach((option) => lines.push(`  + ${option}`));
    lines.push(row('', formatAmount(item.totalPrice, 2)));
  });

  const summary = order.orderSummary;
  lines.push('', '-'.repeat(LINE_WIDTH));
  if (typeof summary?.itemSubtotal === 'number') {
    lines.push(row('Subtotal', formatAmount(summary.itemSubtotal, 2)));
  }
  if (summary?.discountAmount) lines.push(row('Discount', `-${formatAmount(summary.discountAmount, 2)}`));
  if (summary?.taxAmount) lines.push(row('Tax', formatAmount(summary.taxAmount, 2)));
  if (summary?.packingCharges) lines.push(row('Packing', formatAmount(summary.packingCharges, 2)));
  if (summary?.deliveryFee) lines.push(row('Delivery', formatAmount(summary.deliveryFee, 2)));
  if (summary?.courierTip) lines.push(row('Tip', formatAmount(summary.courierTip, 2)));
  lines.push(row('TOTAL', formatAmount(summary?.totalAmount ?? order.orderAmount, 2)));

  const note = summary?.note || order.restaurantNote || order.customerComment;
  if (note) lines.push('', `Note: ${note}`);
  lines.push('', 'Thank you');
  return lines.join('\n');
}
