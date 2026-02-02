import { Router } from "express";
import { ProfileController } from "./controller/profile.controller.js";
import { authGuard } from "../../middleware/middleware.js";

const router = Router();

/**
 * Auth required for all profile routes
 */
router.get("/", authGuard, ProfileController.get);
router.post("/", authGuard, ProfileController.upsert);
router.put("/", authGuard, ProfileController.upsert);

export default router;
