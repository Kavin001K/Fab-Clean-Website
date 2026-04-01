import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface PortalUser {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  isActive: boolean;
}

const JWT_SECRET = process.env.JWT_SECRET ?? "fab-clean-dev-secret-2025";

function extractBearerToken(req: Request): string | null {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

export async function resolvePortalUser(req: Request): Promise<PortalUser | null> {
  const token = extractBearerToken(req);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string } | string;
    const userId = typeof decoded === "string" ? null : decoded.userId;
    if (!userId) return null;

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, userId),
    });

    if (!user || !user.isActive) return null;

    return {
      id: user.id,
      phone: user.phone,
      name: user.name ?? null,
      email: user.email ?? null,
      isActive: user.isActive,
    };
  } catch {
    return null;
  }
}

export async function requirePortalAuth(req: Request, res: Response, next: NextFunction) {
  const user = await resolvePortalUser(req);

  if (!user) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Authentication required" },
    });
    return;
  }

  (req as any).portalUser = user;
  next();
}
