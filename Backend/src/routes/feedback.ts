import { Router, type IRouter } from "express";
import { analyzeReviewWithGemini } from "../lib/gemini.js";
import {
  callRpc,
  fetchOrderByIdentifier,
  fetchReviewByOrderId,
  updateOrder,
  upsertReview,
} from "../lib/supabase-admin.js";

const router: IRouter = Router();

router.get("/feedback/order/:identifier", async (req, res) => {
  try {
    const identifier = req.params.identifier;
    const order = await fetchOrderByIdentifier(identifier);

    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Order not found" },
      });
      return;
    }

    const existingReview = await fetchReviewByOrderId(order.id);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        customerName: order.customer_name,
        status: order.status,
        existingReview,
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to load feedback order");
    const message = err instanceof Error ? err.message : "Failed to load order for feedback";
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to load order for feedback",
        details: process.env["NODE_ENV"] === "production" ? undefined : message,
      },
    });
  }
});

router.post("/feedback/submit", async (req, res) => {
  try {
    const { identifier, rating, feedback } = req.body as {
      identifier?: string;
      rating?: number | string;
      feedback?: string;
    };

    const numericRating = Number(rating);

    if (!identifier?.trim()) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Order ID is required" },
      });
      return;
    }

    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Rating must be between 1 and 5" },
      });
      return;
    }

    if (!feedback?.trim()) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Feedback is required" },
      });
      return;
    }

    const order = await fetchOrderByIdentifier(identifier);
    if (!order) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Order not found" },
      });
      return;
    }

    const reviewInsight = await analyzeReviewWithGemini({
      feedback: feedback.trim(),
      rating: numericRating,
    });

    const feedbackStatus =
      reviewInsight.sentiment === "positive" && reviewInsight.score >= 0.65
        ? "published"
        : "reviewed";

    const review = await upsertReview({
      order_id: order.id,
      customer_id: order.customer_id ?? null,
      rating: numericRating,
      feedback: feedback.trim(),
      feedback_source: "website_manual_feedback",
      feedback_status: feedbackStatus,
      ai_category: reviewInsight.category,
      ai_sentiment: reviewInsight.sentiment,
      ai_score: reviewInsight.score,
      is_featured: false,
      is_top_10: false,
    });

    await updateOrder(order.id, {
      rating: numericRating,
      feedback: feedback.trim(),
      feedback_date: new Date().toISOString().slice(0, 10),
      feedback_time: new Date().toTimeString().slice(0, 8),
      feedback_source: "website_manual_feedback",
      feedback_status: feedbackStatus,
      ai_category: reviewInsight.category,
      ai_sentiment: reviewInsight.sentiment,
      ai_score: reviewInsight.score,
    });

    await callRpc("refresh_review_rankings");

    res.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.order_number,
        reviewId: review.id,
        insight: reviewInsight,
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to submit feedback");
    const message = err instanceof Error ? err.message : "Failed to submit feedback";
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to submit feedback",
        details: process.env["NODE_ENV"] === "production" ? undefined : message,
      },
    });
  }
});

export default router;
