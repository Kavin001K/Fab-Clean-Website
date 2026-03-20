import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router: IRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "fab-clean-dev-secret-2025";
const otpStore = new Map<string, { otp: string; expires: number; attempts: number }>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/auth/send-otp", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Phone number is required" },
    });
    return;
  }

  const otp = generateOtp();
  const expires = Date.now() + 5 * 60 * 1000;
  otpStore.set(phone, { otp, expires, attempts: 0 });

  req.log.info({ phone: phone.slice(-4) }, "OTP sent");

  res.json({
    success: true,
    data: {
      message: `OTP sent to ${phone}. Valid for 5 minutes.`,
      expiresIn: 300,
    },
  });
});

router.post("/auth/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Phone and OTP are required" },
    });
    return;
  }

  const stored = otpStore.get(phone);

  if (!stored) {
    res.status(400).json({
      success: false,
      error: { code: "OTP_EXPIRED", message: "OTP expired or not sent. Please request a new one." },
    });
    return;
  }

  if (Date.now() > stored.expires) {
    otpStore.delete(phone);
    res.status(400).json({
      success: false,
      error: { code: "OTP_EXPIRED", message: "OTP has expired. Please request a new one." },
    });
    return;
  }

  if (stored.attempts >= 3) {
    otpStore.delete(phone);
    res.status(423).json({
      success: false,
      error: { code: "ACCOUNT_LOCKED", message: "Too many failed attempts. Please try again later." },
    });
    return;
  }

  if (stored.otp !== otp) {
    stored.attempts++;
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_OTP",
        message: `Invalid OTP. ${3 - stored.attempts} attempts remaining.`,
      },
    });
    return;
  }

  otpStore.delete(phone);

  try {
    let user = await db.query.usersTable.findFirst({
      where: eq(usersTable.phone, phone),
    });

    const isNewUser = !user;

    if (!user) {
      const [created] = await db
        .insert(usersTable)
        .values({ phone })
        .returning();
      user = created;
    }

    const accessToken = jwt.sign(
      { userId: user.id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(32).toString("hex");

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        accessToken,
        isNewUser,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name ?? undefined,
          email: user.email ?? undefined,
          createdAt: user.createdAt.toISOString(),
        },
      },
    });
  } catch (err) {
    req.log.error(err, "Auth error");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Authentication failed" },
    });
  }
});

router.post("/auth/refresh", (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "No refresh token" },
    });
    return;
  }
  const accessToken = jwt.sign({ refreshed: true }, JWT_SECRET, { expiresIn: "15m" });
  res.json({ success: true, data: { accessToken } });
});

router.post("/auth/logout", (req, res) => {
  res.clearCookie("refresh_token");
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
