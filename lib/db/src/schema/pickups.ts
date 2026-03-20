import { pgTable, text, timestamp, uuid, real, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const timeSlotEnum = pgEnum("time_slot", ["morning", "afternoon", "evening"]);
export const branchEnum = pgEnum("branch", ["pollachi", "kinathukadavu"]);
export const pickupStatusEnum = pgEnum("pickup_status", [
  "pending",
  "confirmed",
  "picked_up",
  "processing",
  "ready",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export const pickupsTable = pgTable("pickups", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  bookingReference: text("booking_reference").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  address: text("address").notNull(),
  addressLat: real("address_lat"),
  addressLng: real("address_lng"),
  services: text("services").array().notNull(),
  specialInstructions: text("special_instructions"),
  preferredDate: text("preferred_date").notNull(),
  timeSlot: timeSlotEnum("time_slot").notNull(),
  branch: branchEnum("branch").notNull(),
  status: pickupStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPickupSchema = createInsertSchema(pickupsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type InsertPickup = z.infer<typeof insertPickupSchema>;
export type Pickup = typeof pickupsTable.$inferSelect;
