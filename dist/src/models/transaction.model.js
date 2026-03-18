import { prisma } from "@/lib/prisma";
export const createTransaction = async (data) => {
    return await prisma.transaction.create({
        data: {
            amount: data.amount,
            category: data.category,
            description: data.description,
            type: data.type,
            userId: data.userId
        }
    });
};
export const getTransactionsByUser = async (userId) => {
    return await prisma.transaction.findMany({
        where: {
            userId
        }
    });
};
export const updateTransaction = async (id, data) => {
    return await prisma.transaction.update({
        where: {
            id
        },
        data
    });
};
export const deleteTransaction = async (id) => {
    return await prisma.transaction.delete({
        where: {
            id
        }
    });
};
