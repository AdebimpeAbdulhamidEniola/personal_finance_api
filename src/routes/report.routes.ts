import { Router } from "express";
import { getMonthlyReport,getChartsAndGraph } from "../controllers/report.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router({caseSensitive: true, strict: true});

router.use(authenticate)

router.get("/monthly", getMonthlyReport);
router.get("/charts", getChartsAndGraph);

export default router;