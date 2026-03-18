import { Router } from "express";
import { getMonthlyReport, getChartsAndGraph } from "../controllers/report.controller";
const router = Router({ caseSensitive: true, strict: true });
router.get("/monthly", getMonthlyReport);
router.get("/charts", getChartsAndGraph);
export default router;
