import {Request, Response, NextFunction} from "express"
import { handleResponse } from "@/utils/success.utils";
import { AppError } from "@/utils/error.utils";
import {getTransactionsByUser} from "@/models/transaction.model";
import {getCategoryWiseSpending} from "@/models/report.model";




//get monthly report
export const getMonthlyReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }

        //get the transactions for the user and filter by current month
        const transactions = await getTransactionsByUser(userId);
        //filter by current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyTransactions = transactions.filter(transaction => {
            return transaction.createdAt.getMonth() === currentMonth && transaction.createdAt.getFullYear() === currentYear;
        });
        //calculate total income and expenses
        const totalIncome = monthlyTransactions.filter(transaction => transaction.type === "INCOME").reduce((total, transaction) => total + transaction.amount, 0);
        const totalExpenses = monthlyTransactions.filter(transaction => transaction.type === "EXPENSE").reduce((total, transaction) => total + transaction.amount, 0);

        //calculate savings
        const savings = totalIncome - totalExpenses;
        //return the report
        return handleResponse(res, 200, "Monthly report retrieved successfully", {
            totalIncome,
            totalExpenses,
            savings
        });
    

        
    }
    catch(error){
        next(error)
    }
}


// Helper function to generate random colors for charts
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Helper function to format data for pie chart
const formatPieChartData = (categoryWiseSpending: any[]) => {
    return categoryWiseSpending.map(item => ({
        category: item.category,
        amount: item._sum.amount || 0,
        backgroundColor: getRandomColor()
    }));
};

// Helper function to format data for histogram
const formatHistogramData = (categoryWiseSpending: any[]) => {
    return categoryWiseSpending.map(item => ({
        category: item.category,
        amount: item._sum.amount || 0,
        backgroundColor: getRandomColor()
    }));
};

// Charts and graph controller
export const getChartsAndGraph = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new AppError("User not authenticated", 401);
        }

        const categoryWiseSpending = await getCategoryWiseSpending(userId);
        
        // Format data for different chart types
        const pieChartData = formatPieChartData(categoryWiseSpending);
        const histogramData = formatHistogramData(categoryWiseSpending);
        
        return handleResponse(res, 200, "Charts and graph retrieved successfully", {
            pieChartData,
            histogramData
        });
    }
    catch(error){
        next(error)
    }
}

