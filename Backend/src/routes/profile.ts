import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requirePortalAuth } from "../lib/portal-auth.js";

const router: IRouter = Router();

router.get("/users/profile", requirePortalAuth, async (req, res) => {
  const user = (req as any).portalUser;
  res.json({
    success: true,
    data: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    },
  });
});

router.patch("/users/profile", requirePortalAuth, async (req, res) => {
  try {
    const user = (req as any).portalUser;
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : undefined;
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : undefined;

    const [updated] = await db
      .update(usersTable)
      .set({
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, user.id))
      .returning();

    res.json({
      success: true,
      data: {
        id: updated.id,
        phone: updated.phone,
        name: updated.name,
        email: updated.email,
        isActive: updated.isActive,
      },
    });
  } catch (err) {
    req.log.error(err, "Failed to update customer portal profile");
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to update profile" },
    });
  }
});

export default router;
