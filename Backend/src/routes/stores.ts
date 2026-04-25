import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, storesTable } from "@workspace/db";
import { fetchAppStores } from "../lib/supabase-admin.js";

const router: IRouter = Router();

router.get("/stores", async (req, res) => {
  try {
    const [stores, appStores] = await Promise.all([
      db
      .select({
        id: storesTable.id,
        slug: storesTable.slug,
        name: storesTable.name,
        address: storesTable.address,
        phone: storesTable.phone,
        email: storesTable.email,
        latitude: storesTable.latitude,
        longitude: storesTable.longitude,
        coverageRadiusKm: storesTable.coverageRadiusKm,
        mapHref: storesTable.mapHref,
      })
      .from(storesTable)
      .where(eq(storesTable.isActive, true))
      .orderBy(asc(storesTable.sortOrder), asc(storesTable.name)),
      fetchAppStores(),
    ]);

    const mergedBySlug = new Map<string, any>();
    for (const store of stores) {
      mergedBySlug.set(store.slug, store);
    }
    for (const appStore of appStores) {
      if (!appStore.slug) continue;
      if (mergedBySlug.has(appStore.slug)) continue;
      mergedBySlug.set(appStore.slug, {
        id: appStore.code || appStore.slug,
        slug: appStore.slug,
        name: appStore.name,
        address: appStore.address || "",
        phone: appStore.phone || "",
        email: appStore.email || "",
        latitude: Number(appStore.latitude ?? 0),
        longitude: Number(appStore.longitude ?? 0),
        coverageRadiusKm: 10,
        mapHref: appStore.map_href || "",
      });
    }

    res.json({
      success: true,
      data: Array.from(mergedBySlug.values()),
    });
  } catch (err) {
    req.log.error(err, "Failed to load stores");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to load stores" },
    });
  }
});

export default router;
