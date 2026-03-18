import { prisma } from "../lib/prisma";
//get data for categorywise spending
export const getCategoryWiseSpending = async (userId) => {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    return await prisma.transaction.groupBy({
        by: ['category'],
        where: {
            userId,
            type: 'EXPENSE',
            createdAt: {
                gte: startOfMonth
            }
        },
        _sum: {
            amount: true
        }
    });
};
