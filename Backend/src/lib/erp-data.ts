import { pool } from "@workspace/db";

export interface PortalOrderItem {
  serviceName: string;
  quantity: number;
  price: number;
}

export interface PortalOrder {
  id: string;
  orderNumber: string;
  reference: string;
  status: string;
  paymentStatus: string;
  totalAmount: number | null;
  services: string[];
  items: PortalOrderItem[];
  branch: string;
  fulfillmentType: string;
  scheduledDate: string | null;
  createdAt: string;
  updatedAt: string | null;
  pickupDate: string | null;
  invoiceUrl: string | null;
  lastWhatsappStatus: string | null;
  lastWhatsappSentAt: string | null;
  customerName: string | null;
  customerPhone: string | null;
  customerEmail: string | null;
  customerRating: number | null;
  feedbackComment: string | null;
  feedbackSubmittedAt: string | null;
}

export interface TrackingStep {
  key: string;
  label: string;
  completed: boolean;
  current: boolean;
}

export interface PublicReview {
  id: string;
  rating: number;
  comment: string | null;
  isTopRating: boolean;
  isBestRating: boolean;
  curationScore: number | null;
  curationReason: string | null;
  aiProvider: string | null;
  aiModel: string | null;
  createdAt: string;
  customerName: string;
  location: string;
  orderNumber: string | null;
}

function normalizeDigits(value: string | null | undefined): string {
  return String(value || "").replace(/\D/g, "");
}

