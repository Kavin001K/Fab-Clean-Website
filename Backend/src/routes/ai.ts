import { Router, type IRouter } from "express";
import { analyzeReviewWithGemini } from "../lib/gemini.js";

const router: IRouter = Router();

router.post("/ai/review-insights", async (req, res) => {
  try {
    const { feedback, rating } = req.body as {
      feedback?: string;
      rating?: number | string;
    };

    const numericRating = Number(rating);

    if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Rating must be a number between 1 and 5" },
      });
      return;
    }

    if (typeof feedback !== "string" || feedback.trim().length < 2) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Feedback is required" },
      });
      return;
    }

    const insight = await analyzeReviewWithGemini({
      feedback: feedback.trim(),
      rating: numericRating,
    });

    res.json({
      success: true,
      data: insight,
    });
  } catch (err) {
    req.log.error(err, "Failed to analyze review with Gemini");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to analyze review" },
    });
  }
});

export default router;
