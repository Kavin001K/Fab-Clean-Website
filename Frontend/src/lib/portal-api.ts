import { getApiBaseUrl } from "@/lib/api-base";

const API_BASE = getApiBaseUrl();

async function request<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.message || payload?.message || "Request failed");
  }

  return payload as T;
}

export type WalletSummary = {
  balance: number;
  creditBalance: number;
  totalOrders: number;
  totalSpent: number;
  currency: string;
  available: boolean;
};

export async function fetchWalletSummary(token: string) {
  return request<{ success: boolean; data: WalletSummary }>("/api/wallet/summary", token);
}
