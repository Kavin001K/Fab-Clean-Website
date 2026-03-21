// src/app.ts
import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";

// src/routes/index.ts
import { Router as Router6 } from "express";

// src/routes/health.ts
import { Router } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";
var router = Router();
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});
var health_default = router;

// src/routes/services.ts
import { Router as Router2 } from "express";

// src/data/services.ts
var services = [
  {
    id: "dry-cleaning",
    slug: "dry-cleaning",
    name: "Premium Dry Cleaning",
    description: "Fab Clean's dry cleaning uses eco-friendly solvents and state-of-the-art machines to tackle even the toughest stains. Perfect for delicate items such as silk sarees, sherwani, lehenga, blazers, and designer garments. Our process involves sorting by fabric type, individual spot treatment with imported solutions, machine processing with eco-friendly solvents, and meticulous finishing.",
    shortDescription: "Eco-friendly dry cleaning for your most delicate and precious garments.",
    icon: "shirt",
    category: "Cleaning",
    startingPrice: 45,
    features: [
      "Eco-friendly imported solvents",
      "Individual spot treatment",
      "Expert finishing and pressing",
      "Suitable for silk, leather, and designer wear",
      "Meticulous quality check before handover"
    ]
  },
  {
    id: "premium-laundry",
    slug: "premium-laundry",
    name: "Premium Laundry",
    description: "Fab Clean's flagship laundry service is built on an extensive multi-step washing process designed to deliver consistently clean, fresh results. Each item is assessed, machine-washed with branded antiseptic detergents, controlled-dried to preserve fabric integrity, and expertly steam-ironed before packaging.",
    shortDescription: "Multi-step laundry with antiseptic detergents, steam ironing, and quality inspection.",
    icon: "washing-machine",
    category: "Laundry",
    startingPrice: 45,
    features: [
      "Pre-wash fabric assessment",
      "Antiseptic detergents and fabric softeners",
      "Controlled drying to prevent shrinkage",
      "Garment-specific steam ironing",
      "Expert quality inspection",
      "Folded, hanger, or vacuum-packed finish"
    ]
  },
  {
    id: "laundry-by-kg",
    slug: "laundry-by-kg",
    name: "Laundry by Kilogram",
    description: "For everyday regular clothing, Fab Clean offers a kilogram-based laundry option \u2014 providing economic convenience for bulk washes. Ideal for working professionals and families looking for regular, cost-effective garment care without the need for individual-item pricing.",
    shortDescription: "Bulk laundry at \u20B9120/kg (wash+iron) or \u20B970/kg (wash+fold) for everyday wear.",
    icon: "scale",
    category: "Laundry",
    startingPrice: 70,
    features: [
      "Wash + Iron: \u20B9120 per kg",
      "Wash + Fold: \u20B970 per kg",
      "Ideal for bulk everyday clothing",
      "Applicable for men's clothing",
      "Cost-effective for families and professionals"
    ]
  },
  {
    id: "shoe-cleaning",
    slug: "shoe-cleaning",
    name: "Premium Shoe Cleaning",
    description: "Shoe cleaning is treated as a specialized service at Fab Clean, given the variety of materials and stain types involved. We are a one-stop solution for leather bags, sports shoes, sneakers, canvas shoes, leather shoes, and sandals.",
    shortDescription: "Specialized shoe cleaning for all types \u2014 sneakers, leather, canvas, and more.",
    icon: "footprints",
    category: "Specialty",
    startingPrice: 300,
    features: [
      "Sports shoes & sneakers: \u20B9300",
      "Leather shoes: \u20B9400",
      "Deep cleaning for all materials",
      "Canvas, mesh, synthetic, genuine leather",
      "Deodorizing and conditioning"
    ]
  },
  {
    id: "bag-cleaning",
    slug: "bag-cleaning",
    name: "Bag Cleaning",
    description: "Fab Clean offers specialized bag cleaning services for leather bags, tote bags, and other premium accessories. This positions Fab Clean as a complete personal accessory care provider, not just a clothing-focused laundry service.",
    shortDescription: "Expert cleaning for leather bags, totes, and premium accessories from \u20B9150.",
    icon: "briefcase",
    category: "Specialty",
    startingPrice: 150,
    features: [
      "Starting from \u20B9150",
      "Leather bag specialists",
      "Tote bags and designer accessories",
      "Stain treatment and conditioning",
      "Safe for premium materials"
    ]
  },
  {
    id: "curtain-cleaning",
    slug: "curtain-cleaning",
    name: "Curtain Cleaning",
    description: "Curtain cleaning is described as a 'tedious job' that Fab Clean handles with heavy-duty machines and expert care. The service returns curtains fresh and aromatic, making it ideal for households, offices, and commercial spaces.",
    shortDescription: "Heavy-duty curtain cleaning returning them fresh, clean, and aromatic.",
    icon: "layout",
    category: "Home Furnishings",
    startingPrice: 150,
    features: [
      "Heavy-duty cleaning machines",
      "With and without lining",
      "Fresh and aromatic finish",
      "Ideal for homes, offices, commercial spaces",
      "Window and door curtains"
    ]
  },
  {
    id: "leather-cleaning",
    slug: "leather-cleaning",
    name: "Leather Cleaning",
    description: "Fab Clean identifies itself as rare in the Pollachi market for its leather cleaning expertise. Leather requires specialized tools and techniques \u2014 neither dry cleaning solvents nor plain water are adequate. We are one of the few services in the area equipped to handle leather goods correctly.",
    shortDescription: "Rare specialized leather cleaning using expert tools \u2014 unique in the Pollachi market.",
    icon: "gem",
    category: "Specialty",
    startingPrice: 400,
    features: [
      "Specialized leather cleaning tools",
      "Safe for genuine and faux leather",
      "Conditioning and restoration",
      "Rare expertise in Pollachi region",
      "Leather jackets, shoes, bags, accessories"
    ]
  },
  {
    id: "steam-ironing",
    slug: "steam-ironing",
    name: "Steam Ironing",
    description: "Fab Clean offers standalone steam ironing services for customers who need their clothes crisply pressed without a full wash. The service uses garment-specific steam ironing equipment to ensure a smooth, wrinkle-free finish.",
    shortDescription: "Garment-specific steam ironing for a crisp, wrinkle-free finish \u2014 no wash required.",
    icon: "zap",
    category: "Ironing",
    startingPrice: 25,
    features: [
      "Garment-specific equipment",
      "Smooth wrinkle-free finish",
      "No wash required",
      "Quick turnaround",
      "Professional press and fold"
    ]
  }
];
var pricingData = [
  {
    category: "Regular Wash Services",
    items: [
      { item: "Shirt White/Color", type: "Wash + Starch", price: 45 },
      { item: "Pant White/Color", type: "Wash + Starch", price: 50 },
      { item: "Dhoti White/Color", type: "Wash + Starch", price: 50 },
      { item: "Shirt", type: "Wash + Iron", price: 45 },
      { item: "Pant", type: "Wash + Iron", price: 45 },
      { item: "Dhoti", type: "Wash + Iron", price: 45 },
      { item: "T-Shirt", type: "Wash + Iron", price: 45 },
      { item: "Jeans", type: "Wash + Iron", price: 45 }
    ]
  },
  {
    category: "Dry Cleaning \u2014 Premium",
    items: [
      { item: "Shirt / T-Shirt", type: "Dry Clean", price: 150 },
      { item: "Pant / Trousers", type: "Dry Clean", price: 175 },
      { item: "Coat / Blazer", type: "Dry Clean", price: 350 },
      { item: "Waist Coat", type: "Dry Clean", price: 250 },
      { item: "Sherwani", type: "Dry Clean", price: 550 },
      { item: "Kurta Plain", type: "Dry Clean", price: 175 },
      { item: "Silk Shirt", type: "Dry Clean", price: 200 },
      { item: "Silk Dhoti", type: "Dry Clean", price: 200 },
      { item: "Frock / Skirt", type: "Dry Clean", price: 200 },
      { item: "Lehenga", type: "Dry Clean", price: 650 },
      { item: "Pattu Saree", type: "Dry Clean", price: 400 },
      { item: "Bed Sheet Single", type: "Dry Clean", price: 150 },
      { item: "Bed Sheet Double", type: "Dry Clean", price: 200 },
      { item: "Blanket / Quilt", type: "Dry Clean", price: 350 },
      { item: "Pillow Cover", type: "Dry Clean", price: 75 },
      { item: "Cushion Cover", type: "Dry Clean", price: 75 },
      { item: "Curtain (per foot)", type: "Dry Clean", price: 30 },
      { item: "Carpet (per sq ft)", type: "Dry Clean", price: 30 }
    ]
  },
  {
    category: "Laundry by Kilogram",
    items: [
      {
        item: "Wash + Iron",
        type: "Men's Clothing",
        price: 120,
        unit: "per kg"
      },
      {
        item: "Wash + Fold",
        type: "Men's Clothing",
        price: 70,
        unit: "per kg"
      }
    ]
  },
  {
    category: "Shoe Cleaning",
    items: [
      { item: "Sports Shoes / Sneakers", type: "Deep Clean", price: 300 },
      { item: "Leather Shoes", type: "Specialized Care", price: 400 }
    ]
  },
  {
    category: "Bag Cleaning",
    items: [
      { item: "Bags (all types)", type: "Starting from", price: 150 }
    ]
  },
  {
    category: "Specialty Items",
    items: [
      { item: "Jacket", type: "Dry Clean", price: 325 },
      { item: "Children's Toys", type: "Clean", price: 100 }
    ]
  }
];

