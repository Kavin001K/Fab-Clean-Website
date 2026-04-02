import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET ?? "fab-clean-dev-secret-2025";

export type AuthenticatedUser = {
  userId: string;
  phone: string;
};

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthenticatedUser;
    }
  }
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "").slice(-10);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, JWT_SECRET) as Partial<AuthenticatedUser>;

    if (!payload.userId || !payload.phone) {
      res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Invalid session token" },
      });
      return;
    }

    req.authUser = {
      userId: payload.userId,
      phone: normalizePhone(payload.phone),
    };
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Session expired or invalid" },
    });
  }
}