export function normalizePhone(value: string | null | undefined): string {
  const digits = normalizeDigits(value);
  return digits.length > 10 ? digits.slice(-10) : digits;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseItems(raw: unknown): PortalOrderItem[] {
  const value = typeof raw === "string" ? JSON.parse(raw) : raw;
  if (!Array.isArray(value)) return [];

  return value.map((item: any) => ({
    serviceName: String(item?.serviceName || item?.service_name || item?.name || item?.customName || "Service"),
    quantity: Number(item?.quantity || 1),
    price: Number(item?.price || item?.unitPrice || item?.subtotal || 0),
  }));
}

function formatBranchLabel(value: string | null | undefined): string {
  const normalized = String(value || "").trim().toUpperCase();
  const labels: Record<string, string> = {
    POL: "Pollachi",
    KIN: "Kinathukadavu",
    MCET: "MCET",
    UDM: "Udumalpet",
  };

  if (labels[normalized]) return labels[normalized];
  if (!normalized) return "Pollachi";
  return normalized;
}

function toDisplayName(name: string | null | undefined): string {
  const trimmed = String(name || "").trim();
  if (!trimmed) return "Fab Clean Customer";
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1].charAt(0).toUpperCase()}.`;
}

export function buildTrackingSteps(order: PortalOrder): TrackingStep[] {
  const fulfillment = String(order.fulfillmentType || "pickup").toLowerCase();
  const steps =
    fulfillment === "delivery"
      ? [
          { key: "pending", label: "Order Placed" },
          { key: "processing", label: "In Process" },
          { key: "out_for_delivery", label: "Out for Delivery" },
          { key: "completed", label: "Completed" },
        ]
      : [
          { key: "pending", label: "Order Placed" },
          { key: "processing", label: "In Process" },
          { key: "ready_for_pickup", label: "Ready for Pickup" },
          { key: "completed", label: "Completed" },
        ];

  const statusMap: Record<string, string> = {
    pending: "pending",
    received: "pending",
    processing: "processing",
    in_store: "processing",
    ready_for_pickup: "ready_for_pickup",
    ready: "ready_for_pickup",
    out_for_delivery: "out_for_delivery",
    delivered: "completed",
    completed: "completed",
  };

  const currentKey = statusMap[String(order.status || "").toLowerCase()] || "pending";
  const currentIndex = Math.max(0, steps.findIndex((step) => step.key === currentKey));

  return steps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    current: index === currentIndex,
  }));
}

function mapOrderRow(row: any): PortalOrder {
  const items = parseItems(row.items);

  return {
    id: row.id,
    orderNumber: row.order_number,
    reference: row.order_number,
    status: row.status,
    paymentStatus: row.payment_status || "pending",
    totalAmount: toNumber(row.total_amount),
    services: items.map((item) => item.serviceName),
    items,
    branch: formatBranchLabel(row.store_code || row.franchise_id),
    fulfillmentType: row.fulfillment_type || "pickup",
    scheduledDate: row.pickup_date || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at || null,
    pickupDate: row.pickup_date || null,
    invoiceUrl: row.invoice_url || row.resolved_invoice_url || null,
    lastWhatsappStatus: row.last_whatsapp_status || null,
    lastWhatsappSentAt: row.last_whatsapp_sent_at || null,
    customerName: row.customer_name || null,
    customerPhone: row.customer_phone || null,
    customerEmail: row.customer_email || null,
    customerRating: toNumber(row.customer_rating),
    feedbackComment: row.feedback_comment || null,
    feedbackSubmittedAt: row.feedback_submitted_at || null,
  };
}

async function resolveInvoiceUrl(order: PortalOrder): Promise<PortalOrder> {
  if (order.invoiceUrl || !order.orderNumber) return order;

  const { rows } = await pool.query(
    `
      select file_url, filepath, metadata
      from documents
      where type = 'invoice'
        and (
          order_number = $1
          or metadata ->> 'orderNumber' = $1
          or metadata ->> 'orderId' = $2
        )
      order by created_at desc nulls last
      limit 1
    `,
    [order.orderNumber, order.id]
  );

  const document = rows[0];
  const invoiceUrl =
    document?.file_url ||
    (typeof document?.filepath === "string" && document.filepath.trim().length > 0
      ? document.filepath
      : null);

  return {
    ...order,
    invoiceUrl: invoiceUrl || null,
  };
}

export async function findOrderByOrderNumber(orderNumber: string): Promise<PortalOrder | null> {
  const normalized = String(orderNumber || "").trim().replace(/^#/, "").toLowerCase();
  if (!normalized) return null;

  const { rows } = await pool.query(
    `
      select *
      from orders
      where lower(replace(coalesce(order_number, ''), '#', '')) = $1
         or lower(coalesce(id, '')) = $1
         or lower(replace(coalesce(order_number, ''), '#', '')) = ('fzc-' || $1)
         or ('fzc-' || lower(replace(coalesce(order_number, ''), '#', ''))) = $1
         or lower(replace(coalesce(order_number, ''), '#', '')) like ('%' || $1 || '%')
      order by
        case
          when lower(replace(coalesce(order_number, ''), '#', '')) = $1 then 0
          when lower(coalesce(id, '')) = $1 then 1
          else 2
        end,
        updated_at desc nulls last,
        created_at desc nulls last
      limit 1
    `,
    [normalized]
  );

  if (!rows[0]) return null;
  return resolveInvoiceUrl(mapOrderRow(rows[0]));
}

export async function findOrderById(id: string): Promise<PortalOrder | null> {
  const normalized = String(id || "").trim();
  if (!normalized) return null;

  const { rows } = await pool.query(
    `
      select *
      from orders
      where id = $1
      limit 1
    `,
    [normalized]
  );

  if (!rows[0]) return null;
  return resolveInvoiceUrl(mapOrderRow(rows[0]));
}

export async function listOrdersForPortalPhone(phone: string): Promise<PortalOrder[]> {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return [];

  const { rows } = await pool.query(
    `
      select *
      from orders
      where right(regexp_replace(coalesce(customer_phone, ''), '\\D', '', 'g'), 10) = $1
      order by created_at desc nulls last
    `,
    [normalizedPhone]
  );

  return rows.map(mapOrderRow);
}

export async function getPortalOrderById(id: string, phone: string): Promise<PortalOrder | null> {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return null;

  const { rows } = await pool.query(
    `
      select *
      from orders
      where id = $1
        and right(regexp_replace(coalesce(customer_phone, ''), '\\D', '', 'g'), 10) = $2
      limit 1
    `,
    [id, normalizedPhone]
  );

  if (!rows[0]) return null;
  return resolveInvoiceUrl(mapOrderRow(rows[0]));
}

export async function updateOrderFeedback(input: {
  orderId?: string;
  orderNumber?: string;
  rating: number;
  comment?: string | null;
  metadata?: Record<string, unknown> | null;
}) {
  const order = input.orderId
    ? await findOrderById(input.orderId)
    : await findOrderByOrderNumber(input.orderNumber ?? "");
  if (!order) return null;

  const { rows } = await pool.query(
    `
      update orders
      set customer_rating = $2,
          feedback_comment = $3,
          feedback_metadata = $4::jsonb,
          feedback_submitted_at = now(),
          updated_at = now()
      where id = $1
      returning *
    `,
    [
      order.id,
      input.rating,
      input.comment?.trim() || null,
      JSON.stringify({
        ...(input.metadata || {}),
        submittedFrom: "website",
      }),
    ]
  );

  return rows[0] ? mapOrderRow(rows[0]) : null;
}

export async function listPublicReviews(options: {
  topOnly?: boolean;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(50, Math.max(1, options.pageSize || 10));
  const offset = (page - 1) * pageSize;

  const filter = options.topOnly ? "pwr.is_top_rating = true" : "pwr.is_best_rating = true";
  const limitClause = options.topOnly ? "limit 10" : "limit $1 offset $2";
  const params = options.topOnly ? [] : [pageSize, offset];

  const { rows } = await pool.query(
    `
      select
        pwr.id,
        pwr.rating,
        pwr.comment,
        pwr.is_top_rating,
        pwr.is_best_rating,
        pwr.curation_score,
        pwr.curation_reason,
        pwr.ai_provider,
        pwr.ai_model,
        pwr.created_at,
        o.order_number,
        o.customer_name,
        coalesce(
          nullif(o.delivery_address ->> 'city', ''),
          nullif(o.shipping_address ->> 'city', ''),
          nullif(o.store_code, ''),
          'Pollachi'
        ) as location
      from public_website_reviews pwr
      left join orders o on o.id = pwr.order_id
      where ${filter}
      order by
        pwr.curation_score desc nulls last,
        pwr.rating desc,
        pwr.created_at desc,
        pwr.id asc
      ${limitClause}
    `,
    params
  );

  const reviews: PublicReview[] = rows.map((row: any) => ({
    id: row.id,
    rating: Number(row.rating || 0),
    comment: row.comment || null,
    isTopRating: Boolean(row.is_top_rating),
    isBestRating: Boolean(row.is_best_rating),
    curationScore: toNumber(row.curation_score),
    curationReason: row.curation_reason || null,
    aiProvider: row.ai_provider || null,
    aiModel: row.ai_model || null,
    createdAt: row.created_at,
    customerName: toDisplayName(row.customer_name),
    location: formatBranchLabel(row.location),
    orderNumber: row.order_number || null,
  }));

  return {
    data: reviews,
    page,
    pageSize,
    hasMore: options.topOnly ? false : reviews.length === pageSize,
  };
}
