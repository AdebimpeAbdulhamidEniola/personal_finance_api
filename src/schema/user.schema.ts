
import {z} from 'zod';

export const updateUserProfileSchema = z.object({
    name: z.string({
        error: (issue) => {
            if (issue.input === undefined) {
                return 'Name is required';
            }
    }}).min(2, 'Name must be at least 2 characters long').optional(),

    monthlyIncome: z.number({
        error: (issue) => {
            if (issue.input === undefined) {
                return 'Monthly income is required';
            }
            return 'Invalid monthly income'
        }
    }).positive('Monthly income must be a positive number').optional(),

    savingsGoal: z.number({
        error: (issue) => {
            if (issue.input === undefined) {    
                return 'Savings goal is required';
            }       
            return 'Invalid savings goal';
        }
    }).positive('Savings goal must be a positive number').optional(),
}).strict()

