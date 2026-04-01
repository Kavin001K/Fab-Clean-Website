import type { PortalOrder, TrackingStep } from "@workspace/api-client-react";

export const GOOGLE_REVIEW_URL = import.meta.env.VITE_GOOGLE_REVIEW_URL || "";

export type {
  FeedbackContext,
  PortalOrder,
  PortalOrderItem,
  PublicReview,
  TrackingStep,
} from "@workspace/api-client-react";

export function getOrderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Order Placed",
    processing: "In Process",
    in_store: "At Store",
    ready_for_pickup: "Ready for Pickup",
    ready: "Ready for Pickup",
    out_for_delivery: "Out for Delivery",
    completed: "Completed",
    delivered: "Completed",
    cancelled: "Cancelled",
  };

  return labels[status] || status.replace(/_/g, " ");
}

export function getOrderStatusTone(status: string) {
  const tones: Record<string, string> = {
    pending: "bg-accent/20 text-[#C45D0E] border border-[#F4B942]/30",
    processing: "bg-primary/12 text-primary border border-primary/20",
    in_store: "bg-[#D6EBF7] text-[#0B1C3B] border border-primary/10",
    ready_for_pickup: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    ready: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    out_for_delivery: "bg-violet-100 text-violet-700 border border-violet-200",
    completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    cancelled: "bg-rose-100 text-rose-700 border border-rose-200",
  };

  return tones[status] || "bg-muted text-muted-foreground border border-border";
}

export function buildTrackingSteps(order: PortalOrder): TrackingStep[] {
  const isDelivery = String(order.fulfillmentType || "").toLowerCase() === "delivery";
  const steps = isDelivery
    ? [
        { key: "pending", label: "Placed" },
        { key: "processing", label: "Cleaning" },
        { key: "out_for_delivery", label: "On the Way" },
        { key: "completed", label: "Delivered" },
      ]
    : [
        { key: "pending", label: "Placed" },
        { key: "processing", label: "Cleaning" },
        { key: "ready_for_pickup", label: "Ready" },
        { key: "completed", label: "Collected" },
      ];

  const statusMap: Record<string, string> = {
    pending: "pending",
    received: "pending",
    processing: "processing",
    in_store: "processing",
    ready: "ready_for_pickup",
    ready_for_pickup: "ready_for_pickup",
    out_for_delivery: "out_for_delivery",
    delivered: "completed",
    completed: "completed",
  };

  const currentKey = statusMap[order.status] || "pending";
  const currentIndex = Math.max(0, steps.findIndex((step) => step.key === currentKey));

  return steps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    current: index === currentIndex,
  }));
}

export function formatReviewDate(value: string) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
