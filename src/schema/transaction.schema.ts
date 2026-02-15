import {z} from 'zod';


export const createTransactionSchema = z.object({
    amount: z.number({
        error: (issue) => { 
            if (issue.input === undefined) {
                return 'Amount is required';
            }
            return 'Invalid amount';
        }
    }).positive('Amount must be a positive number'),

    category: z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return 'Category is required';
            }
            return 'Invalid category';
        }
    }).min(3, 'Category must be at least 3 characters long'),

    description: z.string().optional(),

    type: z.enum(['INCOME', 'EXPENSE','SAVINGS'], {
        error: (issue) => {
            if (issue.input === undefined) {
                return 'Type is required';
            }
            return 'Invalid type';
        }
    })
});


export const updateTransactionSchema = z.object({
    amount: z.number().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(['INCOME', 'EXPENSE','SAVINGS']).optional(),
    
})

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>

        




