import { Router, type IRouter } from "express";
import { requirePortalAuth } from "../lib/portal-auth.js";
import { getPortalOrderById, listOrdersForPortalPhone } from "../lib/erp-data.js";

const router: IRouter = Router();

router.get("/orders", requirePortalAuth, async (req, res) => {
  try {
    const user = (req as any).portalUser;
    const orders = await listOrdersForPortalPhone(user.phone);
    res.json({ success: true, data: orders });
  } catch (err) {
    req.log.error(err, "Failed to list ERP-backed orders");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch orders" },
    });
  }
});

router.get("/orders/:id", requirePortalAuth, async (req, res) => {
  try {
    const user = (req as any).portalUser;
    const order = await getPortalOrderById(req.params.id, user.phone);

    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Order not found" },
      });
      return;
    }

    res.json({ success: true, data: order });
  } catch (err) {
    req.log.error(err, "Failed to fetch ERP-backed order");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch order" },
    });
  }
});

export default router;
