type SupabaseMethod = "GET" | "POST" | "PATCH";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function buildUrl(path: string): string {
  const baseUrl = getRequiredEnv("SUPABASE_URL").replace(/\/$/, "");
  return `${baseUrl}${path}`;
}

async function request<T>(
  path: string,
  method: SupabaseMethod,
  body?: unknown,
  extraHeaders?: Record<string, string>,
): Promise<T> {
  const serviceKey = getRequiredEnv("SUPABASE_SERVICE_KEY");
  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await response.text();
  const parsed = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(parsed?.message || parsed?.error || text || `Supabase request failed: ${response.status}`);
  }

  return parsed as T;
}

export type PublicOrderRecord = {
  id: string;
  order_number: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  status: string;
  payment_status: string | null;
  total_amount: number | string | null;
  items: unknown[] | null;
  fulfillment_type: string | null;
  pickup_date: string | null;
  invoice_url: string | null;
  created_at: string;
  updated_at: string;
  rating?: number | null;
  feedback?: string | null;
  ai_category?: string | null;
  ai_sentiment?: string | null;
  ai_score?: number | null;
};

export type ReviewRecord = {
  id: string;
  order_id: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  rating: number;
  feedback: string | null;
  feedback_source: string | null;
  feedback_status: string;
  ai_category: string | null;
  ai_sentiment: string | null;
  ai_score: number | null;
  created_at: string;
};

function encodeIdentifier(value: string): string {
  return encodeURIComponent(value.trim());
}

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value.trim());
}

function normalizeOrderIdentifier(value: string): string {
  return value.trim();
}

function normalizeOrderNumber(value: string): string {
  return normalizeOrderIdentifier(value).toUpperCase();
}

export async function fetchOrderByIdentifier(identifier: string): Promise<PublicOrderRecord | null> {
  const clean = normalizeOrderIdentifier(identifier);
  if (!clean) return null;

  const select =
    "id,order_number,customer_id,customer_name,customer_phone,status,payment_status,total_amount,items,fulfillment_type,pickup_date,invoice_url,created_at,updated_at,rating,feedback,ai_category,ai_sentiment,ai_score";

  if (isUuid(clean)) {
    const byId = await request<PublicOrderRecord[]>(
      `/rest/v1/orders?select=${select}&id=eq.${encodeIdentifier(clean)}&limit=1`,
      "GET",
    );
    if (byId[0]) return byId[0];
  }

  const byOrderNumber = await request<PublicOrderRecord[]>(
    `/rest/v1/orders?select=${select}&order_number=eq.${encodeIdentifier(normalizeOrderNumber(clean))}&limit=1`,
    "GET",
  );
  if (byOrderNumber[0]) return byOrderNumber[0];

  if (!isUuid(clean)) {
    return null;
  }

  const byRawOrderNumber = await request<PublicOrderRecord[]>(
    `/rest/v1/orders?select=${select}&order_number=eq.${encodeIdentifier(clean)}&limit=1`,
    "GET",
  );
  return byRawOrderNumber[0] ?? null;
}

export async function fetchReviewByOrderId(orderId: string): Promise<ReviewRecord | null> {
  const rows = await request<ReviewRecord[]>(
    `/rest/v1/reviews_table?select=id,order_id,customer_id,customer_name,customer_phone,rating,feedback,feedback_source,feedback_status,ai_category,ai_sentiment,ai_score,created_at&order_id=eq.${encodeIdentifier(orderId)}&limit=1`,
    "GET",
  );
  return rows[0] ?? null;
}

export async function upsertReview(payload: Record<string, unknown>): Promise<ReviewRecord> {
  const rows = await request<ReviewRecord[]>(
    `/rest/v1/reviews_table?on_conflict=order_id`,
    "POST",
    payload,
    {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
  );
  if (!rows[0]) {
    throw new Error("Failed to upsert review");
  }
  return rows[0];
}

export async function updateOrder(orderId: string, payload: Record<string, unknown>): Promise<void> {
  await request(
    `/rest/v1/orders?id=eq.${encodeIdentifier(orderId)}`,
    "PATCH",
    payload,
    {
      Prefer: "return=minimal",
    },
  );
}

export async function callRpc<T>(name: string, payload?: Record<string, unknown>): Promise<T> {
  return request<T>(`/rest/v1/rpc/${name}`, "POST", payload ?? {});
}
