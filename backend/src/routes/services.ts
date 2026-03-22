import { Router, type IRouter } from "express";
import { services, pricingData } from "../data/services.js";

const router: IRouter = Router();

router.get("/services", (_req, res) => {
  res.json({ success: true, data: services });
});

router.get("/services/:slug", (req, res) => {
  const service = services.find((s) => s.slug === req.params.slug);
  if (!service) {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Service not found" },
    });
    return;
  }
  res.json({ success: true, data: service });
});

router.get("/pricing", (_req, res) => {
  res.json({ success: true, data: pricingData });
});

export default router;