// src/routes/services.ts
var router2 = Router2();
router2.get("/services", (_req, res) => {
  res.json({ success: true, data: services });
});
router2.get("/services/:slug", (req, res) => {
  const service = services.find((s) => s.slug === req.params.slug);
  if (!service) {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Service not found" }
    });
    return;
  }
  res.json({ success: true, data: service });
});
router2.get("/pricing", (_req, res) => {
  res.json({ success: true, data: pricingData });
});
var services_default = router2;

// src/routes/pickups.ts
import { Router as Router3 } from "express";
import { db } from "@workspace/db";
import { pickupsTable } from "@workspace/db";
var router3 = Router3();
function generateBookingRef() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const rand = Math.floor(1e3 + Math.random() * 9e3);
  return `FC-PU-${year}-${rand}`;
}
router3.post("/pickups", async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      addressLat,
      addressLng,
      services: services2,
      specialInstructions,
      preferredDate,
      timeSlot,
      branch
    } = req.body;
    if (!name || !phone || !address || !services2?.length || !preferredDate || !timeSlot || !branch) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Missing required fields" }
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
      services: services2,
      specialInstructions: specialInstructions ?? null,
      preferredDate,
      timeSlot,
      branch
    });
    res.status(201).json({
      success: true,
      data: {
        bookingReference,
        message: `Your pickup has been scheduled! Reference: ${bookingReference}. We'll contact you at ${phone} to confirm.`
      }
    });
  } catch (err) {
    req.log.error(err, "Failed to schedule pickup");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to schedule pickup" }
    });
  }
});
router3.get("/orders/track", async (req, res) => {
  try {
    const { phone, ref } = req.query;
    if (!phone || !ref) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Phone and ref are required" }
      });
      return;
    }
    const pickup = await db.query.pickupsTable.findFirst({
      where: (t, { and, eq: eq2 }) => and(eq2(t.customerPhone, phone), eq2(t.bookingReference, ref))
    });
    if (!pickup) {
      res.status(404).json({
        success: false,
        error: { code: "NOT_FOUND", message: "Order not found" }
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
      { stage: "delivered", label: "Delivered", completed: pickup.status === "delivered" }
    ];
    res.json({
      success: true,
      data: {
        reference: pickup.bookingReference,
        status: pickup.status,
        stages
      }
    });
  } catch (err) {
    req.log.error(err, "Failed to track order");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to track order" }
    });
  }
});
var pickups_default = router3;

