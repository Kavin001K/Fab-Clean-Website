import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import servicesRouter from "./services.js";
import pickupsRouter from "./pickups.js";
import contactRouter from "./contact.js";
import authRouter from "./auth.js";
import ordersRouter from "./orders.js";
import profileRouter from "./profile.js";
import publicExperienceRouter from "./public-experience.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(servicesRouter);
router.use(pickupsRouter);
router.use(publicExperienceRouter);
router.use(ordersRouter);
router.use(contactRouter);
router.use(authRouter);
router.use(profileRouter);

export default router;
