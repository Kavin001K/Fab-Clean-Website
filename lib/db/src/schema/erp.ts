import { pgTable, text, timestamp, integer, decimal, varchar, jsonb } from "drizzle-orm/pg-core";

// We define the ERP tables here so the Website can query them directly
// Since they share the same database, this is safe.

export const erpCustomers = pgTable("customers", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  secondaryPhone: text("secondary_phone"),
  address: jsonb("address"),
  walletBalanceCache: decimal("wallet_balance_cache", { precision: 10, scale: 2 }).default("0"),
  creditBalance: decimal("credit_balance", { precision: 10, scale: 2 }).default("0"),
  creditLimit: decimal("credit_limit", { precision: 10, scale: 2 }).default("-500"),
});

export const erpOrders = pgTable("orders", {
  id: varchar("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  customerId: text("customer_id").references(() => erpCustomers.id),
  status: text("status").notNull(),
  paymentStatus: text("payment_status").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  items: jsonb("items").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
