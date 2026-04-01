const getApiBase = () => {
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || "/api";
  }
  return import.meta.env.VITE_API_URL || "/api";
};

const API_BASE = getApiBase().replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || "Request failed");
  }
  return payload as T;
}

export type PublicTrackedOrder = {
  id: string;
  reference: string;
  orderId: string;
  customerName?: string;
  status: string;
  paymentStatus?: string;
  totalAmount?: number;
  services: string[];
  branch: string;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
  invoiceUrl?: string;
  stages: Array<{
    stage: string;
    label: string;
    completed: boolean;
  }>;
};

export type FeedbackLookupResponse = {
  orderId: string;
  orderNumber: string;
  customerName?: string;
  status: string;
  existingReview?: {
    id: string;
    rating: number;
    feedback: string | null;
    feedback_status: string;
    ai_category: string | null;
    ai_sentiment: string | null;
    ai_score: number | null;
  } | null;
};

export type FeedbackSubmitResponse = {
  orderId: string;
  orderNumber: string;
  reviewId: string;
  insight: {
    category: string;
    sentiment: "positive" | "neutral" | "negative";
    score: number;
    summary: string;
  };
};

export async function trackOrderById(identifier: string) {
  return request<{ success: boolean; data: PublicTrackedOrder }>(
    `/orders/track/by-id/${encodeURIComponent(identifier)}`,
  );
}

export async function lookupFeedbackOrder(identifier: string) {
  return request<{ success: boolean; data: FeedbackLookupResponse }>(
    `/feedback/order/${encodeURIComponent(identifier)}`,
  );
}

export async function submitPublicFeedback(payload: {
  identifier: string;
  rating: number;
  feedback: string;
}) {
  return request<{ success: boolean; data: FeedbackSubmitResponse }>("/feedback/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
