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

export const updateTransaction = async(id: string, userId: string, data: Partial<TransactionInput>) => {
   const result = await prisma.transaction.updateMany({
    where: {id, userId},
    data,
   })
   return result.count
}

export const deleteTransaction = async(id: string, userId:string) => {
    const result = await prisma.transaction.deleteMany({
        where: {
            id, userId
        }
    })
    return result.count
}
