import { Router, type IRouter } from "express";
import { fetchHomepageReviews } from "../lib/supabase-admin.js";

const router: IRouter = Router();

router.get("/reviews/homepage", async (req, res) => {
  try {
    const data = await fetchHomepageReviews();
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    req.log.error(err, "Failed to load homepage reviews");
    const message = err instanceof Error ? err.message : "Failed to load reviews";
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to load reviews",
        details: process.env["NODE_ENV"] === "production" ? undefined : message,
      },
    });
  }
});

export default router;
