import { handleResponse } from "@/utils/success.utils";
import { AppError } from "@/utils/error.utils";
import { Request, Response, NextFunction } from "express";
import { getTransactionsByUser } from "@/models/transaction.model";
import { generateInsights } from "@/services/ai.services";
import { findUserById } from "@/models/user.model";

export const aiInsightController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }
        //get transactions by a specific user
        const transaction = await getTransactionsByUser(userId)
        //get the monthly income of a specific user
        const user = await findUserById(userId)
        const monthlyIncome = user?.monthlyIncome as number 
        const financialAdvice = await generateInsights(transaction, monthlyIncome)
        handleResponse(res, 200, "Financial advice generated successfully", financialAdvice)
    
    }
    catch(error){
        next(error)
    }
}
