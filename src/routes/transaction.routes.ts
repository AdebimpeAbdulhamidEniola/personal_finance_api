import { Router } from "express";
import { createTransactionController, getTransactionController, updateTransacctionController, deleteTransactionController } from "@/controllers/transaction.controller";
import { validateBody } from "@/middlewares/validation.middleware";
import { authenticate } from "@/middlewares/auth.middleware";
import { createTransactionSchema, updateTransactionSchema } from "@/schema/transaction.schema";

const router = Router({strict: true, caseSensitive: true});

router.post("/", authenticate, validateBody(createTransactionSchema), createTransactionController);
router.get("/", authenticate, getTransactionController);
router.put("/:id", authenticate, validateBody(updateTransactionSchema), updateTransacctionController);
router.delete("/:id", authenticate, deleteTransactionController);



export default router;