// src/routes/contact.ts
import { Router as Router4 } from "express";
import { db as db2 } from "@workspace/db";
import { contactsTable } from "@workspace/db";
var router4 = Router4();
router4.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Name, email and message are required" }
      });
      return;
    }
    await db2.insert(contactsTable).values({
      name,
      email,
      phone: phone ?? null,
      subject: subject ?? null,
      message
    });
    res.json({
      success: true,
      message: "Thank you for reaching out! We'll get back to you within 24 hours."
    });
  } catch (err) {
    req.log.error(err, "Failed to submit contact form");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to submit contact form" }
    });
  }
});
var contact_default = router4;

// src/routes/auth.ts
import { Router as Router5 } from "express";
import { db as db3 } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import crypto from "crypto";
var router5 = Router5();
var JWT_SECRET = process.env.JWT_SECRET ?? "fab-clean-dev-secret-2025";
var otpStore = /* @__PURE__ */ new Map();
function generateOtp() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
router5.post("/auth/send-otp", (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Phone number is required" }
    });
    return;
  }
  const otp = generateOtp();
  const expires = Date.now() + 5 * 60 * 1e3;
  otpStore.set(phone, { otp, expires, attempts: 0 });
  req.log.info({ phone: phone.slice(-4) }, "OTP sent");
  res.json({
    success: true,
    data: {
      message: `OTP sent to ${phone}. Valid for 5 minutes.`,
      expiresIn: 300
    }
  });
});
router5.post("/auth/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: "Phone and OTP are required" }
    });
    return;
  }
  const stored = otpStore.get(phone);
  if (!stored) {
    res.status(400).json({
      success: false,
      error: { code: "OTP_EXPIRED", message: "OTP expired or not sent. Please request a new one." }
    });
    return;
  }
  if (Date.now() > stored.expires) {
    otpStore.delete(phone);
    res.status(400).json({
      success: false,
      error: { code: "OTP_EXPIRED", message: "OTP has expired. Please request a new one." }
    });
    return;
  }
  if (stored.attempts >= 3) {
    otpStore.delete(phone);
    res.status(423).json({
      success: false,
      error: { code: "ACCOUNT_LOCKED", message: "Too many failed attempts. Please try again later." }
    });
    return;
  }
  if (stored.otp !== otp) {
    stored.attempts++;
    res.status(400).json({
      success: false,
      error: {
        code: "INVALID_OTP",
        message: `Invalid OTP. ${3 - stored.attempts} attempts remaining.`
      }
    });
    return;
  }
  otpStore.delete(phone);
  try {
    let user = await db3.query.usersTable.findFirst({
      where: eq(usersTable.phone, phone)
    });
    const isNewUser = !user;
    if (!user) {
      const [created] = await db3.insert(usersTable).values({ phone }).returning();
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
      maxAge: 30 * 24 * 60 * 60 * 1e3
    });
    res.json({
      success: true,
      data: {
        accessToken,
        isNewUser,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name ?? void 0,
          email: user.email ?? void 0,
          createdAt: user.createdAt.toISOString()
        }
      }
    });
  } catch (err) {
    req.log.error(err, "Auth error");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Authentication failed" }
    });
  }
});
router5.post("/auth/refresh", (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "No refresh token" }
    });
    return;
  }
  const accessToken = jwt.sign({ refreshed: true }, JWT_SECRET, { expiresIn: "15m" });
  res.json({ success: true, data: { accessToken } });
});
router5.post("/auth/logout", (req, res) => {
  res.clearCookie("refresh_token");
  res.json({ success: true, message: "Logged out successfully" });
});
var auth_default = router5;

// src/routes/index.ts
var router6 = Router6();
router6.use(health_default);
router6.use(services_default);
router6.use(pickups_default);
router6.use(contact_default);
router6.use(auth_default);
var routes_default = router6;

// src/lib/logger.ts
import pino from "pino";
var isProduction = process.env.NODE_ENV === "production";
var logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "res.headers['set-cookie']"
  ],
  ...isProduction ? {} : {
    transport: {
      target: "pino-pretty",
      options: { colorize: true }
    }
  }
});

// src/app.ts
var app = express();
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0]
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode
        };
      }
    }
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes_default);
var app_default = app;

// src/index.ts
var rawPort = process.env["PORT"];
if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided."
  );
}
var port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}
app_default.listen(port, () => {
  logger.info({ port }, "Server listening");
});
