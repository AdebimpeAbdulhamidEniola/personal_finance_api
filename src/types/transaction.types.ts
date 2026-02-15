import {TransactionType} from "../generated/prisma/client";

export interface TransactionInput {
    amount: number;
    category: string;
    description?: string;
    type: TransactionType
    userId:string
}






