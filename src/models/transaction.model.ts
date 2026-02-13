import { prisma } from "@/lib/prisma";
import {Prisma} from '../generated/prisma/client'
import { TransactionInput } from "@/types/transaction.types";

export const createTransaction = async (data:TransactionInput) => {
    return await prisma.transaction.create({   
        data: {
            amount: data.amount,
            category: data.category,
            description: data.description,
            type: data.type,
        }
       
    })