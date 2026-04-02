import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../lib/auth.js";
import {
  fetchCustomerByPhone,
  fetchOrdersByPhone,
  fetchOwnedOrderById,
  mapWalletSummary,
  updateCustomerById,
} from "../lib/supabase-admin.js";

const router: IRouter = Router();

router.use(requireAuth);

function mapOrder(order: Awaited<ReturnType<typeof fetchOrdersByPhone>>[number]) {
  return {
    id: order.id,
    reference: order.order_number,
    status: order.status,
    services: Array.isArray(order.items)
      ? order.items.map((item: any) => item.serviceName || item.name || "Service")
      : [],
    branch: order.fulfillment_type || "pickup",
    scheduledDate: order.pickup_date || undefined,
    createdAt: order.created_at,
    totalAmount: Number(order.total_amount ?? 0),
  };
}

router.get("/orders", async (req, res) => {
  try {
    const orders = await fetchOrdersByPhone(req.authUser!.phone);
    res.json({
      success: true,
      data: orders.map(mapOrder),
    });
  } catch (err) {
    req.log.error(err, "Failed to list portal orders");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to load orders" },
    });
  }
});

router.get("/orders/:id", async (req, res) => {
  try {
    const order = await fetchOwnedOrderById(req.authUser!.phone, req.params.id);
    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Order not found" },
      });
      return;
    }

    res.json({
      success: true,
      data: mapOrder(order),
    });
  } catch (err) {
    req.log.error(err, "Failed to load portal order");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to load order" },
    });
  }
});

router.get("/users/profile", async (req, res) => {
  try {
    const [user, customer] = await Promise.all([
      db.query.usersTable.findFirst({
        where: eq(usersTable.id, req.authUser!.userId),
      }),
      fetchCustomerByPhone(req.authUser!.phone),
    ]);

    res.json({
      success: true,
      data: {
        id: user?.id || req.authUser!.userId,
        phone: req.authUser!.phone,
        name: user?.name || customer?.name || undefined,
        email: user?.email || customer?.email || undefined,
        createdAt: user?.createdAt?.toISOString?.() || customer?.created_at || undefined,
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to load user profile");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to load profile" },
    });
  }
});

router.patch("/users/profile", async (req, res) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : undefined;
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : undefined;

    const [updatedUser, customer] = await Promise.all([
      db
        .update(usersTable)
        .set({
          ...(name !== undefined ? { name: name || null } : {}),
          ...(email !== undefined ? { email: email || null } : {}),
        })
        .where(eq(usersTable.id, req.authUser!.userId))
        .returning()
        .then((rows) => rows[0]),
      fetchCustomerByPhone(req.authUser!.phone),
    ]);

    if (customer?.id) {
      await updateCustomerById(customer.id, {
        ...(name !== undefined ? { name: name || null } : {}),
        ...(email !== undefined ? { email: email || null } : {}),
      });
    }

    res.json({
      success: true,
      data: {
        id: updatedUser?.id || req.authUser!.userId,
        phone: req.authUser!.phone,
        name: updatedUser?.name || customer?.name || undefined,
        email: updatedUser?.email || customer?.email || undefined,
        createdAt: updatedUser?.createdAt?.toISOString?.() || customer?.created_at || undefined,
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to update user profile");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to update profile" },
    });
  }
});

router.get("/wallet/summary", async (req, res) => {
  try {
    const customer = await fetchCustomerByPhone(req.authUser!.phone);
    res.json({
      success: true,
      data: {
        ...mapWalletSummary(customer),
        currency: "INR",
        available: Boolean(customer),
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to load wallet summary");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to load wallet summary" },
    });
  }
});

export default router;
