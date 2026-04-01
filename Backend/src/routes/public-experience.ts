import { Router, type IRouter } from "express";
import {
  findOrderById,
  buildTrackingSteps,
  findOrderByOrderNumber,
  listPublicReviews,
  updateOrderFeedback,
} from "../lib/erp-data.js";

const router: IRouter = Router();

router.get("/track/:orderNumber", async (req, res) => {
  try {
    const order = await findOrderByOrderNumber(req.params.orderNumber);

    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Order not found" },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        ...order,
        steps: buildTrackingSteps(order),
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to track ERP order");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to track order" },
    });
  }
});

router.get("/feedback/context", async (req, res) => {
  try {
    const orderNumber =
      typeof req.query.orderNumber === "string" ? req.query.orderNumber : "";
    const orderId =
      typeof req.query.orderId === "string" ? req.query.orderId : "";
    const order = orderId
      ? await findOrderById(orderId)
      : await findOrderByOrderNumber(orderNumber);

    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Order not found" },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        status: order.status,
        fulfillmentType: order.fulfillmentType,
        totalAmount: order.totalAmount,
        items: order.items,
        existingFeedback: {
          rating: order.customerRating,
          comment: order.feedbackComment,
          submittedAt: order.feedbackSubmittedAt,
        },
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to load feedback context");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to load feedback context" },
    });
  }
});

router.post("/feedback", async (req, res) => {
  try {
    const orderId = String(req.body?.orderId || "").trim();
    const orderNumber = String(req.body?.orderNumber || "").trim();
    const rating = Number(req.body?.rating);
    const comment =
      typeof req.body?.comment === "string" ? req.body.comment.trim() : "";
    const metadata =
      req.body?.metadata && typeof req.body.metadata === "object"
        ? req.body.metadata
        : {};

    if ((!orderId && !orderNumber) || !Number.isFinite(rating) || rating < 1 || rating > 5) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "orderId or orderNumber and a rating between 1 and 5 are required",
        },
      });
      return;
    }

    const updatedOrder = await updateOrderFeedback({
      orderId,
      orderNumber,
      rating,
      comment,
      metadata,
    });

    if (!updatedOrder) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Order not found" },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        rating: updatedOrder.customerRating,
        comment: updatedOrder.feedbackComment,
        feedbackSubmittedAt: updatedOrder.feedbackSubmittedAt,
        googleReviewEligible: rating >= 4,
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to submit ERP-backed feedback");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to submit feedback" },
    });
  }
});

router.get("/reviews/top", async (req, res) => {
  try {
    const result = await listPublicReviews({ topOnly: true });
    res.json({ success: true, data: result.data });
  } catch (err) {
    req.log.error(err, "Failed to fetch top reviews");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch top reviews" },
    });
  }
});

router.get("/reviews/best", async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const pageSize = Number(req.query.pageSize || 12);
    const result = await listPublicReviews({ page, pageSize });

    res.json({
      success: true,
      data: result.data,
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        hasMore: result.hasMore,
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to fetch best reviews");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch best reviews" },
    });
  }
});

export default router;
