import { handleResponse } from "@/utils/success.utils";
import { AppError } from "@/utils/error.utils";
import { getTransactionsByUser } from "@/models/transaction.model";
import { generateInsights, generateBudgetPlan } from "@/services/ai.services";
import { findUserById } from "@/models/user.model";
export const aiInsightController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }
        //get transactions by a specific user
        const transaction = await getTransactionsByUser(userId);
        //get the monthly income of a specific user
        const user = await findUserById(userId);
        const monthlyIncome = user?.monthlyIncome;
        const financialAdvice = await generateInsights(transaction, monthlyIncome);
        handleResponse(res, 200, "Financial advice generated successfully", financialAdvice);
    }
    catch (error) {
        next(error);
    }
};
//get AI insighted budget
export const aiBudgetController = async (req, res, next) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }
        //get transactions by a specific user
        const transaction = await getTransactionsByUser(userId);
        //get the monthly income of a specific user
        const user = await findUserById(userId);
        const monthlyIncome = user?.monthlyIncome;
        const budget = await generateBudgetPlan(transaction, monthlyIncome);
        handleResponse(res, 200, "Budget generated successfully", budget);
    }
    catch (error) {
        next(error);
    }
};
