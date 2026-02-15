import { prisma } from "@/lib/prisma";
import {TransactionInput} from '../types/transaction.types'

export const createTransaction = async (data:TransactionInput) => {
    return await prisma.transaction.create({   
        data: {
            amount: data.amount,
            category: data.category,
            description: data.description,
            type: data.type,
            userId: data.userId
        }
       

    })

}

export const getTransactionsByUser = async (userId: string) => {
    return await prisma.transaction.findMany({
        where: {
            userId
        }
    })
}

export const updateTransaction = async(id: string, data: Partial<TransactionInput>) => {
    return await prisma.transaction.update({
        where: {
            id
        },
        data
    })
}

export const deleteTransaction = async(id: string) => {
    return await prisma.transaction.delete({
        where: {
            id
        }
    })
}
