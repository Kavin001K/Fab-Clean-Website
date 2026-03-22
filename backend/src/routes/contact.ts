import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Name, email and message are required" },
      });
      return;
    }

    await db.insert(contactsTable).values({
      name,
      email,
      phone: phone ?? null,
      subject: subject ?? null,
      message,
    });

    res.json({
      success: true,
      message: "Thank you for reaching out! We'll get back to you within 24 hours.",
    });
  } catch (err) {
    req.log.error(err, "Failed to submit contact form");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to submit contact form" },
    });
  }
});

export default router;
