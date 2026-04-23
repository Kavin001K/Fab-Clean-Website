import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { erpOrders, erpCustomers } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { authenticate } from "../middleware/auth"; // Assuming there is an auth middleware

const router: IRouter = Router();

// Get order history and wallet info from ERP
router.get("/erp/customer-summary", authenticate, async (req: any, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.json({
        hasErpAccount: false,
        message: "No linked ERP account found for this user."
      });
    }

    // 1. Fetch Customer Summary (Wallet, Credit)
    const customer = await db.query.erpCustomers.findFirst({
      where: eq(erpCustomers.id, customerId)
    });

    // 2. Fetch Orders
    const orders = await db.query.erpOrders.findMany({
      where: eq(erpOrders.customerId, customerId),
      orderBy: [desc(erpOrders.createdAt)],
      limit: 10
    });

    res.json({
      hasErpAccount: true,
      profile: {
        name: customer?.name,
        email: customer?.email,
        phone: customer?.phone,
        walletBalance: customer?.walletBalanceCache,
        creditBalance: customer?.creditBalance,
        creditLimit: customer?.creditLimit
      },
      recentOrders: orders
    });
  } catch (error: any) {
    console.error("Error fetching ERP data:", error);
    res.status(500).json({ error: "Failed to fetch ERP data", details: error.message });
  }
});

export default router;
