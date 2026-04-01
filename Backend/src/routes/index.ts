import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import servicesRouter from "./services.js";
import pickupsRouter from "./pickups.js";
import contactRouter from "./contact.js";
import authRouter from "./auth.js";
import aiRouter from "./ai.js";
import publicOrdersRouter from "./public-orders.js";
import feedbackRouter from "./feedback.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(pickupsRouter);
router.use(contactRouter);
router.use(authRouter);
router.use(aiRouter);
router.use(publicOrdersRouter);
router.use(feedbackRouter);

export default router;
