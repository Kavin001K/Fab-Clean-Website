import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { pickupsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FC-PU-${year}-${rand}`;
}

router.post("/pickups", async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      addressLat,
      addressLng,
      services,
      specialInstructions,
      preferredDate,
      timeSlot,
      branch,
    } = req.body;

    if (!name || !phone || !address || !services?.length || !preferredDate || !timeSlot || !branch) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Missing required fields" },
      });
      return;
    }

    const bookingReference = generateBookingRef();

    await db.insert(pickupsTable).values({
      bookingReference,
      customerName: name,
      customerPhone: phone,
      address,
      addressLat: addressLat ?? null,
      addressLng: addressLng ?? null,
      services,
      specialInstructions: specialInstructions ?? null,
      preferredDate,
      timeSlot,
      branch,
    });

    res.status(201).json({
      success: true,
      data: {
        bookingReference,
        message: `Your pickup has been scheduled! Reference: ${bookingReference}. We'll contact you at ${phone} to confirm.`,
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to schedule pickup");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to schedule pickup" },
    });
  }
});

router.get("/orders/track", async (req, res) => {
  try {
    const { phone, ref } = req.query as { phone?: string; ref?: string };

    if (!phone || !ref) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Phone and ref are required" },
      });
      return;
    }

    const pickup = await db.query.pickupsTable.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.customerPhone, phone), eq(t.bookingReference, ref)),
    });

    if (!pickup) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Order not found" },
      });
      return;
    }

    const stages = [
      { stage: "received", label: "Order Received", completed: true },
      { stage: "sorting", label: "Sorting & Assessment", completed: ["sorting", "cleaning", "quality_check", "ready", "out_for_delivery", "delivered"].includes(pickup.status) },
      { stage: "cleaning", label: "Cleaning in Progress", completed: ["cleaning", "quality_check", "ready", "out_for_delivery", "delivered"].includes(pickup.status) },
      { stage: "quality_check", label: "Quality Check", completed: ["quality_check", "ready", "out_for_delivery", "delivered"].includes(pickup.status) },
      { stage: "ready", label: "Ready for Pickup/Delivery", completed: ["ready", "out_for_delivery", "delivered"].includes(pickup.status) },
      { stage: "out_for_delivery", label: "Out for Delivery", completed: ["out_for_delivery", "delivered"].includes(pickup.status) },
      { stage: "delivered", label: "Delivered", completed: pickup.status === "delivered" },
    ];

    res.json({
      success: true,
      data: {
        reference: pickup.bookingReference,
        status: pickup.status,
        stages,
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to track order");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to track order" },
    });
  }
});

export default router;
