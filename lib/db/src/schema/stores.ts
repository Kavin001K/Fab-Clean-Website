import { boolean, integer, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const storesTable = pgTable("stores", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  coverageRadiusKm: real("coverage_radius_km").notNull().default(3),
  mapHref: text("map_href"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStoreSchema = createInsertSchema(storesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof storesTable.$inferSelect;
