import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import cookieParser from "cookie-parser";

import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app: Express = express();

// Trust the first proxy (Render load balancer) so rate limiting works per user IP
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

app.get("/", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "fab-clean-backend",
  });
});

// General API rate limiting — generous limit for normal browsing
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: "TOO_MANY_REQUESTS", message: "Too many requests. Please try again in a few minutes." } },
});
app.use("/api", generalLimiter);

// Strict rate limiting for auth endpoints only (OTP abuse prevention)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: "TOO_MANY_REQUESTS", message: "Too many login attempts. Please wait a few minutes before trying again." } },
});
app.use("/api/auth", authLimiter);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Global Error Handler to prevent stack trace leaks
import { NextFunction, Request, Response } from "express";

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  req.log?.error(err, "Unhandled API Exception");
  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred while processing your request. Please try again later.",
    },
  });
});

export default app;
