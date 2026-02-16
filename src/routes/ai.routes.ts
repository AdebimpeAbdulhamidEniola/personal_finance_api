import { aiInsightController } from "@/controllers/ai.controller";
import { Router } from "express";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router({strict: true, caseSensitive: true});

router.get("/insights", authenticate, aiInsightController);

export default router;