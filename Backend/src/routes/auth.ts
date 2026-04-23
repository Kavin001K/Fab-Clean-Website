import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, erpCustomers } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router: IRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "fab-clean-dev-secret-2025";
const otpStore = new Map<string, { otp: string; expires: number; attempts: number }>();
const otpRequests = new Map<string, string>(); // Store reqId from MSG91 Widget API



function generateOtp(): string {
  // Use 4-digit OTP as per frontend requirement
  return Math.floor(1000 + Math.random() * 9000).toString();
}

router.post("/auth/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Phone number is required" },
    });
    return;
  }

  try {
    const authKey = process.env.MSG91_AUTH_KEY;

    if (!authKey) {
      req.log.warn("MSG91 configuration is missing. OTP not sent.");
      res.status(500).json({
        success: false,
        error: { code: "SERVER_ERROR", message: "OTP service is not configured properly." },
      });
      return;
    }

    // Generate our own OTP
    const otp = generateOtp();
    otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000, attempts: 0 }); // 5 minutes expiry

    // Send via Direct WhatsApp Template API
    const whatsappIntegratedNumber = process.env.MSG91_WHATSAPP_NUMBER || "15559458542";
    const whatsappTemplateName = process.env.MSG91_WHATSAPP_TEMPLATE_NAME || "verification_code_template";
    const whatsappNamespace = process.env.MSG91_WHATSAPP_NAMESPACE || "5b9c340a_3221_42e3_9b9f_98b402c0c8ac";

    const rawPayload = JSON.stringify({
      "integrated_number": whatsappIntegratedNumber,
      "content_type": "template",
      "payload": {
        "messaging_product": "whatsapp",
        "type": "template",
        "template": {
          "name": whatsappTemplateName,
          "language": {
            "code": "en",
            "policy": "deterministic"
          },
          "namespace": whatsappNamespace,
          "to_and_components": [
            {
              "to": [
                "91" + phone
              ],
              "components": {
                "body_1": {
                  "type": "text",
                  "value": otp
                },
                "button_1": {
                  "subtype": "url",
                  "type": "text",
                  "value": otp
                }
              }
            }
          ]
        }
      }
    });

    const response = await fetch("https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "authkey": authKey
      },
      body: rawPayload
    });

    const responseData = await response.text();
    req.log.info({ 
      phone: phone.slice(-4), 
      status: response.status,
      response: responseData,
      otp: process.env.NODE_ENV === 'development' ? otp : '****'
    }, "Direct WhatsApp OTP Request Sent");

    if (!response.ok) {
      throw new Error(`MSG91 API error: ${response.status} ${responseData}`);
    }

    res.json({
      success: true,
      data: {
        message: `OTP sent successfully.`,
        expiresIn: 300,
      },
    });
  } catch (error) {




    req.log.error({ phone: phone.slice(-4), error }, "Failed to send OTP");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to send OTP. Please try again." },
    });
  }
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

  try {
    const storedData = otpStore.get(phone);

    if (!storedData) {
      res.status(400).json({
        success: false,
        error: { code: "RETRY_REQUIRED", message: "OTP expired or not requested. Please request a new one." },
      });
      return;
    }

    if (Date.now() > storedData.expires) {
      otpStore.delete(phone);
      res.status(400).json({
        success: false,
        error: { code: "EXPIRED_OTP", message: "OTP has expired. Please request a new one." },
      });
      return;
    }

    if (storedData.otp !== otp) {
      storedData.attempts += 1;
      if (storedData.attempts >= 3) {
        otpStore.delete(phone); // Lock out after 3 attempts
      }
      res.status(400).json({
        success: false,
        error: { code: "INVALID_OTP", message: "Invalid OTP code." },
      });
      return;
    }

    // OTP Verification Successful
    otpStore.delete(phone); // Cleanup

    // 1. Find or create website user
    let user = await db.query.usersTable.findFirst({
      where: eq(usersTable.phone, phone),
    });

    const isNewUser = !user;

    if (!user) {
      // Try to find a matching ERP customer first
      // We use the normalize_phone_e164 function we ensured exists in the DB
      const erpCustomer = await db.query.erpCustomers.findFirst({
        where: sql`normalize_phone_e164(${erpCustomers.phone}) = normalize_phone_e164(${phone})`
      });

      console.log(`Linking new website user to ERP customer: ${erpCustomer?.id || 'none'}`);

      const [created] = await db
        .insert(usersTable)
        .values({ 
          phone,
          customerId: erpCustomer?.id || null,
          name: erpCustomer?.name || null,
          email: erpCustomer?.email || null
        })
        .returning();
      user = created;
    } else if (!user.customerId) {
       // If user exists but isn't linked, try linking now
       const erpCustomer = await db.query.erpCustomers.findFirst({
         where: sql`normalize_phone_e164(${erpCustomers.phone}) = normalize_phone_e164(${phone})`
       });
       if (erpCustomer) {
         console.log(`Linking existing website user to ERP customer: ${erpCustomer.id}`);
         await db.update(usersTable)
           .set({ 
             customerId: erpCustomer.id,
             name: user.name || erpCustomer.name,
             email: user.email || erpCustomer.email
           })
           .where(eq(usersTable.id, user.id));
         user.customerId = erpCustomer.id;
       }
    }

    const accessToken = jwt.sign(
      { userId: user.id, phone: user.phone, customerId: user.customerId },
      JWT_SECRET,
      { expiresIn: "1h" } // Increased to 1h for better UX
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
          customerId: user.customerId ?? undefined,
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
