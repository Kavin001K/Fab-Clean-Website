const getApiBase = () => {
  const configured = import.meta.env.VITE_API_URL?.trim();

  if (import.meta.env.PROD && !configured) {
    throw new Error("VITE_API_URL is required for production builds");
  }

  const candidate = configured || "/api";

  if (!candidate.startsWith("http://") && !candidate.startsWith("https://")) {
    return candidate;
  }

  const parsed = new URL(candidate);
  if (parsed.pathname === "/" || parsed.pathname === "") {
    parsed.pathname = "/api";
  }

  return parsed.toString();
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
  customerPhone?: string;
  status: string;
  existingReview?: {
    id: string;
    customer_name?: string | null;
    customer_phone?: string | null;
    rating: number;
    feedback: string | null;
    feedback_source?: string | null;
    feedback_status: string;
    ai_category: string | null;
    ai_sentiment: string | null;
    ai_score: number | null;
    created_at?: string;
  } | null;
};

export type FeedbackSubmitResponse = {
  orderId: string;
  orderNumber: string;
  customerName?: string | null;
  customerPhone?: string | null;
  reviewId: string;
  reviewCreatedAt?: string;
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
