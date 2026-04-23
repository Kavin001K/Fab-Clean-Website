import { Router, type IRouter } from "express";
import { asc, eq } from "drizzle-orm";
import { db, storesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/stores", async (req, res) => {
  try {
    const stores = await db
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
      .orderBy(asc(storesTable.sortOrder), asc(storesTable.name));

    res.json({
      success: true,
      data: stores,
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
