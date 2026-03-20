import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import servicesRouter from "./services.js";
import pickupsRouter from "./pickups.js";
import contactRouter from "./contact.js";
import authRouter from "./auth.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(pickupsRouter);
router.use(contactRouter);
router.use(authRouter);

export default router;
